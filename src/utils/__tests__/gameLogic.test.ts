/**
 * Tests for game logic utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateGuess,
  updateLetterStates,
  isGameWon,
  isGameLost,
  isValidGuess,
  createGuess,
} from '../gameLogic';
import type { LetterState } from '../../types';

describe('gameLogic', () => {
  describe('validateGuess', () => {
    it('should identify correct letters in correct positions', () => {
      const result = validateGuess('vitalik', 'vitalik');
      expect(result).toEqual([
        'correct', 'correct', 'correct', 'correct', 
        'correct', 'correct', 'correct'
      ]);
    });

    it('should identify wrong position letters', () => {
      const result = validateGuess('hello', 'world');
      expect(result).toEqual([
        'absent', 'absent', 'wrong-position', 'wrong-position', 'absent'
      ]);
    });

    it('should handle duplicate letters correctly', () => {
      const result = validateGuess('hello', 'alley');
      // h=absent, e=wrong-position, l=correct, l=correct, o=absent
      expect(result).toEqual([
        'absent', 'wrong-position', 'correct', 'correct', 'absent'
      ]);
    });

    it('should handle case insensitive matching', () => {
      const result = validateGuess('HELLO', 'hello');
      expect(result).toEqual([
        'correct', 'correct', 'correct', 'correct', 'correct'
      ]);
    });
  });

  describe('updateLetterStates', () => {
    it('should update letter states correctly', () => {
      const currentStates: Record<string, LetterState> = {
        'a': 'unused',
        'b': 'absent',
      };
      
      const result = updateLetterStates(currentStates, 'abc', ['correct', 'wrong-position', 'absent']);
      
      expect(result).toEqual({
        'a': 'correct',
        'b': 'wrong-position', // Should upgrade from absent
        'c': 'absent',
      });
    });

    it('should not downgrade letter states', () => {
      const currentStates: Record<string, LetterState> = {
        'a': 'correct',
        'b': 'wrong-position',
      };
      
      const result = updateLetterStates(currentStates, 'ab', ['absent', 'absent']);
      
      expect(result).toEqual({
        'a': 'correct', // Should not downgrade
        'b': 'wrong-position', // Should not downgrade
      });
    });
  });

  describe('isGameWon', () => {
    it('should return true when all letters are correct', () => {
      const feedback: LetterState[] = ['correct', 'correct', 'correct'];
      expect(isGameWon(feedback)).toBe(true);
    });

    it('should return false when not all letters are correct', () => {
      const feedback: LetterState[] = ['correct', 'wrong-position', 'correct'];
      expect(isGameWon(feedback)).toBe(false);
    });
  });

  describe('isGameLost', () => {
    it('should return true when max guesses reached', () => {
      expect(isGameLost(6, 6)).toBe(true);
    });

    it('should return false when under max guesses', () => {
      expect(isGameLost(5, 6)).toBe(false);
    });
  });

  describe('isValidGuess', () => {
    it('should accept valid guesses', () => {
      expect(isValidGuess('hello', 5)).toBe(true);
      expect(isValidGuess('WORLD', 5)).toBe(true);
    });

    it('should reject invalid length', () => {
      expect(isValidGuess('hi', 5)).toBe(false);
      expect(isValidGuess('toolong', 5)).toBe(false);
    });

    it('should reject non-alphabetic characters', () => {
      expect(isValidGuess('hel1o', 5)).toBe(false);
      expect(isValidGuess('hel-o', 5)).toBe(false);
      expect(isValidGuess('hel o', 5)).toBe(false);
    });

    it('should reject strings with leading/trailing spaces', () => {
      expect(isValidGuess(' hello', 6)).toBe(false);
      expect(isValidGuess('hello ', 6)).toBe(false);
    });
  });

  describe('createGuess', () => {
    it('should create guess with correct feedback', () => {
      const guess = createGuess('hello', 'world');
      
      expect(guess.word).toBe('hello');
      expect(guess.feedback).toEqual([
        'absent', 'absent', 'wrong-position', 'wrong-position', 'absent'
      ]);
    });

    it('should normalize case', () => {
      const guess = createGuess('HELLO', 'world');
      expect(guess.word).toBe('hello');
    });
  });
});