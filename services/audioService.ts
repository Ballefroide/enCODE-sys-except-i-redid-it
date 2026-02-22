
/**
 * PROJECT ENCODE - NEURAL AUDIO ENGINE
 * Synthesizes SFX, Ambience, and Rhythmic Background Music using Web Audio API.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private ambienceSource: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;
  
  // Music Sequencer State
  private sequencerInterval: any = null;
  private currentStep = 0;
  private bpm = 105;
  private isMusicPlaying = false;

  constructor() {}

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public unlock() {
    this.initContext();
  }

  // --- AMBIENCE & MUSIC ---
  public startAmbience() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    const ctx = this.ctx!;
    
    // Static Ambience Gain
    this.ambienceGain = ctx.createGain();
    this.ambienceGain.gain.value = 0.03;
    this.ambienceGain.connect(this.masterGain!);

    // Low Hum (Base layer)
    this.ambienceSource = ctx.createOscillator();
    this.ambienceSource.type = 'sine';
    this.ambienceSource.frequency.setValueAtTime(55, ctx.currentTime);
    
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambienceSource.frequency);
    lfo.start();

    this.ambienceSource.connect(this.ambienceGain);
    this.ambienceSource.start();

    // White Noise (Airflow layer)
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.01;

    this.noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    this.noiseSource.start();

    // Start the Rhythmic Sequencer
    this.startSequencer();
  }

  private startSequencer() {
    const stepDuration = 60 / this.bpm / 4; // 16th notes
    this.currentStep = 0;
    
    this.sequencerInterval = setInterval(() => {
      this.playSequencerStep();
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepDuration * 1000);
  }

  private playSequencerStep() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // --- BASS LINE (Simple driving rhythm) ---
    // Patterns: A1, A1, A1, G1
    const bassSteps = [0, 3, 6, 8, 11, 14];
    if (bassSteps.includes(this.currentStep)) {
      let freq = 55; // A1
      if (this.currentStep >= 12) freq = 48.99; // G1
      this.triggerBass(freq, now);
    }

    // --- HI-HAT (Digital pulse) ---
    if (this.currentStep % 2 === 0) {
      this.triggerHiHat(now);
    }

    // --- SNARE / CLAP (Noise burst) ---
    if (this.currentStep === 4 || this.currentStep === 12) {
      this.triggerSnare(now);
    }

    // --- RANDOM MELODY CHIPS ---
    if (this.currentStep === 2 || this.currentStep === 10) {
      if (Math.random() > 0.5) {
        const notes = [220, 246.94, 277.18, 329.63]; // A3, B3, C#4, E4
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.triggerLead(note, now);
      }
    }
  }

  private triggerBass(freq: number, time: number) {
    const osc = this.ctx!.createOscillator();
    const g = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.12, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);

    osc.connect(g);
    g.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private triggerHiHat(time: number) {
    const osc = this.ctx!.createOscillator();
    const g = this.ctx!.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, time);
    
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.015, time + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    osc.connect(g);
    g.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  private triggerSnare(time: number) {
    const bufferSize = 0.1 * this.ctx!.sampleRate;
    const noiseBuffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = this.ctx!.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.04, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain!);
    noise.start(time);
    noise.stop(time + 0.1);
  }

  private triggerLead(freq: number, time: number) {
    const osc = this.ctx!.createOscillator();
    const g = this.ctx!.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.03, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    
    osc.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.4);
  }

  public stopAmbience() {
    this.isMusicPlaying = false;
    if (this.sequencerInterval) {
      clearInterval(this.sequencerInterval);
      this.sequencerInterval = null;
    }
    if (this.ambienceSource) {
      this.ambienceSource.stop();
      this.ambienceSource.disconnect();
      this.ambienceSource = null;
    }
    if (this.noiseSource) {
      this.noiseSource.stop();
      this.noiseSource.disconnect();
      this.noiseSource = null;
    }
  }

  // --- SFX ---
  public playClick() {
    this.initContext();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);

    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

    osc.connect(g);
    g.connect(this.masterGain!);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  public playSuccess() {
    this.initContext();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      g.gain.setValueAtTime(0, now + i * 0.05);
      g.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.3);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.3);
    });
  }

  public playError() {
    this.initContext();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.2);

    g.gain.setValueAtTime(0.1, now);
    g.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.connect(g);
    g.connect(this.masterGain!);
    osc.start();
    osc.stop(now + 0.2);
  }

  public playTally() {
    this.initContext();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);

    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

    osc.connect(g);
    g.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }
}

export const audio = new AudioService();
