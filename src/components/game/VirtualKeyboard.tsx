/**
 * Virtual keyboard component for touch-friendly input
 */

import React from 'react';
import type { LetterState } from '../../types';
import './VirtualKeyboard.css';

interface VirtualKeyboardProps {
  onLetterClick: (letter: string) => void;
  onBackspace: () => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onLetterClick,
  onBackspace,
  letterStates,
  disabled = false,
}) => {
  const handleKeyClick = (key: string) => {
    if (disabled) return;

    if (key === 'BACKSPACE') {
      onBackspace();
    } else {
      onLetterClick(key.toLowerCase());
    }
  };

  const getKeyState = (key: string): LetterState => {
    if (key === 'BACKSPACE') return 'unused';
    return letterStates[key.toLowerCase()] || 'unused';
  };

  const getKeyLabel = (key: string): string => {
    if (key === 'BACKSPACE') return '⌫';
    return key;
  };

  const getKeyAriaLabel = (key: string): string => {
    if (key === 'BACKSPACE') return 'Backspace';
    
    const state = getKeyState(key);
    if (state === 'unused') return `Letter ${key}`;
    return `Letter ${key}, ${state}`;
  };

  return (
    <div className="virtual-keyboard" role="group" aria-label="Virtual keyboard">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => {
            const state = getKeyState(key);
            const isSpecialKey = key === 'BACKSPACE';
            
            const buttonClasses = [
              'keyboard-key',
              `state-${state}`,
              isSpecialKey ? 'special-key' : 'letter-key',
              key === 'BACKSPACE' ? 'backspace-key' : '',
              disabled ? 'disabled' : '',
            ].filter(Boolean).join(' ');

            return (
              <button
                key={key}
                className={buttonClasses}
                onClick={() => handleKeyClick(key)}
                disabled={disabled}
                aria-label={getKeyAriaLabel(key)}
                data-key={key}
              >
                {getKeyLabel(key)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};