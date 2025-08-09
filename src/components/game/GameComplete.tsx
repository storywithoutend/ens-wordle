/**
 * Game completion modal showing results and new game option
 */

import React from 'react';
import type { GameState } from '@types';
import { calculateGameDuration } from '@utils/gameLogic';
import './GameComplete.css';

interface GameCompleteProps {
  gameState: GameState;
  onNewGame: () => void;
}

export const GameComplete: React.FC<GameCompleteProps> = ({
  gameState,
  onNewGame,
}) => {
  const isWin = gameState.gameStatus === 'won';
  const guessCount = gameState.guesses.length;
  const duration = calculateGameDuration(gameState.startTime, gameState.endTime);
  
  const title = isWin ? 'Congratulations!' : 'Game Over';
  const message = isWin 
    ? `You guessed ${gameState.currentENSName}.eth in ${guessCount} ${guessCount === 1 ? 'try' : 'tries'}!`
    : `The answer was ${gameState.currentENSName}.eth`;

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="game-complete-overlay" role="dialog" aria-modal="true">
      <div className="game-complete-modal">
        <div className="modal-header">
          <h2 className={`modal-title ${isWin ? 'win' : 'loss'}`}>
            {title}
          </h2>
        </div>

        <div className="modal-content">
          <p className="result-message">{message}</p>
          
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Time:</span>
              <span className="stat-value">{formatDuration(duration)}</span>
            </div>
            
            {isWin && (
              <div className="stat-item">
                <span className="stat-label">Guesses:</span>
                <span className="stat-value">{guessCount}/6</span>
              </div>
            )}
          </div>

          <div className="ens-info">
            <p className="ens-name">{gameState.currentENSName}.eth</p>
            {gameState.currentAvatarUrl && (
              <div className="final-avatar">
                <img 
                  src={gameState.currentAvatarUrl} 
                  alt={`Avatar for ${gameState.currentENSName}.eth`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-primary new-game-btn"
            onClick={onNewGame}
            autoFocus
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};