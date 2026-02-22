
export enum ScreenState {
  MENU = 'MENU',
  PROFILES = 'PROFILES',
  LEVEL_SELECT = 'LEVEL_SELECT',
  BRIEFING = 'BRIEFING',
  GAMEPLAY = 'GAMEPLAY',
  RETENTION_MODE = 'RETENTION_MODE',
  RESULT = 'RESULT',
  OPTIONS = 'OPTIONS',
  LEADERBOARDS = 'LEADERBOARDS',
  TASK_POOL = 'TASK_POOL',
}

export enum Language {
  GENERAL = 'ORIENTATION',
  HTML = 'HTML',
  CSS = 'CSS',
  JAVASCRIPT = 'JAVASCRIPT',
  CPP = 'C++',
  JAVA = 'JAVA',
}

export enum Theme {
  TERMINAL = 'TERMINAL',
  MONOCHROME = 'MONOCHROME',
}

export interface DevOptions {
  neuralStasis: boolean; // Infinite time in drills
  signalForceOverride: boolean; // Instant pass button in drills
  overclockCores: boolean; // Double score/time bonus
  viewTaskPool: boolean; // Reveal drill generation logic
  allowPaste: boolean; // Bypass anti-paste security
}

export interface Profile {
  id: string;
  name: string;
  levelsCompleted: number;
  errorsMade: number;
  accuracyRate: number; // 0-100
  fastestClear: string; // "MM:SS"
  retentionBest: number; // Legacy total
  retentionBests: {
    [key in Language]?: number;
  };
  // New Drill Stats
  drillTotalTasksCleared: number;
  drillAccuracySum: number;
  drillSubmissionsCount: number;
  drillFastestTaskSeconds: number | null;
  drillMaxSessionSeconds: number;
  
  // Language specific drill bests for leaderboards
  drillLanguageFastest: {
    [key in Language]?: number;
  };
  drillLanguageMaxSession: {
    [key in Language]?: number;
  };

  // Unique IDs for specific record runs
  drillRecordIDs: {
    [key in Language]?: {
      tasks?: string;
      fastest?: string;
      longest?: string;
    }
  };

  created: number;
  hasSeenTutorialPrompt: boolean;
  isJohnEnCode?: boolean; // Easter Egg flag
}

export interface Level {
  id: string;
  chapter: number;
  subChapter?: number;
  title: string;
  language: Language;
  description: string;
  objective: string;
  targetOutput: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  lesson?: string;
}

export interface GameSession {
  levelId: string;
  startTime: number;
  attempts: number;
  code: string;
  accuracy: number;
  timeElapsed: string;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  isRetention?: boolean;
  retentionLanguage?: Language;
  score?: number;
  // Performance Breakdown
  performance?: {
    integrity: number;   // Accuracy/Correctness
    optimality: number;  // Code conciseness/efficiency
    clarity: number;     // Style/Readability
    velocity: number;    // Speed relative to par
  };
  // Drill Specific Data
  drillSessionStats?: {
    totalAccuracySum: number;
    submissionsCount: number;
    fastestTaskSeconds: number | null;
    sessionDurationSeconds: number;
  };
}
