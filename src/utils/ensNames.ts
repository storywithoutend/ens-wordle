/**
 * ENS name selection and management utilities
 */

import type { CuratedENSName } from '@types';
import curatedNames from '@data/curated-ens-names.json';

/**
 * Gets a random ENS name from the curated list
 */
export function getRandomENSName(): CuratedENSName {
  const names = curatedNames as CuratedENSName[];
  if (names.length === 0) {
    throw new Error('No curated ENS names available');
  }
  
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

/**
 * Gets a random ENS name by difficulty level
 */
export function getRandomENSNameByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard'
): CuratedENSName {
  const names = curatedNames as CuratedENSName[];
  const filteredNames = names.filter(name => name.difficulty === difficulty);
  
  if (filteredNames.length === 0) {
    console.warn(`No ${difficulty} names available, falling back to any difficulty`);
    return getRandomENSName();
  }
  
  const randomIndex = Math.floor(Math.random() * filteredNames.length);
  return filteredNames[randomIndex];
}

/**
 * Gets a random ENS name by category
 */
export function getRandomENSNameByCategory(
  category: 'individual' | 'project' | 'generic'
): CuratedENSName {
  const names = curatedNames as CuratedENSName[];
  const filteredNames = names.filter(name => name.category === category);
  
  if (filteredNames.length === 0) {
    console.warn(`No ${category} names available, falling back to any category`);
    return getRandomENSName();
  }
  
  const randomIndex = Math.floor(Math.random() * filteredNames.length);
  return filteredNames[randomIndex];
}

/**
 * Validates that an ENS name is in the curated list
 */
export function isValidCuratedName(name: string): boolean {
  const names = curatedNames as CuratedENSName[];
  return names.some(curatedName => curatedName.name.toLowerCase() === name.toLowerCase());
}

/**
 * Gets ENS name metadata from curated list
 */
export function getENSNameMetadata(name: string): CuratedENSName | null {
  const names = curatedNames as CuratedENSName[];
  return names.find(curatedName => 
    curatedName.name.toLowerCase() === name.toLowerCase()
  ) || null;
}

/**
 * Gets fallback ENS name for error scenarios
 */
export function getFallbackENSName(): CuratedENSName {
  const names = curatedNames as CuratedENSName[];
  
  // Try to find a reliable fallback (short, known to have avatar)
  const fallback = names.find(name => 
    name.name === 'vitalik' || 
    name.name === 'ens' ||
    (name.difficulty === 'easy' && name.hasAvatar)
  );
  
  return fallback || names[0];
}

/**
 * Gets curated list statistics
 */
export function getCuratedListStats() {
  const names = curatedNames as CuratedENSName[];
  
  const stats = {
    total: names.length,
    byDifficulty: {
      easy: names.filter(n => n.difficulty === 'easy').length,
      medium: names.filter(n => n.difficulty === 'medium').length,
      hard: names.filter(n => n.difficulty === 'hard').length,
    },
    byCategory: {
      individual: names.filter(n => n.category === 'individual').length,
      project: names.filter(n => n.category === 'project').length,
      generic: names.filter(n => n.category === 'generic').length,
    },
    withAvatars: names.filter(n => n.hasAvatar).length,
    averageLength: Math.round(
      names.reduce((sum, name) => sum + name.name.length, 0) / names.length
    ),
  };
  
  return stats;
}

/**
 * Validates the entire curated list for development
 */
export function validateCuratedList(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const names = curatedNames as CuratedENSName[];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (names.length === 0) {
    errors.push('Curated list is empty');
    return { isValid: false, errors, warnings };
  }
  
  const seenNames = new Set<string>();
  
  names.forEach((name, index) => {
    // Check for required fields
    if (!name.name || typeof name.name !== 'string') {
      errors.push(`Entry ${index}: missing or invalid name field`);
    }
    
    if (!['easy', 'medium', 'hard'].includes(name.difficulty)) {
      errors.push(`Entry ${index}: invalid difficulty "${name.difficulty}"`);
    }
    
    if (!['individual', 'project', 'generic'].includes(name.category)) {
      errors.push(`Entry ${index}: invalid category "${name.category}"`);
    }
    
    // Check for duplicates
    const lowerName = name.name.toLowerCase();
    if (seenNames.has(lowerName)) {
      errors.push(`Entry ${index}: duplicate name "${name.name}"`);
    }
    seenNames.add(lowerName);
    
    // Check name format
    if (!/^[a-zA-Z0-9-]+$/.test(name.name)) {
      errors.push(`Entry ${index}: invalid characters in "${name.name}"`);
    }
    
    // Length warnings
    if (name.name.length < 3) {
      warnings.push(`Entry ${index}: very short name "${name.name}"`);
    }
    
    if (name.name.length > 12) {
      warnings.push(`Entry ${index}: very long name "${name.name}"`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}