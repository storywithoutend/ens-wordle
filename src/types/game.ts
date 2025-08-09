/**
 * Game state and logic type definitions for ENS-Wordle
 */

export type LetterState = 'correct' | 'wrong-position' | 'absent' | 'unused';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface Guess {
  word: string;
  feedback: LetterState[];
}

export interface GameState {
  currentENSName: string;
  currentAvatarUrl?: string;
  guesses: Guess[];
  currentGuessIndex: number;
  gameStatus: GameStatus;
  letterStates: Record<string, LetterState>;
  startTime: number;
  endTime?: number;
}

export interface GameConfig {
  maxGuesses: number;
  avatarTimeout: number; // milliseconds
  rpcTimeout: number; // milliseconds
}

export interface CuratedENSName {
  name: string; // ENS name without .eth
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'individual' | 'project' | 'generic';
  hasAvatar: boolean;
  fallbackIcon?: string;
  addedDate: string; // ISO date string
  lastValidated: string; // Last technical validation
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>; // guess count -> frequency
}

export const INITIAL_GAME_STATE: Omit<GameState, 'currentENSName' | 'startTime'> = {
  guesses: [],
  currentGuessIndex: 0,
  gameStatus: 'playing',
  letterStates: {},
};

export const DEFAULT_GAME_CONFIG: GameConfig = {
  maxGuesses: 6,
  avatarTimeout: 3000, // 3 seconds
  rpcTimeout: 5000, // 5 seconds
};