/**
 * Game state management hook for ENS-Wordle
 */

import { useState, useCallback, useEffect } from 'react';
import type { GameState, GameStats, CuratedENSName } from '@types';
import {
  INITIAL_GAME_STATE,
  DEFAULT_GAME_CONFIG,
} from '@types';
import {
  validateGuess,
  updateLetterStates,
  isGameWon,
  isGameLost,
  isValidGuess,
  createGuess,
} from '@utils/gameLogic';
import {
  saveGameState,
  loadGameState,
  clearGameState,
  loadGameStats,
  saveGameStats,
  createDefaultStats,
  updateGameStats,
} from '@utils/localStorage';
import { getRandomENSName } from '@utils/ensNames';

export interface UseGameStateReturn {
  gameState: GameState;
  gameStats: GameStats;
  makeGuess: (word: string) => {
    success: boolean;
    error?: string;
  };
  startNewGame: () => void;
  resetGame: () => void;
  isValidGuessFormat: (word: string) => boolean;
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved game state, otherwise start fresh
    const savedState = loadGameState();
    if (savedState && savedState.gameStatus === 'playing') {
      return savedState;
    }
    
    return initializeNewGame();
  });

  const [gameStats, setGameStats] = useState<GameStats>(() => {
    return loadGameStats() || createDefaultStats();
  });

  // Auto-save game state on changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Auto-save stats on changes
  useEffect(() => {
    saveGameStats(gameStats);
  }, [gameStats]);

  /**
   * Creates a new game state
   */
  function initializeNewGame(): GameState {
    const selectedName = getRandomENSName();
    
    return {
      ...INITIAL_GAME_STATE,
      currentENSName: selectedName.name,
      startTime: Date.now(),
    };
  }

  /**
   * Makes a guess and updates game state
   */
  const makeGuess = useCallback((word: string) => {
    if (gameState.gameStatus !== 'playing') {
      return { success: false, error: 'Game is not in playing state' };
    }

    // Validate guess format
    if (!isValidGuess(word, gameState.currentENSName.length)) {
      if (word.length !== gameState.currentENSName.length) {
        return { 
          success: false, 
          error: `Must be ${gameState.currentENSName.length} letters` 
        };
      }
      if (!/^[a-zA-Z]+$/.test(word)) {
        return { success: false, error: 'Only letters allowed' };
      }
    }

    // Create new guess with feedback
    const guess = createGuess(word, gameState.currentENSName);
    const newGuesses = [...gameState.guesses, guess];
    const newLetterStates = updateLetterStates(
      gameState.letterStates,
      word,
      guess.feedback
    );

    // Check win condition
    const won = isGameWon(guess.feedback);
    const lost = !won && isGameLost(newGuesses.length, DEFAULT_GAME_CONFIG.maxGuesses);
    
    let newGameStatus: GameState['gameStatus'] = 'playing';
    let endTime: number | undefined;
    
    if (won) {
      newGameStatus = 'won';
      endTime = Date.now();
    } else if (lost) {
      newGameStatus = 'lost';
      endTime = Date.now();
    }

    // Update game state
    const newGameState: GameState = {
      ...gameState,
      guesses: newGuesses,
      currentGuessIndex: gameState.currentGuessIndex + 1,
      letterStates: newLetterStates,
      gameStatus: newGameStatus,
      endTime,
    };

    setGameState(newGameState);

    // Update stats if game completed
    if (won || lost) {
      const newStats = updateGameStats(gameStats, won, newGuesses.length);
      setGameStats(newStats);
    }

    return { success: true };
  }, [gameState, gameStats]);

  /**
   * Starts a completely new game
   */
  const startNewGame = useCallback(() => {
    clearGameState();
    const newGameState = initializeNewGame();
    setGameState(newGameState);
  }, []);

  /**
   * Resets current game to initial state
   */
  const resetGame = useCallback(() => {
    const resetGameState: GameState = {
      ...INITIAL_GAME_STATE,
      currentENSName: gameState.currentENSName,
      currentAvatarUrl: gameState.currentAvatarUrl,
      startTime: Date.now(),
    };
    setGameState(resetGameState);
  }, [gameState.currentENSName, gameState.currentAvatarUrl]);

  /**
   * Validates guess format without making the guess
   */
  const isValidGuessFormat = useCallback((word: string) => {
    return isValidGuess(word, gameState.currentENSName.length);
  }, [gameState.currentENSName.length]);

  return {
    gameState,
    gameStats,
    makeGuess,
    startNewGame,
    resetGame,
    isValidGuessFormat,
  };
}