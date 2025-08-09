/**
 * Game grid component displaying guesses and current input
 */

import React from 'react';
import type { Guess } from '@types';
import { LetterCell } from './LetterCell';
import './GameGrid.css';

interface GameGridProps {
  guesses: Guess[];
  currentInput: string;
  targetLength: number;
  maxGuesses: number;
  currentGuessIndex: number;
}

export const GameGrid: React.FC<GameGridProps> = ({
  guesses,
  currentInput,
  targetLength,
  maxGuesses,
  currentGuessIndex,
}) => {
  // Create array for all rows (completed + current + empty)
  const rows = [];

  // Add completed guess rows
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const row = [];
    
    for (let j = 0; j < targetLength; j++) {
      row.push(
        <LetterCell
          key={`${i}-${j}`}
          letter={guess.word[j] || ''}
          state={guess.feedback[j] || 'unused'}
          position={{ row: i, col: j }}
        />
      );
    }
    
    rows.push(
      <div key={i} className="grid-row completed">
        {row}
      </div>
    );
  }

  // Add current input row (if game still playing)
  if (currentGuessIndex < maxGuesses && guesses.length === currentGuessIndex) {
    const currentRow = [];
    
    for (let j = 0; j < targetLength; j++) {
      currentRow.push(
        <LetterCell
          key={`current-${j}`}
          letter={currentInput[j] || ''}
          state="unused"
          position={{ row: currentGuessIndex, col: j }}
          isCurrentGuess={true}
        />
      );
    }
    
    rows.push(
      <div key="current" className="grid-row current">
        {currentRow}
      </div>
    );
  }

  // Add remaining empty rows
  const remainingRows = maxGuesses - rows.length;
  for (let i = 0; i < remainingRows; i++) {
    const emptyRow = [];
    const rowIndex = rows.length + i;
    
    for (let j = 0; j < targetLength; j++) {
      emptyRow.push(
        <LetterCell
          key={`empty-${rowIndex}-${j}`}
          letter=""
          state="unused"
          position={{ row: rowIndex, col: j }}
        />
      );
    }
    
    rows.push(
      <div key={`empty-${i}`} className="grid-row empty">
        {emptyRow}
      </div>
    );
  }

  return (
    <div 
      className="game-grid"
      style={{
        '--grid-columns': targetLength,
        '--grid-rows': maxGuesses,
      } as React.CSSProperties}
    >
      {rows}
    </div>
  );
};