
import React, { useState, useEffect, useMemo } from 'react';
import { NeoButton, NeoCard, NeoInput } from '../UI';
import { Profile, Level, Language, Theme, ScreenState, DevOptions } from '../../types';
import { MOCK_LEVELS, getTaskPoolSummary, WORDS, COLORS, PROPS } from '../../constants';
import { Trash2, Plus, Terminal, Monitor, Settings, Lock, Sparkles, BookOpen, EyeOff, FolderOpen, ChevronDown, ChevronRight, ChevronLeft, Zap, AlertCircle, ChevronUp, User, Layout, Command, Play, X, Trophy, List, ArrowLeft, BarChart3, Activity, Clock, Target, Cpu, HardDrive, Database, Search, ExternalLink, ShieldAlert, Code, Book, Filter, Copy, Check, Info, Volume2, VolumeX, Music, GraduationCap, Award, BookText, TrendingUp, Menu, Moon, Sun, Globe, Terminal as TerminalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../services/audioService';

const TOTAL_NODES = 52;

const formatSecondsHelper = (sec: number | null) => {
  if (sec === null || sec === undefined) return "--:--";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const LANG_DESCRIPTIONS: Record<string, { immersive: string }> = {
  [Language.GENERAL]: { immersive: "Core syntax foundations." },
  [Language.HTML]: { immersive: "Document structure & tags." },
  [Language.CSS]: { immersive: "Style, layout & presentation." },
  [Language.JAVASCRIPT]: { immersive: "Functional logic & events." },
  [Language.JAVA]: { immersive: "Enterprise backend logic." },
  [Language.CPP]: { immersive: "Systems & memory control." },
};

const STRAND_DETAILS: Record<string, string> = {
  [Language.GENERAL]: "Initialize your logical faculties. This module verifies basic input/output comprehension and system rule adherence.",
  [Language.HTML]: "Master the structural semantics of the web. Learn to define content hierarchy and document architecture using standard markup.",
  [Language.CSS]: "Control visual presentation and spatial layout. Practice applying declarative styles to transform raw structures into interfaces.",
  [Language.JAVASCRIPT]: "Implement dynamic behavior and functional logic. Transition from static documents to interactive, stateful applications.",
  [Language.JAVA]: "Object-oriented programming at scale. Learn about classes, static methods, and strongly-typed data structures.",
  [Language.CPP]: "High-performance systems programming. Manage memory, optimize execution, and understand low-level compute patterns.",
};

// --- Cheat Modal ---
export const CheatModal: React.FC<{ isOpen: boolean, onClose: () => void, onExecute: (code: string) => void }> = ({ isOpen, onClose, onExecute }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onExecute(input.trim().toUpperCase());
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md"
          >
            <NeoCard title="System Override Console">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6 opacity-60">
                  <TerminalIcon size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Root Access Required</span>
                </div>
                <form onSubmit={handleSubmit}>
                   <NeoInput 
                    autoFocus 
                    placeholder="ENTER COMMAND..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="mb-8 text-center text-lg tracking-widest"
                   />
                   <div className="flex gap-3">
                      <NeoButton type="submit" className="flex-1 py-3">Execute</NeoButton>
                      <NeoButton type="button" variant="secondary" onClick={onClose} className="px-6 py-3">Exit</NeoButton>
                   </div>
                </form>
                <div className="mt-6 text-[8px] font-mono opacity-20 uppercase text-center tracking-widest">
                  Unauthorized access is a violation of system integrity
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main Menu ---
export const MainMenu: React.FC<{ 
  onStart: () => void, 
  onLeaderboards: () => void, 
  onConfiguration: () => void,
  onOpenCheats: () => void
}> = ({ onStart, onLeaderboards, onConfiguration, onOpenCheats }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[var(--bg-color)] p-6 overflow-hidden">
       <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
       
       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-12 relative">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-[2px] w-12 bg-[var(--primary)] opacity-20"></div>
               <span className="text-[10px] font-mono font-black tracking-[0.5em] opacity-40 uppercase">System Terminal</span>
               <div className="h-[2px] w-12 bg-[var(--primary)] opacity-20"></div>
            </div>

            <div className="relative group">
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-[var(--primary)] tracking-tighter leading-none flex flex-col items-center">
                 <span className="opacity-20 text-[0.35em] tracking-[0.8em] -mb-4 ml-6 self-start font-mono">PROJECT</span>
                 <span className="relative inline-block py-2">
                    ENCODE
                    <button 
                      onClick={onOpenCheats}
                      className="absolute left-full ml-6 top-1/2 -translate-y-1/2 text-[10px] bg-[var(--primary)] text-[var(--bg-color)] px-4 py-1.5 rounded-sm font-mono font-bold neo-shadow border border-[var(--primary)] whitespace-nowrap tracking-wider flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95"
                    >
                      v2.5.26
                    </button>
                 </span>
              </h1>
            </div>

            <div className="text-[9px] lg:text-[11px] font-mono opacity-60 font-black uppercase tracking-[0.3em] mt-6 px-10 border-t border-b py-2 border-[var(--primary)]/10">
              Integrated Logic Simulator
            </div>
          </div>
       </motion.div>
       
       <div className="flex flex-col gap-4 w-full max-w-[280px] relative z-10">
          <NeoButton onClick={onStart} className="py-5 text-xl">Start Game</NeoButton>
          <div className="grid grid-cols-2 gap-3">
            <NeoButton onClick={onLeaderboards} variant="secondary" className="py-3 text-[10px] lg:text-xs">Records</NeoButton>
            <NeoButton onClick={onConfiguration} variant="secondary" className="py-3 text-[10px] lg:text-xs">Settings</NeoButton>
          </div>
       </div>
       
       <div className="absolute bottom-10 left-10 text-[8px] font-mono opacity-10 uppercase tracking-widest hidden lg:block">
          UPLINK: STABLE // SYS_CALIBRATION_READY<br/>
          MEMORY_ADDR: 0x8F2A // CACHE_FLUSHED
       </div>
    </div>
  );
};

// --- Profile Selection ---
export const ProfileSelect: React.FC<{ 
  profiles: Profile[], 
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>,
  onSelect: (p: Profile) => void, 
  onBack: () => void,
  isAudioEnabled?: boolean,
  onJohnEnCode?: () => void
}> = ({ profiles, setProfiles, onSelect, onBack, isAudioEnabled, onJohnEnCode }) => {
  const [newName, setNewName] = useState('');

  const createProfile = () => {
    if (!newName.trim()) return;
    if (profiles.length >= 6) return;

    const isJohn = newName.trim() === 'John EnCode';
    
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: newName.trim(),
      levelsCompleted: 0,
      errorsMade: 0,
      accuracyRate: 0,
      fastestClear: "--:--",
      retentionBest: 0,
      retentionBests: {},
      drillTotalTasksCleared: 0,
      drillAccuracySum: 0,
      drillSubmissionsCount: 0,
      drillFastestTaskSeconds: null,
      drillMaxSessionSeconds: 0,
      drillLanguageFastest: {},
      drillLanguageMaxSession: {},
      drillRecordIDs: {},
      created: Date.now(),
      hasSeenTutorialPrompt: false,
      isJohnEnCode: isJohn
    };

    if (isJohn && onJohnEnCode) {
      onJohnEnCode();
    }

    setProfiles([...profiles, newProfile]);
    setNewName('');
    if (isAudioEnabled) audio.playClick();
  };

  const deleteProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProfiles(profiles.filter(p => p.id !== id));
    if (isAudioEnabled) audio.playError();
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-6 lg:p-12 bg-[var(--bg-color)] overflow-y-auto">
       <div className="text-center mb-8">
          <div className="inline-block p-4 bg-[var(--primary)] text-[var(--bg-color)] rounded-lg mb-4 neo-shadow border-2 border-[var(--primary)]"><User size={28} /></div>
          <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-[var(--primary)]">Users</h2>
          <div className="text-[8px] font-mono opacity-60 font-bold uppercase tracking-widest mt-0.5">Select Profile Node</div>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 max-w-5xl w-full">
          {profiles.map(profile => (
             <NeoCard key={profile.id} className="cursor-pointer group hover:border-[var(--primary)] transition-all" title={profile.name}>
                <div className="p-6 flex flex-col" onClick={() => onSelect(profile)}>
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-[8px] font-bold opacity-70 uppercase tracking-widest">Sync Progress</span>
                      <span className="text-sm lg:text-base font-bold text-[var(--primary)]">{Math.round((profile.levelsCompleted / TOTAL_NODES) * 100)}%</span>
                   </div>
                   <NeoButton variant="danger" className="py-1 text-[9px] opacity-60 hover:opacity-100" onClick={(e) => deleteProfile(e, profile.id)}>Purge</NeoButton>
                </div>
             </NeoCard>
          ))}
          {profiles.length < 6 && (
            <div className="border-2 border-dashed border-[var(--primary)]/20 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--primary)]/5 transition-colors" onClick={() => {}}>
               <div className="flex flex-col items-center w-full">
                  <NeoInput 
                    placeholder="Operator ID" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createProfile()}
                    className="mb-4 text-center"
                  />
                  <NeoButton variant="secondary" onClick={createProfile} className="w-full">Initialize</NeoButton>
               </div>
            </div>
          )}
       </div>
       <NeoButton onClick={onBack} variant="secondary" className="px-12 py-3">Back to Menu</NeoButton>
    </div>
  );
};

