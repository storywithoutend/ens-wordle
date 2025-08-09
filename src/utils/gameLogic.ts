/**
 * Core game logic utilities for ENS-Wordle
 */

import type { LetterState, Guess } from '../types';

/**
 * Validates a guess against the target word and returns feedback
 * Handles duplicate letters correctly following Wordle rules
 */
export function validateGuess(guess: string, target: string): LetterState[] {
  const feedback: LetterState[] = new Array(guess.length).fill('absent');
  const targetLetters = target.toLowerCase().split('');
  const guessLetters = guess.toLowerCase().split('');
  
  // First pass: mark exact matches
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      feedback[i] = 'correct';
      targetLetters[i] = ''; // Mark as used
    }
  }
  
  // Second pass: mark wrong position matches
  for (let i = 0; i < guessLetters.length; i++) {
    if (feedback[i] === 'absent') {
      const targetIndex = targetLetters.indexOf(guessLetters[i] || '');
      if (targetIndex !== -1) {
        feedback[i] = 'wrong-position';
        targetLetters[targetIndex] = ''; // Mark as used
      }
    }
  }
  
  return feedback;
}

/**
 * Updates letter states based on the latest guess feedback
 */
export function updateLetterStates(
  currentStates: Record<string, LetterState>,
  guess: string,
  feedback: LetterState[]
): Record<string, LetterState> {
  const newStates = { ...currentStates };
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]?.toLowerCase();
    if (!letter) continue;
    const currentState = newStates[letter] || 'unused';
    const newState = feedback[i];
    
    // Priority: correct > wrong-position > absent > unused
    if (
      newState === 'correct' ||
      (newState === 'wrong-position' && currentState !== 'correct') ||
      (newState === 'absent' && !['correct', 'wrong-position'].includes(currentState))
    ) {
      newStates[letter] = newState;
    }
  }
  
  return newStates;
}

/**
 * Checks if the game is won (correct guess)
 */
export function isGameWon(feedback: LetterState[]): boolean {
  return feedback.every(state => state === 'correct');
}

/**
 * Checks if the game is lost (max guesses reached without win)
 */
export function isGameLost(guessCount: number, maxGuesses: number): boolean {
  return guessCount >= maxGuesses;
}

/**
 * Validates guess format (letters only, correct length)
 */
export function isValidGuess(guess: string, targetLength: number): boolean {
  return (
    guess.length === targetLength &&
    /^[a-zA-Z]+$/.test(guess) &&
    guess.trim().length === guess.length
  );
}

/**
 * Creates a new guess object with feedback
 */
export function createGuess(word: string, target: string): Guess {
  return {
    word: word.toLowerCase(),
    feedback: validateGuess(word, target),
  };
}

/**
 * Formats guess word for display (consistent casing)
 */
export function formatGuessForDisplay(word: string): string {
  return word.toLowerCase();
}

/**
 * Calculates game statistics
 */
export function calculateGameDuration(startTime: number, endTime?: number): number {
  const end = endTime || Date.now();
  return Math.round((end - startTime) / 1000); // seconds
}

/**
 * Gets the appropriate difficulty class for styling
 */
export function getDifficultyClass(length: number): string {
  if (length <= 5) return 'easy';
  if (length <= 8) return 'medium';
  return 'hard';
}