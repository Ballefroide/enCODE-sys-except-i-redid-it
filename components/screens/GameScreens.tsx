
import React, { useState, useEffect, useRef } from 'react';
import { Level, GameSession, Language, DevOptions } from '../../types';
import { NeoButton, NeoCard, TypewriterText } from '../UI';
import { evaluateCodeSubmission, EvaluationResult } from '../../services/geminiService';
import { Code2, Send, Eye, Timer, Clock, Zap, BookOpen, Sparkles, Trophy, ChevronRight, Info, FileText, Keyboard, Lightbulb, CheckCircle2, XCircle, Loader2, LogOut, Database, Star, BarChart, Activity, Gauge, Terminal, ChevronLeft, Target, PlayCircle, ArrowLeft, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { MOCK_LEVELS, generateRandomDrill } from '../../constants';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../services/audioService';

// --- Syntax Intel for Manifest ---
const SYNTAX_INTEL: Record<string, string[]> = {
  [Language.HTML]: [
    "<h1>Title</h1> - Biggest Heading",
    "<p>Text</p> - Paragraph",
    "<a href='url'>Link</a> - Link to another page",
  ],
  [Language.CSS]: [
    "color: blue; - Change text color",
    "background-color: #000; - Change background",
  ]
};

const highlightCode = (code: string, language: Language) => {
  if (language === Language.GENERAL) return code;
  let grammar = Prism.languages.markup;
  if (language === Language.HTML) grammar = Prism.languages.markup;
  if (language === Language.CSS) grammar = Prism.languages.css;
  if (language === Language.JAVASCRIPT) grammar = Prism.languages.javascript;
  if (language === Language.JAVA) grammar = Prism.languages.java;
  if (language === Language.CPP) grammar = Prism.languages.clike;
  return Prism.highlight(code, grammar || Prism.languages.markup, language.toLowerCase());
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// --- Level Briefing Screen ---
interface BriefingProps {
  level: Level;
  onStart: () => void;
  onBack: () => void;
}

export const LevelBriefing: React.FC<BriefingProps> = ({ level, onStart, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full bg-[var(--bg-color)] p-6 lg:p-12 overflow-y-auto custom-scroll"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <NeoButton variant="secondary" onClick={onBack} className="p-2"><ChevronLeft size={18} /></NeoButton>
          <div>
            <span className="text-[8px] font-black uppercase opacity-60 tracking-widest text-[var(--primary)]">{level.language} // SECTOR_{level.id}</span>
            <h1 className="text-3xl lg:text-5xl font-black text-[var(--primary)] uppercase tracking-tighter">{level.title}</h1>
          </div>
        </div>

        <NeoCard title="Mission Intel" className="p-8 lg:p-10">
           <div className="text-base lg:text-xl font-bold leading-relaxed mb-6 opacity-90">
              <TypewriterText text={level.description} speed={20} />
           </div>
           
           <div className="bg-[var(--primary)]/10 p-5 border border-[var(--primary)]/20 rounded">
              <div className="flex items-center gap-2 mb-3">
                 <Target size={18} className="text-[var(--primary)]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Target Objective</span>
              </div>
              <p className="text-lg font-bold italic">"{level.objective}"</p>
           </div>
        </NeoCard>

        {level.lesson && (
          <NeoCard title="Technical Documentation" className="p-6 lg:p-8">
             <p className="text-sm lg:text-base leading-relaxed opacity-80">{level.lesson}</p>
          </NeoCard>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
           <NeoButton onClick={onStart} className="flex-1 py-5 text-xl">Initiate Calibration</NeoButton>
           <NeoButton onClick={onBack} variant="secondary" className="flex-1 py-5 text-xl">Abort Sequence</NeoButton>
        </div>
      </div>
    </motion.div>
  );
};

// --- Gameplay Screen ---
interface GameplayProps {
  level: Level;
  onFinish: (session: GameSession, skipResult?: boolean) => void;
  onExit: () => void;
  isAntiCheatEnabled: boolean;
  isAudioEnabled?: boolean;
}

export const Gameplay: React.FC<GameplayProps> = ({ level, onFinish, onExit, isAntiCheatEnabled, isAudioEnabled }) => {
  const [code, setCode] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showManifest, setShowManifest] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    setTimer(0);
    setEvalResult(null);
  }, [level.id]);

  useEffect(() => {
    if (evalResult || isEvaluating) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [evalResult, isEvaluating]);

  const handleSubmit = async () => {
    if (isAudioEnabled) audio.playClick();
    setIsEvaluating(true);
    const result = await evaluateCodeSubmission(level.objective, code, level.language);
    setEvalResult(result);
    setIsEvaluating(false);
  };

  const handleProcessCmd = () => {
    if (isAudioEnabled) audio.playClick();
    setShowManifest(true);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isAntiCheatEnabled) {
      e.preventDefault();
      if (isAudioEnabled) audio.playError();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fdfdfd] p-4 gap-4 overflow-hidden font-mono">
      {/* Top Level Container */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        
        {/* Left Pane: Editor */}
        <div className="flex-[3] flex flex-col border-2 border-black rounded-lg overflow-hidden bg-white relative">
          {/* Header Bar */}
          <div className="h-10 border-b-2 border-black flex items-center justify-between px-4 shrink-0 bg-white">
            <div className="flex items-center gap-6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                ST_{level.id.padStart(2, '0')}: {level.title.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowManifest(true)} className="flex items-center gap-2 px-3 py-0.5 border border-black rounded text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors">
                <FileText size={12} /> Manifest
              </button>
              <button onClick={onExit} className="flex items-center gap-2 px-3 py-0.5 border border-black rounded text-[10px] font-bold uppercase hover:bg-red-50 text-red-600 transition-colors">
                <X size={12} /> Disconnect
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-auto custom-scroll p-4" onPaste={handlePaste}>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={c => highlightCode(c, level.language)}
              padding={10}
              className="font-mono font-bold text-lg text-black min-h-full outline-none"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            />
          </div>

          {/* Manifest Overlay */}
          <AnimatePresence>
            {showManifest && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 z-20 p-8 flex flex-col"
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Mission Manifest</h3>
                  <button onClick={() => setShowManifest(false)} className="p-2 hover:bg-black/5 rounded">
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-6">
                   <div>
                      <span className="text-[10px] font-black uppercase opacity-40">Objective</span>
                      <p className="text-xl font-bold mt-1">{level.objective}</p>
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase opacity-40">Directives</span>
                      <p className="text-sm opacity-80 mt-1 leading-relaxed">{level.description}</p>
                   </div>
                   {SYNTAX_INTEL[level.language] && (
                     <div>
                        <span className="text-[10px] font-black uppercase opacity-40">Reference Manual</span>
                        <div className="mt-2 space-y-1">
                          {SYNTAX_INTEL[level.language].map((s, i) => (
                            <div key={i} className="text-xs font-bold border-l-2 border-black pl-3 py-1">{s}</div>
                          ))}
                        </div>
                     </div>
                   )}
                </div>
                <NeoButton onClick={() => setShowManifest(false)} variant="secondary" className="mt-auto py-4">Return to Terminal</NeoButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Pane: Command Center */}
        <div className="flex-[1.5] flex flex-col gap-4 overflow-hidden">
          
          {/* SYNC_VERIFIER */}
          <div className="flex-[2.5] border-2 border-black rounded-lg overflow-hidden bg-white flex flex-col">
            <div className="h-8 border-b-2 border-black bg-white flex items-center px-4 shrink-0">
               <span className="text-[10px] font-black uppercase tracking-widest">■ Sync_Verifier</span>
            </div>
            <div className="flex-1 bg-black m-2 rounded p-4 flex flex-col items-center justify-center text-center overflow-auto custom-scroll">
               <AnimatePresence mode="wait">
                 {isEvaluating ? (
                   <motion.div key="eval" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                     <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                     <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Analyzing Signal...</span>
                   </motion.div>
                 ) : evalResult ? (
                   <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                     <div className="text-6xl font-black text-white">{evalResult.score}%</div>
                     <p className="text-white/60 text-[10px] italic font-bold uppercase tracking-wider px-4">"{evalResult.feedback}"</p>
                     {!evalResult.isCorrect && (
                       <button onClick={() => setEvalResult(null)} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Recalibrate Buffer</button>
                     )}
                   </motion.div>
                 ) : (
                   <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">Standby // No Input Detected</div>
                 )}
               </AnimatePresence>
            </div>
          </div>

          {/* NODE_METRICS */}
          <div className="flex-1 border-2 border-black rounded-lg overflow-hidden bg-white flex flex-col">
            <div className="h-8 border-b-2 border-black bg-white flex items-center px-4 shrink-0">
               <span className="text-[10px] font-black uppercase tracking-widest">■ Node_Metrics</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center gap-3">
               <div className="flex justify-between items-center border-b border-black/5 pb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signal:</span>
                  <span className="text-[10px] font-black text-green-600 uppercase">Stable</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cycle_Time:</span>
                  <span className="text-[10px] font-black">{formatTime(timer)}</span>
               </div>
            </div>
          </div>

          {/* Stacked Actions */}
          <div className="flex flex-col gap-3 h-32 shrink-0">
            <button 
              onClick={handleProcessCmd}
              className="flex-1 bg-black text-white rounded font-black uppercase tracking-[0.3em] text-sm hover:bg-zinc-800 transition-colors active:scale-[0.98]"
            >
              Process_Cmd
            </button>
            <button 
              onClick={evalResult?.isCorrect ? () => onFinish({ levelId: level.id, startTime: Date.now()-(timer*1000), attempts: 1, code, accuracy: evalResult.score, timeElapsed: formatTime(timer), grade: evalResult.score >= 90 ? 'S' : evalResult.score >= 70 ? 'A' : 'B' }) : handleSubmit}
              disabled={isEvaluating || !code.trim()}
              className="flex-1 bg-black border-2 border-red-600/30 text-red-500 rounded font-black uppercase tracking-[0.3em] text-sm hover:bg-red-950/10 transition-colors flex items-center justify-center gap-3 disabled:opacity-20 active:scale-[0.98]"
            >
              {evalResult?.isCorrect ? "Finalize_Uplink >" : "Execute_Payload >"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Retention Mode Gameplay ---
export const RetentionGameplay: React.FC<{
  language: Language;
  onFinish: (session: GameSession) => void;
  onExit: () => void;
  isAntiCheatEnabled: boolean;
  devOptions: DevOptions;
  isAudioEnabled?: boolean;
}> = ({ language, onFinish, onExit, isAntiCheatEnabled, devOptions, isAudioEnabled }) => {
  const [code, setCode] = useState<string>('');
  const [currentTask, setCurrentTask] = useState<Level | null>(null);
  const [tasksCleared, setTasksCleared] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [taskStartTime, setTaskStartTime] = useState(Date.now());
  const [fastestTaskSeconds, setFastestTaskSeconds] = useState<number | null>(null);
  const [totalAccuracySum, setTotalAccuracySum] = useState(0);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [lastEvalStatus, setLastEvalStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  useEffect(() => {
    setCurrentTask(generateRandomDrill(language, 'Easy'));
    setTaskStartTime(Date.now());
  }, [language]);

  const handleSubmit = async () => {
    if (!currentTask) return;
    if (isAudioEnabled) audio.playClick();
    setIsEvaluating(true);
    setLastEvalStatus('idle');

    const result = await evaluateCodeSubmission(currentTask.objective, code, currentTask.language);
    
    setSubmissionsCount(prev => prev + 1);
    setTotalAccuracySum(prev => prev + result.score);

    if (result.isCorrect) {
      if (isAudioEnabled) audio.playSuccess();
      setLastEvalStatus('success');
      const timeTaken = (Date.now() - taskStartTime) / 1000;
      if (fastestTaskSeconds === null || timeTaken < fastestTaskSeconds) {
        setFastestTaskSeconds(timeTaken);
      }
      const session = { levelId: 'retention_step', code }; // minimal session for output tracking
      setTasksCleared(prev => prev + 1);
      
      setTimeout(() => {
        const nextDiff = tasksCleared > 10 ? 'Hard' : tasksCleared > 5 ? 'Medium' : 'Easy';
        setCurrentTask(generateRandomDrill(language, nextDiff as any));
        setCode('');
        setTaskStartTime(Date.now());
        setLastEvalStatus('idle');
      }, 800);
    } else {
      if (isAudioEnabled) audio.playError();
      setLastEvalStatus('failure');
    }
    setIsEvaluating(false);
  };

  const handleFinish = () => {
    const duration = (Date.now() - sessionStartTime) / 1000;
    const finalSession: GameSession = {
      levelId: 'retention',
      startTime: sessionStartTime,
      attempts: submissionsCount,
      code: '',
      accuracy: submissionsCount > 0 ? Math.round(totalAccuracySum / submissionsCount) : 0,
      timeElapsed: Math.floor(duration).toString(),
      grade: tasksCleared >= 15 ? 'S' : tasksCleared >= 10 ? 'A' : tasksCleared >= 5 ? 'B' : 'C',
      isRetention: true,
      retentionLanguage: language,
      score: tasksCleared,
      drillSessionStats: {
        totalAccuracySum,
        submissionsCount,
        fastestTaskSeconds,
        sessionDurationSeconds: duration
      }
    };
    onFinish(finalSession);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isAntiCheatEnabled) {
      e.preventDefault();
      if (isAudioEnabled) audio.playError();
    }
  };

  if (!currentTask) return null;

  return (
    <div className="flex flex-col h-full w-full bg-[#fdfdfd] p-4 gap-4 overflow-hidden font-mono">
      <div className="flex-1 flex gap-4 overflow-hidden">
        
        {/* Left Pane: Editor */}
        <div className="flex-[3] flex flex-col border-2 border-black rounded-lg overflow-hidden bg-white relative">
          <div className="h-10 border-b-2 border-black flex items-center justify-between px-4 shrink-0 bg-white">
            <div className="flex items-center gap-6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                STRESS_TEST_{language}: NODE_{tasksCleared.toString().padStart(2, '0')}
              </span>
            </div>
            <button onClick={handleFinish} className="flex items-center gap-2 px-3 py-0.5 border border-black rounded text-[10px] font-bold uppercase hover:bg-red-50 text-red-600 transition-colors">
              Terminate
            </button>
          </div>

          <div className="flex-1 overflow-auto custom-scroll p-4" onPaste={handlePaste}>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={c => highlightCode(c, currentTask.language)}
              padding={10}
              className="font-mono font-bold text-lg text-black min-h-full outline-none"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            />
          </div>
        </div>

        {/* Right Pane: Command Center */}
        <div className="flex-[1.5] flex flex-col gap-4 overflow-hidden">
          
          {/* SYNC_VERIFIER */}
          <div className="flex-[2.5] border-2 border-black rounded-lg overflow-hidden bg-white flex flex-col">
            <div className="h-8 border-b-2 border-black bg-white flex items-center px-4 shrink-0">
               <span className="text-[10px] font-black uppercase tracking-widest">■ Sync_Verifier</span>
            </div>
            <div className="flex-1 bg-black m-2 rounded p-6 flex flex-col items-center justify-center text-center overflow-hidden">
               <AnimatePresence mode="wait">
                  {isEvaluating ? (
                    <motion.div key="eval" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </motion.div>
                  ) : lastEvalStatus === 'success' ? (
                    <motion.div key="win" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-green-500 flex flex-col items-center">
                       <CheckCircle2 size={48} className="mb-2" />
                       <span className="text-[10px] font-black tracking-widest uppercase">Sync_Ok</span>
                    </motion.div>
                  ) : lastEvalStatus === 'failure' ? (
                    <motion.div key="fail" initial={{ x: -10 }} animate={{ x: 0 }} className="text-red-500 flex flex-col items-center">
                       <ShieldAlert size={48} className="mb-2" />
                       <span className="text-[10px] font-black tracking-widest uppercase">Payload_Error</span>
                    </motion.div>
                  ) : (
                    <div className="text-white space-y-4 w-full">
                       <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Active_Directive</div>
                       <p className="text-lg font-black uppercase leading-tight">{currentTask.objective}</p>
                       <p className="text-[9px] opacity-30 italic">"{currentTask.description}"</p>
                    </div>
                  )}
               </AnimatePresence>
            </div>
          </div>

          {/* NODE_METRICS */}
          <div className="flex-1 border-2 border-black rounded-lg overflow-hidden bg-white flex flex-col">
            <div className="h-8 border-b-2 border-black bg-white flex items-center px-4 shrink-0">
               <span className="text-[10px] font-black uppercase tracking-widest">■ Node_Metrics</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center gap-2">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nodes_Sync'd:</span>
                  <span className="text-[10px] font-black text-green-600">{tasksCleared}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signal_Str:</span>
                  <span className="text-[10px] font-black">Stable</span>
               </div>
            </div>
          </div>

          {/* Stacked Actions */}
          <div className="flex flex-col gap-3 h-32 shrink-0">
            <button 
              onClick={handleFinish}
              className="flex-1 bg-black text-white rounded font-black uppercase tracking-[0.3em] text-sm hover:bg-zinc-800 transition-colors"
            >
              Abort_All
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isEvaluating || !code.trim()}
              className="flex-1 bg-black border-2 border-red-600/30 text-red-500 rounded font-black uppercase tracking-[0.3em] text-sm hover:bg-red-950/10 transition-colors disabled:opacity-20"
            >
              Execute_Payload >
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Results Screen ---
export const ResultScreen: React.FC<{ 
  session: GameSession, 
  level: Level | null, 
  onNext: () => void, 
  onRetry: () => void, 
  onExit: () => void, 
  isAudioEnabled?: boolean 
}> = ({ session, level, onNext, onRetry, onExit }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full w-full p-8 lg:p-12 items-center justify-center bg-white font-mono overflow-hidden">
       <div className="w-full h-full flex items-center justify-center gap-8 lg:gap-16">
          
          {/* Left: User Output */}
          <div className="flex-1 h-full max-h-[80vh] border-2 border-black rounded-[60px] p-10 flex flex-col items-center justify-center text-center bg-white relative">
             <div className="absolute top-10 left-0 right-0 flex justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Uplink Buffer</span>
             </div>
             <div className="flex-1 flex items-center justify-center w-full px-6">
                <p className="text-xl lg:text-2xl font-black uppercase tracking-tighter leading-tight text-black break-words max-w-full">
                  {session.code || "NO_DATA_STREAM"}
                </p>
             </div>
             <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <p className="text-[10px] font-bold opacity-40 uppercase">User's output (from compiled code)</p>
             </div>
          </div>

          {/* Center: Metrics & Actions */}
          <div className="flex flex-col items-center justify-center gap-10 shrink-0">
             {/* Top Arrow */}
             <div className="flex flex-col items-center opacity-40">
                <div className="w-16 h-8 border-2 border-black relative">
                   <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[12px] border-l-black ml-[2px]"></div>
                </div>
             </div>

             <div className="flex flex-col items-center gap-2">
                <span className="text-[12px] font-black uppercase tracking-widest text-gray-400">Resemblance:</span>
                <div className="text-7xl lg:text-8xl font-black text-black leading-none">{session.accuracy}%</div>
             </div>

             <div className="flex flex-col gap-4 w-56">
                <NeoButton onClick={onNext} className="py-4 text-sm tracking-[0.2em]">Submit</NeoButton>
                <NeoButton variant="secondary" onClick={onRetry} className="py-4 text-sm tracking-[0.2em]">Return</NeoButton>
             </div>

             {/* Bottom Arrow */}
             <div className="flex flex-col items-center opacity-40">
                <div className="w-16 h-8 border-2 border-black relative">
                   <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-black mr-[2px]"></div>
                </div>
             </div>
          </div>

          {/* Right: Given Instructions */}
          <div className="flex-1 h-full max-h-[80vh] border-2 border-black rounded-[60px] p-10 flex flex-col items-center justify-center text-center bg-white relative">
             <div className="absolute top-10 left-0 right-0 flex justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Source Directive</span>
             </div>
             <div className="flex-1 flex items-center justify-center w-full px-6">
                <p className="text-xl lg:text-2xl font-black uppercase tracking-tighter leading-tight text-gray-500 italic">
                  {level?.objective || "NO_DIRECTIVE_FOUND"}
                </p>
             </div>
             <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <p className="text-[10px] font-bold opacity-40 uppercase">Given instructions</p>
             </div>
          </div>

       </div>
    </motion.div>
  );
};
