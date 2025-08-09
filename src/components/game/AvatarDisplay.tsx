/**
 * Avatar display component with loading states and fallback
 */

import React from 'react';
import type { AvatarState } from '../../types';
import './AvatarDisplay.css';

interface AvatarDisplayProps {
  ensName: string;
  avatarUrl?: string;
  state: AvatarState['type'];
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  ensName,
  avatarUrl,
  state,
  onImageLoad,
  onImageError,
}) => {
  const [imageLoadState, setImageLoadState] = React.useState<
    'loading' | 'loaded' | 'error'
  >('loading');

  const handleImageLoad = () => {
    setImageLoadState('loaded');
    onImageLoad?.();
  };

  const handleImageError = () => {
    setImageLoadState('error');
    onImageError?.();
  };

  const renderPlaceholder = (message: string) => (
    <div className="avatar-placeholder">
      <div className="placeholder-icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="placeholder-svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <p className="avatar-text">{message}</p>
    </div>
  );

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="avatar-loading">
            <div className="loading-spinner" />
            <p className="avatar-text">Loading avatar...</p>
          </div>
        );

      case 'loaded':
        if (avatarUrl && imageLoadState !== 'error') {
          return (
            <>
              <img
                src={avatarUrl}
                alt={`Avatar for ${ensName}.eth`}
                className="avatar-image"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {imageLoadState === 'loading' && (
                <div className="avatar-loading-overlay">
                  <div className="loading-spinner small" />
                </div>
              )}
            </>
          );
        }
        // If image failed to load, show placeholder
        return renderPlaceholder('Avatar unavailable');

      case 'placeholder':
        return renderPlaceholder('No avatar found');

      case 'error':
        return renderPlaceholder('Avatar unavailable');

      default:
        return renderPlaceholder('No avatar found');
    }
  };

  return (
    <div className={`avatar-display state-${state}`}>
      <div className="avatar-container">{renderContent()}</div>

      <div className="ens-info">
        <h2 className="ens-name">{ensName}.eth</h2>
        <p className="ens-hint">Guess this ENS name!</p>
      </div>
    </div>
  );
};