// --- Level Select ---
export const LevelSelect: React.FC<{ 
  profile: Profile, onLevelSelect: (l: Level) => void, onRetentionStart: (lang: Language) => void,
  onOpenLeaderboards: () => void, onBack: () => void, isDevViewEnabled?: boolean,
  onMarkTutorialSeen: (profileId: string) => void, onOpenTaskPool: () => void
}> = ({ profile, onLevelSelect, onRetentionStart, onOpenLeaderboards, onBack }) => {
  const [activeCourse, setActiveCourse] = useState<Language | null>(null);

  const tutorialByLanguage = useMemo(() => {
    const grouped: Record<string, Level[]> = {};
    MOCK_LEVELS.forEach(l => {
      const lang = l.language;
      if (!grouped[lang]) grouped[lang] = [];
      grouped[lang].push(l);
    });
    return grouped;
  }, []);

  const getTrackProgress = (lang: string) => {
    const levels = tutorialByLanguage[lang] || [];
    if (levels.length === 0) return 0;
    const completedInTrack = levels.filter(l => profile.levelsCompleted >= parseInt(l.id)).length;
    return Math.round((completedInTrack / levels.length) * 100);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 lg:p-8 gap-5 bg-[var(--bg-color)] overflow-hidden">
       <div className="flex items-center justify-between pb-4 border-b border-[var(--primary)]/10">
          <div className="flex items-center gap-4">
             <NeoButton variant="secondary" onClick={onBack} className="p-2"><ChevronLeft size={18} /></NeoButton>
             <div>
                <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest text-[var(--primary)]">Active Operator</span>
                <h1 className="text-2xl lg:text-3xl font-black text-[var(--primary)] leading-none">{profile.name}</h1>
             </div>
          </div>
          <NeoButton onClick={onOpenLeaderboards} variant="secondary" className="px-5 py-2 text-[10px] lg:text-xs"><Trophy size={14} className="mr-2" /> Global Highscores</NeoButton>
       </div>

       <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-6">
             <div className="bg-[var(--primary)] text-[var(--bg-color)] rounded-xl p-6 lg:p-10 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6 border-2 border-[var(--primary)] neo-shadow">
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
                <div className="relative z-10 text-center sm:text-left">
                   <span className="inline-block bg-[var(--bg-color)] text-[var(--primary)] text-[7px] lg:text-[8px] font-bold uppercase px-2 py-0.5 rounded mb-2 tracking-widest">System Objective</span>
                   <h2 className="text-xl lg:text-3xl font-black tracking-tight mb-1">Foundational Sync</h2>
                   <p className="text-[10px] lg:text-[11px] opacity-80 font-bold italic">Execute assigned logic strands to verify platform integrity.</p>
                </div>
                <NeoButton 
                  onClick={() => {
                    const nextIndex = Math.min(MOCK_LEVELS.length - 1, profile.levelsCompleted);
                    onLevelSelect(MOCK_LEVELS[nextIndex]);
                  }} 
                  className="bg-[var(--bg-color)] text-[var(--primary)] px-10 py-4 text-sm lg:text-base hover:scale-105"
                >
                  Proceed <ChevronRight className="ml-1" size={18} />
                </NeoButton>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                   <List size={16} className="opacity-70" />
                   <h3 className="text-xs lg:text-sm font-black uppercase tracking-tight text-[var(--primary)]">Course Strands</h3>
                </div>
                <p className="text-[10px] lg:text-[11px] opacity-70 px-1 font-bold leading-relaxed max-w-2xl">
                   Structured modular pathways designed for foundational syntax mastery. Select a sector to initiate calibration.
                </p>
                
                <div className="space-y-4">
                   {(Object.entries(tutorialByLanguage) as [string, Level[]][]).map(([lang, levels]) => {
                     const progress = getTrackProgress(lang);
                     return (
                        <NeoCard key={lang} className="overflow-hidden hover:border-[var(--primary)] transition-all">
                           <div className="p-4 lg:p-5 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setActiveCourse(activeCourse === lang ? null : lang as Language)}>
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[var(--primary)] text-[var(--bg-color)] rounded-lg neo-shadow border-2 border-[var(--primary)]">
                                    {lang === Language.GENERAL ? <Monitor size={20} /> : lang === Language.HTML ? <Layout size={20} /> : lang === Language.CSS ? <Sparkles size={20} /> : <Code size={20} />}
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-sm lg:text-lg font-black text-[var(--primary)] uppercase">{lang}</span>
                                       <span className="text-[7px] font-bold opacity-60 border border-[var(--primary)]/60 px-1 rounded text-[var(--primary)]">MOD_ID_{lang.slice(0,1)}</span>
                                    </div>
                                    <p className="text-[10px] lg:text-[13px] opacity-70 italic font-bold">{LANG_DESCRIPTIONS[lang]?.immersive}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className="text-right hidden sm:block">
                                    <span className="block text-[7px] font-bold opacity-60 uppercase tracking-widest text-[var(--primary)]">Calibration</span>
                                    <span className={`text-[10px] lg:text-[14px] font-bold ${progress === 100 ? 'text-[var(--primary)]' : 'opacity-80'}`}>{progress}%</span>
                                 </div>
                                 <div className="p-1 border border-[var(--primary)]/30 rounded">
                                    {activeCourse === lang ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                 </div>
                              </div>
                           </div>
                           <AnimatePresence>
                              {activeCourse === lang && (
                                 <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-[var(--surface)] border-t border-[var(--primary)]/5 overflow-hidden">
                                    <div className="px-5 pt-5 pb-2 max-w-3xl">
                                       <p className="text-[10px] lg:text-[12px] opacity-80 leading-relaxed font-bold italic border-l-2 border-[var(--primary)]/60 pl-4">
                                          {STRAND_DETAILS[lang]}
                                       </p>
                                    </div>
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                       {levels.map((l, i) => {
                                          const isDone = profile.levelsCompleted >= parseInt(l.id);
                                          const isUnlocked = i === 0 || profile.levelsCompleted >= parseInt(levels[i-1].id);
                                          return (
                                             <div 
                                                key={l.id} 
                                                onClick={() => isUnlocked && onLevelSelect(l)}
                                                className={`p-4 lg:p-5 rounded-lg border transition-all flex items-center justify-between ${isDone ? 'bg-[var(--primary)]/10 border-[var(--primary)]/50' : isUnlocked ? 'bg-[var(--card-bg)] border-[var(--primary)]/20 hover:border-[var(--primary)] cursor-pointer' : 'opacity-20 cursor-not-allowed border-transparent'}`}
                                             >
                                                <div className="flex flex-col">
                                                   <span className="text-[8px] font-mono opacity-80 font-black uppercase">Node_{i+1}</span>
                                                   <span className="text-xs lg:text-base font-black uppercase text-[var(--primary)]">{l.title}</span>
                                                </div>
                                                <div className={`p-2 rounded-full ${isDone ? 'bg-[var(--primary)] text-[var(--bg-color)]' : isUnlocked ? 'opacity-40' : 'hidden'}`}>
                                                   {isDone ? <Check size={16} /> : <Play size={16} />}
                                                </div>
                                                {!isUnlocked && <Lock size={16} className="opacity-20" />}
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </NeoCard>
                     );
                   })}
                </div>
             </div>

             <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 px-1">
                   <Activity size={16} className="opacity-70" />
                   <h3 className="text-xs lg:text-sm font-black uppercase tracking-tight text-[var(--primary)]">Velocity Stress-Test</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                   {[Language.HTML, Language.CSS, Language.JAVASCRIPT, Language.JAVA, Language.CPP].map(lang => (
                      <NeoCard key={lang} className="p-5 flex flex-col gap-5 hover:border-[var(--primary)] transition-all">
                         <div>
                            <span className="text-[7px] font-mono opacity-70 uppercase tracking-widest font-bold">Task_{lang}</span>
                            <h4 className="text-base lg:text-lg font-black text-[var(--primary)] leading-none">{lang}</h4>
                         </div>
                         <div className="h-2 w-full bg-[var(--dim)]/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)]" style={{ width: `${getTrackProgress(lang)}%` }} />
                         </div>
                         <NeoButton 
                            variant="success" 
                            className="py-2.5 text-[9px] lg:text-[10px]" 
                            onClick={() => onRetentionStart(lang)}
                         >
                            Engage
                         </NeoButton>
                      </NeoCard>
                   ))}
                </div>
             </div>
          </div>

          <div className="hidden lg:flex w-80 flex-col gap-6 shrink-0">
             <NeoCard title="Sync Metrics" className="p-8 lg:p-10 flex flex-col items-center">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center mb-6">
                   <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-10" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="7" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * (profile.levelsCompleted / TOTAL_NODES)) } className="text-[var(--primary)]" />
                   </svg>
                   <span className="text-3xl lg:text-4xl font-black text-[var(--primary)] tracking-tighter">{Math.round((profile.levelsCompleted / TOTAL_NODES) * 100)}%</span>
                </div>
                <div className="w-full space-y-4 pt-6 border-t border-[var(--primary)]/10">
                   <div className="flex justify-between items-center text-[10px] lg:text-[12px] font-bold uppercase tracking-[0.2em]">
                      <span className="opacity-70">Integrity</span>
                      <span>{profile.drillSubmissionsCount > 0 ? Math.round(profile.drillAccuracySum / profile.drillSubmissionsCount) : 0}%</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] lg:text-[12px] font-bold uppercase tracking-[0.2em]">
                      <span className="opacity-70">Cleared</span>
                      <span>{profile.drillTotalTasksCleared} nodes</span>
                   </div>
                </div>
             </NeoCard>
             <div className="mt-auto p-6 border border-[var(--primary)]/10 rounded-xl bg-[var(--surface)] text-[9px] lg:text-[12px] font-mono opacity-60 font-bold space-y-1.5 leading-relaxed">
                <p>UPLINK: ACTIVE // SECURE_SOCKET_TLS</p>
                <p>SIGNAL: STRONG // 144MS_LATENCY</p>
                <p>STATUS: RUNNING // STABLE_ENV</p>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Leaderboards Screen ---
export const LeaderboardsScreen: React.FC<{ profiles: Profile[], onBack: () => void }> = ({ profiles, onBack }) => (
  <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-8 lg:p-12 gap-6 bg-[var(--bg-color)]">
     <div className="flex items-center gap-4 pb-6 border-b border-[var(--primary)]/10">
        <NeoButton variant="secondary" onClick={onBack} className="p-3"><ChevronLeft size={20} /></NeoButton>
        <h1 className="text-2xl lg:text-4xl font-black text-[var(--primary)] uppercase tracking-tight">Project Records</h1>
     </div>
     <NeoCard className="flex-1 p-6 lg:p-10">
        <div className="space-y-4">
           {profiles.sort((a,b) => b.levelsCompleted - a.levelsCompleted).slice(0, 15).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between p-4 border-b border-[var(--primary)]/10 text-sm lg:text-lg">
                 <div className="flex items-center gap-5">
                    <span className="font-mono opacity-60 font-black">{i+1}</span>
                    <span className="font-bold uppercase tracking-tight">{p.name}</span>
                 </div>
                 <span className="font-mono opacity-80 text-xs lg:text-sm font-bold uppercase tracking-widest">{Math.round((p.levelsCompleted / TOTAL_NODES) * 100)}% Calibration</span>
              </div>
           ))}
           {profiles.length === 0 && (
              <div className="py-24 text-center text-sm lg:text-base opacity-70 italic font-bold">No sync records available in the central database.</div>
           )}
        </div>
     </NeoCard>
  </div>
);

// --- Task Pool Viewer ---
export const TaskPoolViewer: React.FC<{ onBack: () => void }> = ({ onBack }) => (
   <div className="flex flex-col h-full p-8 lg:p-12 bg-black text-red-500 font-mono overflow-hidden">
      <NeoButton onClick={onBack} variant="secondary" className="mb-8 w-fit border-red-500 text-red-500 neo-shadow py-4 px-10">Exit_Debug</NeoButton>
      <h1 className="text-2xl lg:text-3xl mb-5 font-black uppercase tracking-[0.3em] underline">SYS_RESOURCES_DUMP</h1>
      <pre className="text-[10px] lg:text-[14px] opacity-80 overflow-auto custom-scroll bg-red-950/5 p-6 border border-red-950/20 rounded-lg flex-1">
         {JSON.stringify(getTaskPoolSummary(), null, 3)}
      </pre>
   </div>
);

// --- Configuration Screen ---
export const ConfigurationScreen: React.FC<{ 
  currentTheme: Theme, 
  onThemeChange: (t: Theme) => void, 
  onBack: () => void,
  maxLevelsCleared: number,
  redTeamRevealed?: boolean,
  isRedTeamMode?: boolean,
  onRedTeamToggle?: () => void,
  removeEffects?: boolean,
  onRemoveEffectsToggle?: () => void,
  devOptions: DevOptions,
  onDevOptionToggle: (opt: keyof DevOptions) => void,
  onOpenTaskPool: () => void,
  isAudioEnabled?: boolean,
  onAudioToggle?: () => void,
  isMusicEnabled?: boolean,
  onMusicToggle?: () => void
}> = ({ 
  currentTheme, onThemeChange, onBack, redTeamRevealed, isRedTeamMode, onRedTeamToggle, 
  removeEffects, onRemoveEffectsToggle, isAudioEnabled, onAudioToggle, isMusicEnabled, onMusicToggle
}) => {
  return (
    <div className="flex flex-col items-center justify-start h-full w-full bg-[var(--bg-color)] p-8 overflow-y-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-[var(--primary)]">Settings</h2>
        <div className="text-[8px] font-mono opacity-60 uppercase tracking-[0.2em] mt-0.5 font-bold">Global Configuration</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-xl w-full">
        <NeoCard title="Interface" className="p-4 flex flex-col gap-3">
          <div className="flex gap-2">
            {[Theme.MONOCHROME, Theme.TERMINAL].map(t => (
              <NeoButton 
                key={t}
                onClick={() => onThemeChange(t)}
                variant={currentTheme === t ? 'primary' : 'secondary'}
                className="flex-1 text-[9px] lg:text-[10px]"
              >
                {t === Theme.MONOCHROME ? 'Light' : 'Terminal'}
              </NeoButton>
            ))}
          </div>
          <div className="flex items-center justify-between mt-1 px-1">
             <span className="text-[10px] font-bold opacity-80 uppercase">Simplified Graphics</span>
             <button onClick={onRemoveEffectsToggle} className={`w-8 h-4 rounded-full border-2 border-[var(--primary)] flex items-center px-0.5 transition-colors ${removeEffects ? 'bg-[var(--primary)]' : 'bg-transparent'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${removeEffects ? 'bg-[var(--bg-color)] translate-x-4' : 'bg-[var(--primary)]'} transition-transform`} />
             </button>
          </div>
        </NeoCard>

        <NeoCard title="Audio Engine" className="p-4 flex flex-col gap-3">
           <div className="flex items-center justify-between px-1">
             <span className="text-[10px] font-bold opacity-80 uppercase">System SFX</span>
             <button onClick={onAudioToggle} className={`w-8 h-4 rounded-full border-2 border-[var(--primary)] flex items-center px-0.5 transition-colors ${isAudioEnabled ? 'bg-[var(--primary)]' : 'bg-transparent'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isAudioEnabled ? 'bg-[var(--bg-color)] translate-x-4' : 'bg-[var(--primary)]'} transition-transform`} />
             </button>
           </div>
           <div className="flex items-center justify-between px-1">
             <span className="text-[10px] font-bold opacity-80 uppercase">Neural Music</span>
             <button onClick={onMusicToggle} className={`w-8 h-4 rounded-full border-2 border-[var(--primary)] flex items-center px-0.5 transition-colors ${isMusicEnabled ? 'bg-[var(--primary)]' : 'bg-transparent'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isMusicEnabled ? 'bg-[var(--bg-color)] translate-x-4' : 'bg-[var(--primary)]'} transition-transform`} />
             </button>
           </div>
        </NeoCard>
      </div>

      <NeoButton onClick={onBack} variant="secondary" className="px-10 py-2.5">Return</NeoButton>
    </div>
  );
};
