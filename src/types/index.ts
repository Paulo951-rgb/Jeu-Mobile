export type ChallengeType = 'math' | 'scanner' | 'photo' | 'movement' | 'recopy' | 'location' | 'custom';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: string;
  type: ChallengeType;
  name: string;
  difficulty: ChallengeDifficulty;
  completed: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface Alarm {
  id: string;
  label: string;
  hour: number;
  minute: number;
  days: number[];
  enabled: boolean;
  vibrate: boolean;
  volume: number;
  soundName?: string;
  volumeRampDuration: number;
  challenges: Challenge[];
  snoozeEnabled: boolean;
  snoozeDuration: number;
  maxSnoozes: number;
}

export interface AlarmSession {
  alarmId: string;
  startedAt: number;
  currentChallengeIndex: number;
  challenges: Challenge[];
  completed: boolean;
  snoozeCount: number;
}

export type AppScreen = 'home' | 'createAlarm' | 'editAlarm' | 'ringing' | 'challenge' | 'settings' | 'developer';
