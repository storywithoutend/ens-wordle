# Refined Acceptance Criteria - ENS-Wordle

## Story 1.4: Local Storage Game Persistence - REFINED

### Original Vague Criteria (Now Detailed)

#### AC4: Local storage gracefully handles missing or corrupted data
**REFINED SPECIFIC BEHAVIORS:**
- **Missing Data**: When localStorage is empty, initialize new game state without errors
- **Corrupted JSON**: If JSON.parse() fails, log warning and fall back to new game state
- **Invalid Schema**: If saved data missing required fields (currentENSName, guesses, etc.), discard and start fresh
- **Type Validation**: Validate data types match GameState interface before restoring
- **Partial Corruption**: If some fields valid but others corrupted, restore valid fields and reset invalid ones to defaults

#### AC5: Game works properly even when local storage is unavailable (in-memory fallback)
**REFINED SPECIFIC BEHAVIORS:**
- **Private Browsing**: Detect localStorage unavailable, continue with session-only state
- **Storage Quota Exceeded**: Catch quota exceeded errors, continue without persistence
- **Permission Denied**: Handle security errors gracefully with in-memory state
- **User Feedback**: Show discrete notification "Game progress won't be saved" when storage unavailable
- **Functional Parity**: All game features work identically whether persisted or in-memory

## Story 2.2: ENS Avatar Fetching Service - REFINED

### Original Vague Criteria (Now Detailed)

#### AC4: Avatar fetching includes reasonable timeout (3 seconds) to prevent hanging
**REFINED SPECIFIC BEHAVIORS:**
- **Timeout Implementation**: Promise.race() with 3-second timer
- **Timeout Response**: Return null when timeout exceeded
- **Loading State**: Show loading indicator for first 1 second, then "Loading..." text
- **Retry Logic**: Single retry attempt after timeout with 2-second timeout
- **Fallback Trigger**: Automatic fallback to placeholder after all retries exhausted
- **User Feedback**: No error message to user - graceful degradation only

#### AC5: Service gracefully handles ENS resolution failures and network errors
**REFINED SPECIFIC BEHAVIORS:**
- **Network Offline**: Detect navigator.onLine, return cached avatar or placeholder
- **RPC Endpoint Failure**: Try backup RPC endpoint automatically
- **Invalid ENS Name**: Return null for malformed names without throwing errors
- **DNS Resolution Errors**: Catch and handle NXDOMAIN responses
- **Rate Limiting**: Detect 429 responses, implement exponential backoff (max 3 attempts)
- **Logging**: Log errors to console in development, silent in production

## Story 2.4: Curated ENS Name Management System - REFINED

### Original Vague Criteria (Now Detailed)

#### AC3: Names are validated to ensure they exist and resolve properly
**REFINED SPECIFIC BEHAVIORS:**
- **Resolution Test**: Each name must resolve to valid Ethereum address
- **Avatar Verification**: Check avatar record exists (not required but logged)
- **Format Validation**: Only alphanumeric and hyphens, 3-12 characters
- **Mainnet Verification**: All validations performed against Ethereum mainnet
- **Batch Validation**: Validate entire list with progress reporting
- **Failure Handling**: Log failed names, exclude from game rotation

#### AC8: Comments or metadata can be associated with each name for context
**REFINED SPECIFIC BEHAVIORS:**
- **Data Structure**: JSON objects with name, difficulty, category, hasAvatar fields
- **Context Fields**: Optional description, source, addedDate, lastValidated
- **Maintenance Notes**: Internal notes field for curation team
- **Version Tracking**: Git history provides change tracking
- **Documentation**: README in data folder explains each field

## Story 3.2: Touch-Optimized Input System - REFINED

### Original Vague Criteria (Now Detailed)

#### AC5: Haptic feedback (where supported) enhances button press experience
**REFINED SPECIFIC BEHAVIORS:**
- **Support Detection**: Check for navigator.vibrate() availability
- **Feedback Pattern**: 10ms vibration on letter press, 30ms on guess submission
- **User Preference**: Respect system accessibility settings (reduced motion)
- **Fallback**: Visual press animation when haptic unavailable
- **Battery Consideration**: Disable haptics when battery < 20% (if available)

#### AC8: Touch interactions work consistently across iOS Safari and Chrome Mobile
**REFINED SPECIFIC BEHAVIORS:**
- **Touch Events**: Use touchstart/touchend, not click events for responsiveness
- **iOS Specific**: Handle iOS Safari's touch delay with touch-action CSS
- **Android Specific**: Prevent Chrome's long-press context menu on game elements
- **Keyboard Avoidance**: Virtual keyboard doesn't trigger mobile browser keyboard
- **Safe Areas**: Respect iOS safe areas and Android navigation gestures

## Story 3.6: Error Handling and Edge Case Management - REFINED

### Original Vague Criteria (Now Detailed)

#### AC5: User-friendly error messages explain issues without technical jargon
**REFINED SPECIFIC BEHAVIORS:**

**Network Issues:**
- Technical: "RPC endpoint timeout" → User: "Having trouble connecting. Using offline mode."
- Technical: "ENS resolution failed" → User: "Couldn't load game image. Playing with placeholder."
- Technical: "Avatar fetch 404" → User: Silent fallback to placeholder image

**Game State Issues:**
- Technical: "localStorage quota exceeded" → User: "Game progress won't be saved this session."
- Technical: "Invalid JSON in storage" → User: "Starting fresh game." (no explanation of technical cause)
- Technical: "Type validation failed" → User: Silent recovery with new game state

**User Input Issues:**
- Technical: "Invalid guess length" → User: "Guess must be X letters long" (where X is target length)
- Technical: "Non-alphabetic characters" → User: "Only letters allowed"

#### AC8: Application provides retry mechanisms for recoverable errors
**REFINED SPECIFIC BEHAVIORS:**
- **Avatar Loading**: Auto-retry once after 2-second delay, then fallback
- **ENS Resolution**: Try backup RPC endpoint, then cached data, then fallback
- **Network Requests**: Exponential backoff: 1s, 2s, 4s delays (max 3 attempts)
- **User-Triggered Retry**: "Try Again" button for failed avatar loads
- **Automatic Recovery**: Resume normal operation when network returns

## Implementation Guidelines

### Error Message Tone
- **Encouraging**: Focus on "let's try again" rather than "this failed"
- **Action-Oriented**: Tell user what will happen next, not what went wrong
- **Brief**: Maximum 6-8 words for mobile display
- **Consistent**: Same message for same error type across app

### Fallback Hierarchies
```
Avatar Loading: ENS Avatar → Cached Avatar → Placeholder → Default Icon
ENS Resolution: Primary RPC → Backup RPC → Cached Data → Hardcoded Fallback
Game State: localStorage → sessionStorage → in-memory → default state
```

### Testing Requirements
Each refined acceptance criteria must include:
- **Happy Path Test**: Normal operation
- **Error Condition Test**: Each specified error scenario  
- **Boundary Test**: Edge cases (empty data, maximum lengths, etc.)
- **Integration Test**: Error handling across component boundaries
- **User Experience Test**: Manual validation of user-facing behavior

These refined criteria provide the specific, testable details needed for development while maintaining focus on user experience quality.