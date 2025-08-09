/**
 * ENS integration type definitions
 */

export interface ENSData {
  name: string;
  address?: string;
  avatar?: string;
  displayName?: string;
}

export interface AvatarState {
  type: 'loading' | 'loaded' | 'placeholder' | 'error';
  src?: string;
  error?: string;
}

export interface ENSService {
  resolveENS: (name: string) => Promise<ENSData | null>;
  getAvatar: (name: string) => Promise<string | null>;
  validateENSName: (name: string) => boolean;
}

export interface ENSError {
  type: 'resolution' | 'avatar' | 'network' | 'timeout' | 'validation';
  message: string;
  ensName?: string;
  originalError?: Error;
}

export const PLACEHOLDER_AVATAR = '/placeholder-avatar.svg';
export const DEFAULT_AVATAR = '/default-ens-avatar.svg';
