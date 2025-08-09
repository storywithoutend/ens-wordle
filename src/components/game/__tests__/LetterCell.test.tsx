/**
 * Tests for LetterCell component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LetterCell } from '../LetterCell';

describe('LetterCell', () => {
  const defaultProps = {
    letter: 'A',
    state: 'unused' as const,
    position: { row: 0, col: 0 },
  };

  it('renders letter correctly', () => {
    render(<LetterCell {...defaultProps} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders uppercase letters', () => {
    render(<LetterCell {...defaultProps} letter="a" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders empty cell', () => {
    render(<LetterCell {...defaultProps} letter="" />);
    const cell = screen.getByRole('gridcell');
    expect(cell).toHaveTextContent('');
  });

  it('applies correct CSS classes', () => {
    render(<LetterCell {...defaultProps} state="correct" />);
    const cell = screen.getByRole('gridcell');
    expect(cell).toHaveClass('letter-cell', 'state-correct', 'filled');
  });

  it('applies current guess class', () => {
    render(<LetterCell {...defaultProps} isCurrentGuess={true} />);
    const cell = screen.getByRole('gridcell');
    expect(cell).toHaveClass('current-guess');
  });

  it('has accessible aria-label', () => {
    render(<LetterCell {...defaultProps} state="correct" />);
    const cell = screen.getByRole('gridcell');
    expect(cell).toHaveAttribute('aria-label', 'A, correct');
  });

  it('has accessible aria-label for empty cell', () => {
    render(<LetterCell {...defaultProps} letter="" />);
    const cell = screen.getByRole('gridcell');
    expect(cell).toHaveAttribute('aria-label', 'Empty cell, row 1, column 1');
  });

  it('includes position data attributes', () => {
    render(<LetterCell {...defaultProps} position={{ row: 2, col: 3 }} />);
    const cell = screen.getByRole('gridcell');
    expect(cell).toHaveAttribute('data-row', '2');
    expect(cell).toHaveAttribute('data-col', '3');
  });
});