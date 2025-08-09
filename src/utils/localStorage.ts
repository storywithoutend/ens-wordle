/**
 * Local storage utilities with graceful fallback handling
 */

import type { GameState, GameStats } from '../types';

const GAME_STATE_KEY = 'ens-wordle-game-state';
const GAME_STATS_KEY = 'ens-wordle-stats';

/**
 * Checks if localStorage is available and functional
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely saves game state to localStorage with error handling
 */
export function saveGameState(gameState: GameState): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage unavailable, game progress will not be saved');
    return false;
  }

  try {
    const serialized = JSON.stringify(gameState);
    localStorage.setItem(GAME_STATE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
}

/**
 * Safely loads game state from localStorage with validation
 */
export function loadGameState(): GameState | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const serialized = localStorage.getItem(GAME_STATE_KEY);
    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized) as unknown;
    return validateGameState(parsed);
  } catch (error) {
    console.error('Failed to load game state:', error);
    // Clear corrupted data
    clearGameState();
    return null;
  }
}

/**
 * Validates that loaded data matches GameState interface
 */
function validateGameState(data: unknown): GameState | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const state = data as Record<string, unknown>;

  // Check required fields
  const requiredFields = [
    'currentENSName',
    'guesses',
    'currentGuessIndex',
    'gameStatus',
    'letterStates',
    'startTime',
  ];

  for (const field of requiredFields) {
    if (!(field in state)) {
      console.warn(`Missing required field: ${field}`);
      return null;
    }
  }

  // Basic type validation
  if (
    typeof state.currentENSName !== 'string' ||
    !Array.isArray(state.guesses) ||
    typeof state.currentGuessIndex !== 'number' ||
    !['playing', 'won', 'lost'].includes(state.gameStatus as string) ||
    typeof state.letterStates !== 'object' ||
    typeof state.startTime !== 'number'
  ) {
    console.warn('Invalid data types in saved game state');
    return null;
  }

  return state as unknown as GameState;
}

/**
 * Clears saved game state
 */
export function clearGameState(): void {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(GAME_STATE_KEY);
  }
}

/**
 * Saves game statistics
 */
export function saveGameStats(stats: GameStats): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const serialized = JSON.stringify(stats);
    localStorage.setItem(GAME_STATS_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save game stats:', error);
    return false;
  }
}

/**
 * Loads game statistics
 */
export function loadGameStats(): GameStats | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const serialized = localStorage.getItem(GAME_STATS_KEY);
    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized) as GameStats;
    return parsed;
  } catch (error) {
    console.error('Failed to load game stats:', error);
    return null;
  }
}

/**
 * Creates default game statistics
 */
export function createDefaultStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {},
  };
}

/**
 * Updates game statistics after game completion
 */
export function updateGameStats(
  currentStats: GameStats,
  won: boolean,
  guessCount?: number
): GameStats {
  const newStats: GameStats = {
    ...currentStats,
    gamesPlayed: currentStats.gamesPlayed + 1,
  };

  if (won) {
    newStats.gamesWon += 1;
    newStats.currentStreak += 1;
    newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);

    if (guessCount) {
      newStats.guessDistribution = {
        ...newStats.guessDistribution,
        [guessCount]: (newStats.guessDistribution[guessCount] || 0) + 1,
      };
    }
  } else {
    newStats.currentStreak = 0;
  }

  return newStats;
}