# Error Handling Guide - ENS-Wordle

## Error Handling Philosophy

### User Experience Principles
- **Graceful Degradation**: Game remains playable even when things go wrong
- **Invisible Recovery**: Fix problems behind the scenes without user awareness when possible
- **Clear Communication**: When user needs to know, use plain language and actionable guidance
- **Consistent Patterns**: Same error types get same treatment across the app

### Technical Principles
- **Fail Fast**: Detect problems early and handle them before they cascade
- **Defensive Programming**: Assume external services will fail and prepare accordingly
- **Logging Strategy**: Log technical details for debugging while keeping user messages simple
- **Recovery First**: Always attempt automatic recovery before showing error to user

## Error Classification System

### Severity Levels

#### Critical (System Breaking)
- **Impact**: Game completely unusable
- **User Action**: Required to resolve
- **Examples**: Complete local storage failure, all RPC endpoints down
- **Response Time**: Immediate user notification

#### High (Feature Breaking)  
- **Impact**: Major feature unavailable but game playable
- **User Action**: Optional workaround available
- **Examples**: Avatar loading completely fails, ENS resolution unavailable
- **Response Time**: Graceful fallback with optional notification

#### Medium (Feature Degraded)
- **Impact**: Feature works but with reduced functionality
- **User Action**: None required
- **Examples**: Slow avatar loading, single RPC endpoint failure
- **Response Time**: Silent recovery with logging

#### Low (Cosmetic)
- **Impact**: Visual issues but no functional impact
- **User Action**: None
- **Examples**: Animation glitches, minor layout issues
- **Response Time**: Log for future fix, no user notification

## Error Scenarios and Responses

### ENS Integration Errors

#### Avatar Loading Failures

**Scenario**: ENS name has no avatar record
```typescript
// Technical handling
if (!avatarUrl) {
  setAvatarState({ type: 'placeholder', src: PLACEHOLDER_AVATAR });
}

// User experience
// SILENT - No message shown, placeholder displays immediately
```

**Scenario**: Avatar image fails to load (404, CORS, etc.)
```typescript
// Technical handling  
<img 
  src={avatarUrl} 
  onError={() => setAvatarState({ type: 'placeholder', src: PLACEHOLDER_AVATAR })}
  onLoad={() => setAvatarState({ type: 'loaded', src: avatarUrl })}
/>

// User experience
// SILENT - Placeholder appears without error message
```

**Scenario**: Avatar loading timeout (>3 seconds)
```typescript
// Technical handling
const timeoutId = setTimeout(() => {
  setAvatarState({ type: 'placeholder', src: PLACEHOLDER_AVATAR });
  logError('Avatar timeout', { ensName, timeoutDuration: 3000 });
}, 3000);

// User experience  
// SILENT - Loading state replaced by placeholder
```

#### ENS Resolution Failures

**Scenario**: Primary RPC endpoint unavailable
```typescript
// Technical handling
try {
  const address = await primaryClient.getEnsAddress({ name: ensName });
} catch (error) {
  const address = await backupClient.getEnsAddress({ name: ensName });
  logError('Primary RPC failed, using backup', { ensName, error });
}

// User experience
// SILENT - User never knows primary failed
```

**Scenario**: All RPC endpoints unavailable
```typescript
// Technical handling
const fallbackName = getFallbackENSName(); // From cached list
setGameState({ ...gameState, currentENSName: fallbackName });
showToast({
  type: 'info',
  message: 'Playing offline mode',
  duration: 2000
});

// User message
"Playing offline mode"
```

**Scenario**: Invalid ENS name in curated list
```typescript
// Technical handling
const validName = validateENSName(selectedName);
if (!validName) {
  const fallbackName = getRandomValidENSName();
  logError('Invalid ENS name in curated list', { invalidName: selectedName });
  setGameState({ ...gameState, currentENSName: fallbackName });
}

// User experience
// SILENT - Different valid name selected automatically
```

### Game State Management Errors

#### Local Storage Issues

