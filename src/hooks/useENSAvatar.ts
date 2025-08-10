/**
 * Hook for managing ENS avatar loading with error handling
 */

import { useState, useEffect } from 'react';
import { fetchENSAvatar } from '../services/ensService';
import type { AvatarState } from '../types';

export interface UseENSAvatarReturn {
  avatarState: AvatarState;
  retry: () => void;
}

export function useENSAvatar(ensName: string): UseENSAvatarReturn {
  const [avatarState, setAvatarState] = useState<AvatarState>({
    type: 'loading',
  });

  const fetchAvatar = async (name: string) => {
    console.log(`[useENSAvatar] fetchAvatar called for: ${name}`);
    if (!name) {
      setAvatarState({ type: 'placeholder' });
      return;
    }

    setAvatarState({ type: 'loading' });

    try {
      const avatarUrl = await fetchENSAvatar(name);

      if (avatarUrl) {
        setAvatarState({
          type: 'loaded',
          src: avatarUrl,
        });
      } else {
        setAvatarState({ type: 'placeholder' });
      }
    } catch (error) {
      console.error(`[useENSAvatar] Error loading avatar for ${name}:`, error);
      setAvatarState({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const retry = () => {
    if (ensName) {
      fetchAvatar(ensName);
    }
  };

  useEffect(() => {
    console.log(`[useENSAvatar] ENS name changed to: ${ensName}`);
    // Reset to loading state immediately when ENS name changes
    setAvatarState({ type: 'loading' });
    fetchAvatar(ensName);
  }, [ensName]);

  return {
    avatarState,
    retry,
  };
}
