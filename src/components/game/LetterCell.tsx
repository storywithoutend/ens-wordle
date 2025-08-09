/**
 * Individual letter cell component with state-based styling
 */

import React from 'react';
import type { LetterState } from '../../types';
import './LetterCell.css';

interface LetterCellProps {
  letter: string;
  state: LetterState;
  position: { row: number; col: number };
  isCurrentGuess?: boolean;
}

export const LetterCell: React.FC<LetterCellProps> = ({
  letter,
  state,
  position,
  isCurrentGuess = false,
}) => {
  const cellClasses = [
    'letter-cell',
    `state-${state}`,
    isCurrentGuess ? 'current-guess' : '',
    letter ? 'filled' : 'empty',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cellClasses}
      data-row={position.row}
      data-col={position.col}
      role="gridcell"
      aria-label={
        letter 
          ? `${letter.toUpperCase()}, ${state}`
          : `Empty cell, row ${position.row + 1}, column ${position.col + 1}`
      }
    >
      {letter.toUpperCase()}
    </div>
  );
};