**Scenario**: localStorage quota exceeded
```typescript
// Technical handling
try {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    useInMemoryStorage();
    showToast({
      type: 'warning', 
      message: "Progress won't be saved",
      duration: 3000
    });
  }
}

// User message
"Progress won't be saved"
```

**Scenario**: Corrupted game state data
```typescript
// Technical handling
try {
  const savedState = JSON.parse(localStorage.getItem(GAME_STATE_KEY));
  const validatedState = validateGameState(savedState);
  return validatedState;
} catch (error) {
  logError('Corrupted game state, starting fresh', { error });
  localStorage.removeItem(GAME_STATE_KEY);
  return getInitialGameState();
}

// User experience
// SILENT - Fresh game starts without explanation
```

**Scenario**: localStorage unavailable (private browsing)
```typescript
// Technical handling  
const isStorageAvailable = checkStorageAvailability();
if (!isStorageAvailable) {
  useInMemoryStorage();
  showToast({
    type: 'info',
    message: 'Using session-only mode', 
    duration: 3000
  });
}

// User message
"Using session-only mode"
```

#### Game Logic Errors

**Scenario**: Invalid guess format (non-alphabetic)
```typescript
// Technical handling
const isValidGuess = /^[a-zA-Z]+$/.test(guess);
if (!isValidGuess) {
  setInputError('Only letters allowed');
  return;
}

// User message (inline validation)
"Only letters allowed"
```

**Scenario**: Guess length mismatch
```typescript
// Technical handling
if (guess.length !== targetName.length) {
  setInputError(`Must be ${targetName.length} letters`);
  return;
}

// User message (inline validation)
"Must be 5 letters" // Example for 5-letter name
```

**Scenario**: Maximum guesses exceeded (edge case)
```typescript
// Technical handling
if (currentGuess >= MAX_GUESSES) {
  setGameState({ ...gameState, status: 'lost' });
  showGameOverModal({ type: 'lost', correctAnswer: currentENSName });
  return;
}

// User experience
// Standard game over flow, no error message needed
```

### Network and Performance Errors

#### Connection Issues

**Scenario**: Complete network failure during gameplay
```typescript
// Technical handling
window.addEventListener('offline', () => {
  setNetworkStatus('offline');
  showToast({
    type: 'warning',
    message: 'Playing offline',
    duration: 2000  
  });
});

window.addEventListener('online', () => {
  setNetworkStatus('online');
  showToast({
    type: 'success', 
    message: 'Connected',
    duration: 1000
  });
});

// User messages
"Playing offline" → "Connected"
```

**Scenario**: Slow network performance
```typescript
// Technical handling
const slowConnectionThreshold = 5000; // 5 seconds
const startTime = Date.now();

// After request completes
const requestDuration = Date.now() - startTime;
if (requestDuration > slowConnectionThreshold) {
  showToast({
    type: 'info',
    message: 'Slow connection detected',
    duration: 2000
  });
}

// User message
"Slow connection detected"
```

#### Performance Degradation

**Scenario**: Animation frame rate drops
```typescript
// Technical handling
let frameCount = 0;
let lastTime = performance.now();

const monitorPerformance = (currentTime) => {
  frameCount++;
  if (currentTime - lastTime >= 1000) {
    const fps = frameCount;
    if (fps < 30) {
      reduceAnimations();
      logError('Low FPS detected', { fps });
    }
    frameCount = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(monitorPerformance);
};

// User experience
// SILENT - Automatically reduce animations for smoother experience
```

**Scenario**: Memory pressure detected
```typescript
// Technical handling
if (performance.memory && performance.memory.usedJSHeapSize > MEMORY_THRESHOLD) {
  cleanupUnusedAssets();
  logError('High memory usage detected', { 
    used: performance.memory.usedJSHeapSize 
  });
}

// User experience
// SILENT - Automatic cleanup without user notification
```

### User Interface Errors

#### Input Validation

