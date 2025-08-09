/**
 * Central type exports for ENS-Wordle
 */

// Game types
export type {
  LetterState,
  GameStatus,
  Guess,
  GameState,
  GameConfig,
  CuratedENSName,
  GameStats,
} from './game';

export { INITIAL_GAME_STATE, DEFAULT_GAME_CONFIG } from './game';

// ENS types
export type {
  ENSData,
  AvatarState,
  ENSService,
  ENSError,
} from './ens';

export { PLACEHOLDER_AVATAR, DEFAULT_AVATAR } from './ens';

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;