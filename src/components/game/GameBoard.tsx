/**
 * Main game board component that orchestrates the entire game
 */

import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useENSAvatar } from '../../hooks/useENSAvatar';
import { getENSNameMetadata } from '../../utils/ensNames';
import { GameGrid } from './GameGrid';
import { VirtualKeyboard } from './VirtualKeyboard';
import { GameComplete } from './GameComplete';
import { AvatarDisplay } from './AvatarDisplay';
import './GameBoard.css';

export const GameBoard: React.FC = () => {
  const { gameState, makeGuess, startNewGame, isValidGuessFormat } =
    useGameState();

  const { avatarState, retry: retryAvatar } = useENSAvatar(
    gameState.currentENSName
  );

  // Get ENS metadata for display
  const ensMetadata = React.useMemo(
    () => getENSNameMetadata(gameState.currentENSName),
    [gameState.currentENSName]
  );

  const [currentInput, setCurrentInput] = React.useState('');
  const [inputError, setInputError] = React.useState<string>('');

  const targetLength = gameState.currentENSName.length;
  const isGameComplete = gameState.gameStatus !== 'playing';

  /**
   * Submits a word (used by both manual submit and auto-submit)
   */
  const submitWord = React.useCallback(
    (word: string) => {
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
    },
    [isGameComplete, targetLength, isValidGuessFormat, makeGuess]
  );

  /**
   * Handles letter input from virtual keyboard
   */
  const handleLetterInput = React.useCallback(
    (letter: string) => {
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
    },
    [isGameComplete, currentInput, targetLength, submitWord]
  );

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
      {/* Avatar Display Area */}
      <div className="avatar-section">
        <AvatarDisplay
          ensName={gameState.currentENSName}
          ensMetadata={ensMetadata}
          avatarUrl={
            avatarState.type === 'loaded' ? avatarState.src : undefined
          }
          state={avatarState.type}
          onImageLoad={() =>
            console.log(
              `[GameBoard] Avatar loaded for ${gameState.currentENSName}`
            )
          }
          onImageError={() => {
            console.warn(
              `[GameBoard] Avatar failed to load for ${gameState.currentENSName}`
            );
            retryAvatar();
          }}
        />
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
          letterStates={gameState.letterStates}
          disabled={isGameComplete}
        />
      )}

      {/* Game Complete Modal */}
      {isGameComplete && (
        <GameComplete gameState={gameState} onNewGame={handleNewGame} />
      )}
    </div>
  );
};
