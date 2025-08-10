/**
 * Avatar display component with loading states and fallback
 */

import React from 'react';
import type { AvatarState, CuratedENSName } from '../../types';
import './AvatarDisplay.css';

interface AvatarDisplayProps {
  ensName: string;
  ensMetadata?: CuratedENSName | null;
  avatarUrl?: string;
  state: AvatarState['type'];
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  ensName,
  ensMetadata,
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

  const renderPlaceholder = () => (
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
        return renderPlaceholder();

      case 'placeholder':
        return renderPlaceholder();

      case 'error':
        return renderPlaceholder();

      default:
        return renderPlaceholder();
    }
  };

  return (
    <div className={`avatar-display state-${state}`}>
      <div className="avatar-container">{renderContent()}</div>

      <div className="ens-info">
        {ensMetadata ? (
          <>
            <div className="ens-metadata">
              <span className={`category-tag category-${ensMetadata.category}`}>
                {ensMetadata.category}
              </span>
              <span className={`difficulty-tag difficulty-${ensMetadata.difficulty}`}>
                {ensMetadata.difficulty}
              </span>
            </div>
            <p className="ens-hint">
              Guess this {ensMetadata.category} ENS name!
            </p>
          </>
        ) : (
          <>
            <h2 className="ens-name">Loading...</h2>
            <p className="ens-hint">Guess this ENS name!</p>
          </>
        )}
      </div>
    </div>
  );
};
