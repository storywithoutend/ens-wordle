/**
 * Main game board component that orchestrates the entire game
 */

import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { GameGrid } from './GameGrid';
import { VirtualKeyboard } from './VirtualKeyboard';
import { GameComplete } from './GameComplete';
import './GameBoard.css';

export const GameBoard: React.FC = () => {
  const {
    gameState,
    makeGuess,
    startNewGame,
    isValidGuessFormat,
  } = useGameState();

  const [currentInput, setCurrentInput] = React.useState('');
  const [inputError, setInputError] = React.useState<string>('');

  const targetLength = gameState.currentENSName.length;
  const isGameComplete = gameState.gameStatus !== 'playing';

  /**
   * Submits a word (used by both manual submit and auto-submit)
   */
  const submitWord = React.useCallback((word: string) => {
    if (isGameComplete) return;

    if (word.length !== targetLength) {
      setInputError(`Must be ${targetLength} letters`);
      return;
    }

    if (!isValidGuessFormat(word)) {
      setInputError('Only letters allowed');
      return;
    }

    const result = makeGuess(word);
    
    if (result.success) {
      setCurrentInput('');
      setInputError('');
    } else if (result.error) {
      setInputError(result.error);
    }
  }, [isGameComplete, targetLength, isValidGuessFormat, makeGuess]);

  /**
   * Handles letter input from virtual keyboard
   */
  const handleLetterInput = React.useCallback((letter: string) => {
    if (isGameComplete) return;

    setInputError('');

    if (currentInput.length < targetLength) {
      const newInput = currentInput + letter.toLowerCase();
      setCurrentInput(newInput);
      
      // Auto-submit when word is complete
      if (newInput.length === targetLength) {
        // Auto-submit the completed word
        submitWord(newInput);
      }
    }
  }, [isGameComplete, currentInput, targetLength, submitWord]);

  /**
   * Handles backspace input
   */
  const handleBackspace = React.useCallback(() => {
    if (isGameComplete) return;
    
    setInputError('');
    setCurrentInput(prev => prev.slice(0, -1));
  }, [isGameComplete]);

  /**
   * Handles manual guess submission (Enter key or Enter button)
   */
  const handleSubmit = React.useCallback(() => {
    submitWord(currentInput);
  }, [submitWord, currentInput]);

  /**
   * Handles new game start
   */
  const handleNewGame = () => {
    setCurrentInput('');
    setInputError('');
    startNewGame();
  };

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameComplete) return;

      if (event.key === 'Enter') {
        handleSubmit();
      } else if (event.key === 'Backspace') {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleLetterInput(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameComplete, handleSubmit, handleBackspace, handleLetterInput]);

  return (
    <div className="game-board">
      {/* Avatar Display Area - TODO: Implement avatar component */}
      <div className="avatar-section">
        <div className="avatar-placeholder">
          <div className="placeholder-icon">🖼️</div>
          <p>Avatar for: {gameState.currentENSName}.eth</p>
        </div>
      </div>

      {/* Game Grid */}
      <div className="game-section">
        <GameGrid
          guesses={gameState.guesses}
          currentInput={currentInput}
          targetLength={targetLength}
          maxGuesses={6}
          currentGuessIndex={gameState.currentGuessIndex}
        />

        {inputError && (
          <div className="input-error" role="alert">
            {inputError}
          </div>
        )}
      </div>

      {/* Virtual Keyboard */}
      {!isGameComplete && (
        <VirtualKeyboard
          onLetterClick={handleLetterInput}
          onBackspace={handleBackspace}
          onEnter={handleSubmit}
          letterStates={gameState.letterStates}
          disabled={isGameComplete}
        />
      )}

      {/* Game Complete Modal */}
      {isGameComplete && (
        <GameComplete
          gameState={gameState}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
};