**Scenario**: Virtual keyboard malfunction
```typescript
// Technical handling
const handleKeyPress = (key) => {
  try {
    processKeyInput(key);
  } catch (error) {
    logError('Virtual keyboard error', { key, error });
    // Fallback to physical keyboard
    showToast({
      type: 'info',
      message: 'Use device keyboard',
      duration: 3000
    });
  }
};

// User message
"Use device keyboard"
```

**Scenario**: Screen orientation issues
```typescript
// Technical handling
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    recalculateLayout();
    if (hasLayoutIssues()) {
      showToast({
        type: 'info',
        message: 'Rotate device for better view',
        duration: 3000
      });
    }
  }, 100);
});

// User message
"Rotate device for better view"
```

## User Message Standards

### Message Categories

#### Toast Notifications
- **Duration**: 1-3 seconds based on importance
- **Position**: Bottom center on mobile, top right on desktop
- **Max Length**: 25 characters for mobile display
- **Tone**: Friendly and encouraging

#### Inline Validation Messages
- **Duration**: Until user corrects input
- **Position**: Below relevant input field
- **Max Length**: 20 characters
- **Tone**: Instructional and clear

#### Modal Error Messages (Rare)
- **Usage**: Only for critical failures requiring user action
- **Position**: Center screen overlay
- **Max Length**: 2 lines of text
- **Tone**: Apologetic but solution-focused

### Message Tone Guidelines

#### Good Examples
- "Playing offline" (neutral, informative)
- "Connected" (positive, brief)
- "Progress won't be saved" (honest, clear consequence)
- "Only letters allowed" (instructional, clear rule)

#### Bad Examples  
- "Network request failed" (too technical)
- "An unexpected error occurred" (vague, unhelpful)
- "localStorage quota exceeded" (technical jargon)
- "ENS resolution timeout" (Web3 jargon)

### Accessibility Considerations

#### Screen Reader Announcements
```typescript
// Announce important state changes
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

// Usage
announceToScreenReader('Game completed. Starting new game.');
```

#### High Contrast Mode Support
```css
/* Ensure error states visible in high contrast */
@media (prefers-contrast: high) {
  .error-message {
    border: 2px solid;
    background: transparent;
  }
  
  .toast-error {
    outline: 3px solid;
  }
}
```

## Error Recovery Patterns

### Automatic Recovery
1. **Retry with Exponential Backoff**: Network requests
2. **Fallback Data Sources**: RPC → Backup RPC → Cached data
3. **Graceful Degradation**: Full features → Reduced features → Core functionality
4. **Silent Correction**: Fix user input errors without notification when possible

### User-Assisted Recovery
1. **Clear Action Items**: "Try again" buttons with specific actions
2. **Alternative Paths**: Multiple ways to accomplish the same goal
3. **Progressive Enhancement**: Basic functionality first, enhanced features as available
4. **Persistent State**: Maintain user progress through recovery attempts

### Error Prevention
1. **Input Validation**: Prevent errors at entry point
2. **Preflight Checks**: Validate conditions before attempting operations
3. **Circuit Breakers**: Stop attempting failed operations after threshold
4. **Health Monitoring**: Proactive detection of degrading conditions

## Implementation Checklist

### Development Phase
- [ ] Error boundaries implemented for each major component
- [ ] All external API calls wrapped in try-catch with fallback logic
- [ ] Input validation implemented with user-friendly messages
- [ ] Logging service configured for error tracking and debugging

### Testing Phase  
- [ ] Error scenarios included in automated test suite
- [ ] Manual testing of all error conditions documented
- [ ] Cross-browser error handling verified
- [ ] Accessibility testing of error states completed

### Production Phase
- [ ] Error monitoring service integrated (Sentry, LogRocket, etc.)
- [ ] Performance monitoring alerts configured
- [ ] User feedback mechanism for reporting issues
- [ ] Rollback procedures documented for critical failures

This comprehensive error handling guide ensures users have a smooth experience even when things go wrong, while providing developers with clear implementation guidance and debugging information.