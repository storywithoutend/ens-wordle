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
   * Handles letter input from virtual keyboard
   */
  const handleLetterInput = (letter: string) => {
    if (isGameComplete) return;

    setInputError('');

    if (currentInput.length < targetLength) {
      setCurrentInput(prev => prev + letter.toLowerCase());
    }
  };

  /**
   * Handles backspace input
   */
  const handleBackspace = () => {
    if (isGameComplete) return;
    
    setInputError('');
    setCurrentInput(prev => prev.slice(0, -1));
  };

  /**
   * Handles guess submission
   */
  const handleSubmit = () => {
    if (isGameComplete) return;

    if (currentInput.length !== targetLength) {
      setInputError(`Must be ${targetLength} letters`);
      return;
    }

    if (!isValidGuessFormat(currentInput)) {
      setInputError('Only letters allowed');
      return;
    }

    const result = makeGuess(currentInput);
    
    if (result.success) {
      setCurrentInput('');
      setInputError('');
    } else if (result.error) {
      setInputError(result.error);
    }
  };

  /**
   * Handles new game start
   */
  const handleNewGame = () => {
    setCurrentInput('');
    setInputError('');
    startNewGame();
  };

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