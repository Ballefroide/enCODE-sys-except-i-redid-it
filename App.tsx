
import React, { useState, useEffect, useMemo } from 'react';
import { ScreenState, Profile, Level, GameSession, Theme, Language, DevOptions } from './types';
import { MainMenu, ProfileSelect, LevelSelect, ConfigurationScreen, LeaderboardsScreen, TaskPoolViewer, CheatModal } from './components/screens/MenuScreens';
import { LevelBriefing, Gameplay, ResultScreen, RetentionGameplay } from './components/screens/GameScreens';
import { AnimatePresence, motion } from 'framer-motion';
import { MOCK_LEVELS } from './constants';
import { audio } from './services/audioService';

const generateRunID = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.MENU);
  const [taskPoolReturnScreen, setTaskPoolReturnScreen] = useState<ScreenState>(ScreenState.MENU);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [retentionLanguage, setRetentionLanguage] = useState<Language>(Language.HTML);
  const [lastSession, setLastSession] = useState<GameSession | null>(null);
  const [isCheatModalOpen, setIsCheatModalOpen] = useState(false);
  
  // Audio Settings
  const [isAudioEnabled, setIsAudioEnabled] = useState(() => localStorage.getItem('encode_audio_sfx') !== 'false');
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => localStorage.getItem('encode_audio_music') === 'true');

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('encode_theme') as Theme) || Theme.MONOCHROME;
  });

  const [removeEffects, setRemoveEffects] = useState(() => {
    return localStorage.getItem('encode_remove_effects') === 'true';
  });

  const [isRedTeamMode, setIsRedTeamMode] = useState(() => {
    return localStorage.getItem('encode_red_team') === 'true';
  });
  const [redTeamRevealed, setRedTeamRevealed] = useState(() => {
    return localStorage.getItem('encode_red_team_revealed') === 'true';
  });
  
  const [devOptions, setDevOptions] = useState<DevOptions>(() => {
    const saved = localStorage.getItem('encode_dev_options');
    return saved ? JSON.parse(saved) : {
      neuralStasis: false,
      signalForceOverride: false,
      overclockCores: false,
      viewTaskPool: false,
      allowPaste: false
    };
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('encode_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  // Global Interaction Listener to unlock AudioContext
  useEffect(() => {
    const unlock = () => {
      audio.unlock();
      if (isMusicEnabled) audio.startAmbience();
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('click', unlock);
    return () => window.removeEventListener('click', unlock);
  }, [isMusicEnabled]);

  useEffect(() => {
    if (isMusicEnabled) {
      audio.startAmbience();
    } else {
      audio.stopAmbience();
    }
    localStorage.setItem('encode_audio_music', isMusicEnabled.toString());
  }, [isMusicEnabled]);

  useEffect(() => {
    localStorage.setItem('encode_audio_sfx', isAudioEnabled.toString());
  }, [isAudioEnabled]);

  useEffect(() => {
    localStorage.setItem('encode_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('encode_theme', theme);
    document.documentElement.setAttribute('data-theme', theme.toLowerCase());
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('encode_remove_effects', removeEffects.toString());
    if (removeEffects) {
      document.body.classList.add('effects-disabled');
    } else {
      document.body.classList.remove('effects-disabled');
    }
  }, [removeEffects]);

  useEffect(() => {
    localStorage.setItem('encode_red_team', isRedTeamMode.toString());
    localStorage.setItem('encode_red_team_revealed', redTeamRevealed.toString());
    localStorage.setItem('encode_dev_options', JSON.stringify(devOptions));
    if (isRedTeamMode) {
      document.documentElement.classList.add('red-team-active');
    } else {
      document.documentElement.classList.remove('red-team-active');
    }
  }, [isRedTeamMode, redTeamRevealed, devOptions]);

  const maxLevelsCleared = useMemo(() => {
    if (profiles.length === 0) return 0;
    return Math.max(...profiles.map(p => p.levelsCompleted), 0);
  }, [profiles]);

  const currentProfile = useMemo(() => 
    profiles.find(p => p.id === currentProfileId) || null, 
  [profiles, currentProfileId]);

  const triggerJohnEnCodeCheats = () => {
    const allEnabled: DevOptions = {
      neuralStasis: true,
      signalForceOverride: true,
      overclockCores: true,
      viewTaskPool: true,
      allowPaste: true
    };
    setDevOptions(allEnabled);
    if (isAudioEnabled) {
      audio.playSuccess();
    }
  };

  const handleExecuteCheat = (code: string) => {
    if (isAudioEnabled) audio.playTally();
    
    switch (code) {
      case 'SUDO RED':
        setIsRedTeamMode(prev => !prev);
        setRedTeamRevealed(true);
        break;
      case 'SUDO UNLOCK':
        if (currentProfileId) {
          setProfiles(prev => prev.map(p => p.id === currentProfileId ? { 
            ...p, 
            levelsCompleted: 52,
            retentionBests: {
              [Language.HTML]: 99,
              [Language.CSS]: 99,
              [Language.JAVASCRIPT]: 99,
              [Language.JAVA]: 99,
              [Language.CPP]: 99,
            }
          } : p));
        }
        break;
      case 'SUDO STASIS':
        setDevOptions(prev => ({ ...prev, neuralStasis: !prev.neuralStasis }));
        break;
      case 'SUDO CORES':
        setDevOptions(prev => ({ ...prev, overclockCores: !prev.overclockCores }));
        break;
      case 'SUDO PASTE':
        setDevOptions(prev => ({ ...prev, allowPaste: !prev.allowPaste }));
        break;
      case 'SUDO POOL':
        handleOpenTaskPool();
        break;
      default:
        if (isAudioEnabled) audio.playError();
    }
    setIsCheatModalOpen(false);
  };

  const handleOpenTaskPool = () => {
    if (isAudioEnabled) audio.playClick();
    setTaskPoolReturnScreen(screen);
    setScreen(ScreenState.TASK_POOL);
  };

  const handleStart = () => {
    if (isAudioEnabled) audio.playClick();
    if (!currentProfileId) {
      setScreen(ScreenState.PROFILES);
    } else {
      setScreen(ScreenState.LEVEL_SELECT);
    }
  };
  
  const handleProfileSelect = (p: Profile) => {
    if (isAudioEnabled) audio.playClick();
    
    // Easter Egg check on selection
    if (p.isJohnEnCode || p.name === 'John EnCode') {
      triggerJohnEnCodeCheats();
    }

    setCurrentProfileId(p.id);
    setScreen(ScreenState.LEVEL_SELECT);
  };

  const handleMarkTutorialSeen = (profileId: string) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, hasSeenTutorialPrompt: true } : p));
  };

  const handleLevelSelect = (l: Level) => {
    if (isAudioEnabled) audio.playClick();
    setCurrentLevel(l);
    setScreen(ScreenState.BRIEFING);
  };

  const handleStartLevel = () => {
    if (isAudioEnabled) audio.playClick();
    setScreen(ScreenState.GAMEPLAY);
  };
  
  const handleStartRetention = (lang: Language) => {
    if (isAudioEnabled) audio.playClick();
    setRetentionLanguage(lang);
    setScreen(ScreenState.RETENTION_MODE);
  };

  const handleGameFinish = (session: GameSession, skipResult: boolean = false) => {
    setLastSession(session);
    
    if (currentProfileId) {
       setProfiles(prev => prev.map(p => {
         if (p.id === currentProfileId) {
            if (session.isRetention && session.drillSessionStats) {
              const lang = session.retentionLanguage as Language;
              const currentDrills = p.retentionBests || {};
              const currentLangFastest = p.drillLanguageFastest || {};
              const currentLangMaxSession = p.drillLanguageMaxSession || {};
              const currentRecordIDs = p.drillRecordIDs || {};
              const stats = session.drillSessionStats;
              
              const sessionRunID = generateRunID();

              const newFastest = (p.drillFastestTaskSeconds === null || (stats.fastestTaskSeconds !== null && stats.fastestTaskSeconds < p.drillFastestTaskSeconds))
                ? stats.fastestTaskSeconds 
                : p.drillFastestTaskSeconds;

              const isNewLangTasksBest = (session.score || 0) > (currentDrills[lang] || 0);
              const isNewLangFastestBest = (currentLangFastest[lang] === undefined || (stats.fastestTaskSeconds !== null && stats.fastestTaskSeconds < currentLangFastest[lang]!));
              const isNewLangMaxSessionBest = stats.sessionDurationSeconds > (currentLangMaxSession[lang] || 0);

              const newLangFastest = isNewLangFastestBest
                ? stats.fastestTaskSeconds
                : currentLangFastest[lang];

              const langRecordIDs = { ...(currentRecordIDs[lang] || {}) };
              if (isNewLangTasksBest) langRecordIDs.tasks = sessionRunID;
              if (isNewLangFastestBest) langRecordIDs.fastest = sessionRunID;
              if (isNewLangMaxSessionBest) langRecordIDs.longest = sessionRunID;

              return {
                ...p,
                retentionBest: Math.max(p.retentionBest, session.score || 0),
                retentionBests: {
                  ...currentDrills,
                  [lang]: Math.max(currentDrills[lang] || 0, session.score || 0)
                },
                drillTotalTasksCleared: p.drillTotalTasksCleared + (session.score || 0),
                drillAccuracySum: p.drillAccuracySum + stats.totalAccuracySum,
                drillSubmissionsCount: p.drillSubmissionsCount + stats.submissionsCount,
                drillFastestTaskSeconds: newFastest,
                drillMaxSessionSeconds: Math.max(p.drillMaxSessionSeconds, stats.sessionDurationSeconds),
                drillLanguageFastest: {
                  ...currentLangFastest,
                  [lang]: newLangFastest
                },
                drillLanguageMaxSession: {
                  ...currentLangMaxSession,
                  [lang]: Math.max(currentLangMaxSession[lang] || 0, stats.sessionDurationSeconds)
                },
                drillRecordIDs: {
                  ...currentRecordIDs,
                  [lang]: langRecordIDs
                }
              };
            }
            const currentIdNum = parseInt(currentLevel?.id || "0");
            return {
              ...p,
              levelsCompleted: Math.max(p.levelsCompleted, currentIdNum),
              accuracyRate: Math.max(p.accuracyRate, session.accuracy)
            };
         }
         return p;
       }));
    }

    if (skipResult) {
        setScreen(ScreenState.LEVEL_SELECT);
    } else {
        setScreen(ScreenState.RESULT);
    }
  };

  const handleNextLevel = () => {
    if (isAudioEnabled) audio.playClick();
    if (lastSession?.isRetention || !currentLevel) {
      setScreen(ScreenState.LEVEL_SELECT);
      return;
    }

    const currentIndex = MOCK_LEVELS.findIndex(l => l.id === currentLevel.id);
    if (currentIndex !== -1 && currentIndex < MOCK_LEVELS.length - 1) {
      const nextLevel = MOCK_LEVELS[currentIndex + 1];
      setCurrentLevel(nextLevel);
      setScreen(ScreenState.BRIEFING);
      return;
    }
    setScreen(ScreenState.LEVEL_SELECT);
  };

  const handleRetry = () => {
    if (isAudioEnabled) audio.playClick();
    if (lastSession?.isRetention) {
      setScreen(ScreenState.RETENTION_MODE);
    } else {
      setScreen(ScreenState.GAMEPLAY);
    }
  };

  const screenVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.15, ease: "linear" }
  } as const;

  return (
    <div className={`w-full h-screen bg-[var(--bg-color)] text-[var(--primary)] font-mono selection:bg-[var(--dim)] selection:text-[var(--primary)] overflow-hidden flex flex-col theme-${theme.toLowerCase()} ${isRedTeamMode ? 'red-team-active' : ''}`}>
      <main className="flex-1 w-full h-full relative">
        <AnimatePresence mode="wait">
          {screen === ScreenState.MENU && (
            <motion.div key="menu" {...screenVariants} className="w-full h-full">
              <MainMenu 
                onStart={handleStart} 
                onLeaderboards={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.LEADERBOARDS); }}
                onConfiguration={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.OPTIONS); }}
                onOpenCheats={() => { if(isAudioEnabled) audio.playClick(); setIsCheatModalOpen(true); }}
              />
            </motion.div>
          )}
          
          {screen === ScreenState.OPTIONS && (
            <motion.div key="options" {...screenVariants} className="w-full h-full">
              <ConfigurationScreen 
                currentTheme={theme} 
                onThemeChange={setTheme} 
                onBack={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.MENU); }}
                maxLevelsCleared={maxLevelsCleared}
                redTeamRevealed={redTeamRevealed}
                isRedTeamMode={isRedTeamMode}
                onRedTeamToggle={() => setIsRedTeamMode(!isRedTeamMode)}
                removeEffects={removeEffects}
                onRemoveEffectsToggle={() => setRemoveEffects(!removeEffects)}
                devOptions={devOptions}
                onDevOptionToggle={(opt) => setDevOptions(prev => ({ ...prev, [opt]: !prev[opt] }))}
                onOpenTaskPool={handleOpenTaskPool}
                isAudioEnabled={isAudioEnabled}
                onAudioToggle={() => setIsAudioEnabled(!isAudioEnabled)}
                isMusicEnabled={isMusicEnabled}
                onMusicToggle={() => setIsMusicEnabled(!isMusicEnabled)}
              />
            </motion.div>
          )}

          {screen === ScreenState.LEADERBOARDS && (
            <motion.div key="leaderboards" {...screenVariants} className="w-full h-full">
              <LeaderboardsScreen 
                profiles={profiles} 
                onBack={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.MENU); }} 
              />
            </motion.div>
          )}

          {screen === ScreenState.PROFILES && (
            <motion.div key="profiles" {...screenVariants} className="w-full h-full">
              <ProfileSelect 
                profiles={profiles}
                setProfiles={setProfiles}
                onSelect={handleProfileSelect} 
                onBack={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.MENU); }} 
                isAudioEnabled={isAudioEnabled}
                onJohnEnCode={triggerJohnEnCodeCheats}
              />
            </motion.div>
          )}

          {screen === ScreenState.LEVEL_SELECT && currentProfile && (
            <motion.div key="level-select" {...screenVariants} className="w-full h-full">
              <LevelSelect 
                profile={currentProfile} 
                onLevelSelect={handleLevelSelect} 
                onRetentionStart={handleStartRetention}
                onOpenLeaderboards={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.LEADERBOARDS); }}
                onMarkTutorialSeen={handleMarkTutorialSeen}
                onBack={() => {
                  if (isAudioEnabled) audio.playClick();
                  setCurrentProfileId(null);
                  setScreen(ScreenState.PROFILES);
                }}
                isDevViewEnabled={isRedTeamMode}
                onOpenTaskPool={handleOpenTaskPool}
              />
            </motion.div>
          )}

          {screen === ScreenState.BRIEFING && currentLevel && (
            <motion.div key="briefing" {...screenVariants} className="w-full h-full">
              <LevelBriefing level={currentLevel} onStart={handleStartLevel} onBack={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.LEVEL_SELECT); }} />
            </motion.div>
          )}

          {screen === ScreenState.GAMEPLAY && currentLevel && (
            <motion.div key="gameplay" {...screenVariants} className="w-full h-full">
              <Gameplay 
                level={currentLevel} 
                onFinish={handleGameFinish} 
                onExit={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.LEVEL_SELECT); }}
                isAntiCheatEnabled={!isRedTeamMode && !devOptions.allowPaste}
                isAudioEnabled={isAudioEnabled}
              />
            </motion.div>
          )}

          {screen === ScreenState.RETENTION_MODE && (
            <motion.div key="retention" {...screenVariants} className="w-full h-full">
              <RetentionGameplay 
                language={retentionLanguage}
                onFinish={handleGameFinish}
                onExit={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.LEVEL_SELECT); }}
                isAntiCheatEnabled={!isRedTeamMode && !devOptions.allowPaste}
                devOptions={devOptions}
                isAudioEnabled={isAudioEnabled}
              />
            </motion.div>
          )}

          {screen === ScreenState.RESULT && lastSession && (
            <motion.div key="result" {...screenVariants} className="w-full h-full">
              <ResultScreen 
                session={lastSession} 
                level={currentLevel}
                onNext={handleNextLevel} 
                onRetry={handleRetry} 
                onExit={() => { if(isAudioEnabled) audio.playClick(); setScreen(ScreenState.LEVEL_SELECT); }}
                isAudioEnabled={isAudioEnabled}
              />
            </motion.div>
          )}

          {screen === ScreenState.TASK_POOL && (
            <motion.div key="task-pool" {...screenVariants} className="w-full h-full">
              <TaskPoolViewer onBack={() => {
                if (isAudioEnabled) audio.playClick();
                setScreen(taskPoolReturnScreen);
              }} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <CheatModal 
          isOpen={isCheatModalOpen} 
          onClose={() => setIsCheatModalOpen(false)} 
          onExecute={handleExecuteCheat} 
        />
      </main>
    </div>
  );
};

export default App;
