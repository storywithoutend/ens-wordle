# ENS-Wordle Frontend Architecture

## Architecture Overview

### System Context
ENS-Wordle is a single-page React application that combines traditional Wordle gameplay mechanics with Web3 ENS (Ethereum Name Service) integration. The architecture emphasizes mobile-first responsive design, client-side-only operation, and seamless Web3 data fetching.

### High-Level Architecture Pattern
**Client-Side Monolith**: Pure frontend application with no backend dependencies, leveraging public Ethereum RPC endpoints for ENS data retrieval.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Environment                   │
├─────────────────────────────────────────────────────────┤
│  React App (Vite + TypeScript)                         │
│  ├── Game Logic Layer                                   │
│  ├── ENS Integration Layer (wagmi/viem)                │
│  ├── State Management (React Context/Zustand)          │
│  ├── Local Storage Persistence                         │
│  └── UI Components (Mobile-First)                      │
├─────────────────────────────────────────────────────────┤
│  Public Ethereum RPC Endpoints                         │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Framework
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: CSS Modules or Styled Components for component-scoped styling

### Web3 Integration
- **ENS Integration**: wagmi v2 + viem for modern React hooks and TypeScript support
- **Network Access**: Public Ethereum mainnet RPC endpoints (Infura, Alchemy alternatives)
- **Data Fetching**: Read-only ENS operations (no wallet connection required)

### State Management
- **Game State**: React Context API or Zustand for lightweight state management
- **Persistence**: Browser localStorage with graceful fallbacks
- **ENS Data**: React Query (via wagmi) for caching and background refetching

### Development & Quality
- **Type Safety**: Strict TypeScript configuration
- **Code Quality**: ESLint + Prettier for consistent code style
- **Testing**: Vitest for unit tests, React Testing Library for component tests

## Application Architecture

### Component Hierarchy

```
App
├── GameProvider (Context)
│   ├── GameBoard
│   │   ├── AvatarDisplay
│   │   ├── GameGrid
│   │   │   └── LetterCell[]
│   │   └── VirtualKeyboard
│   │       └── KeyButton[]
│   ├── GameCompleteModal
│   └── ShareResultsModal
└── ErrorBoundary
```

### Layer Responsibilities

#### 1. Presentation Layer (UI Components)
- **GameBoard**: Main game interface orchestrating all child components
- **AvatarDisplay**: ENS avatar rendering with fallback handling
- **GameGrid**: Dynamic NxM grid adapting to ENS name length
- **LetterCell**: Individual cell with state-based styling (correct/wrong/absent)
- **VirtualKeyboard**: Touch-optimized on-screen keyboard
- **Modals**: Game completion and sharing interfaces

#### 2. Business Logic Layer
- **Game State Management**: Current game progress, guesses, win/loss states
- **Word Validation**: ENS name matching algorithm with duplicate letter handling
- **Game Flow Control**: Turn management, completion detection, new game initialization
- **Input Handling**: Letter entry, backspace, guess submission logic

#### 3. Data Access Layer
- **ENS Service**: Avatar fetching, name resolution, error handling
- **Local Storage Service**: Game state persistence and recovery
- **ENS Name Repository**: Curated list management and random selection

#### 4. Infrastructure Layer
- **Web3 Configuration**: wagmi client setup, RPC endpoint management
- **Error Handling**: Network failures, ENS resolution errors, graceful degradation
- **Performance**: Code splitting, lazy loading, caching strategies

## Data Flow Architecture

### State Management Pattern

```typescript
// Game State Shape
interface GameState {
  currentENSName: string;
  currentAvatarUrl?: string;
  guesses: Guess[];
  currentGuessIndex: number;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStates: Record<string, LetterState>;
}

interface Guess {
  word: string;
  feedback: LetterState[];
}

type LetterState = 'correct' | 'wrong-position' | 'absent' | 'unused';
```

### Data Flow Patterns

1. **Game Initialization**:
   ```
   Select Random ENS Name → Fetch Avatar → Initialize Game State → Render UI
   ```

2. **Guess Submission**:
   ```
   User Input → Validate Length → Process Letters → Update State → Animate Feedback
   ```

3. **ENS Integration**:
   ```
   ENS Name → wagmi Hook → Avatar URL → Image Loading → Fallback Handling
   ```

### State Persistence Strategy
- **Local Storage**: Automatic save after each guess
- **Session Recovery**: Restore game state on app reload
- **Data Validation**: Type checking and corruption handling
- **Privacy**: Client-side only, no external data collection

## Component Design Patterns

### 1. Compound Component Pattern
```typescript
// GameBoard acts as compound component
<GameBoard>
  <GameBoard.Avatar />
  <GameBoard.Grid />
  <GameBoard.Keyboard />
</GameBoard>
```

### 2. Custom Hook Pattern
```typescript
// Game logic encapsulated in reusable hooks
const useGameState = () => { ... };
const useENSAvatar = (ensName: string) => { ... };
const useLocalStorage = <T>(key: string, defaultValue: T) => { ... };
```

### 3. Render Props for Dynamic Content
```typescript
<GameGrid>
  {({ cellState, position }) => (
    <LetterCell state={cellState} position={position} />
  )}
</GameGrid>
```

## Performance Architecture

### Bundle Optimization
- **Code Splitting**: Dynamic imports for wagmi/viem libraries
- **Tree Shaking**: Import only necessary utilities
- **Bundle Analysis**: Regular size monitoring and optimization

### Runtime Performance
- **React Optimization**: useMemo, useCallback for expensive operations
- **DOM Efficiency**: Minimize re-renders during gameplay
- **Animation Performance**: CSS transforms and opacity changes only

### Mobile Optimization
- **Touch Response**: < 100ms interaction feedback
- **Battery Efficiency**: Optimized animation timing
- **Network Awareness**: Graceful handling of poor connectivity

### Caching Strategy
- **ENS Data**: In-memory caching via React Query
- **Static Assets**: Service Worker for offline capability
- **Game State**: Persistent localStorage cache

## Security Architecture

### Client-Side Security
- **Input Validation**: Sanitize all user input, validate ENS name format
- **XSS Prevention**: Proper escaping of dynamic content
- **Content Security Policy**: Restrictive CSP headers
- **Dependency Security**: Regular audit of npm packages

### Web3 Security
- **Read-Only Operations**: No private key handling or transaction signing
- **RPC Endpoint Security**: Use reputable public endpoints
- **Data Validation**: Verify ENS resolution responses
- **Rate Limiting**: Respect RPC endpoint limits

### Privacy Considerations
- **No Tracking**: Client-side only operation
- **Local Storage**: Game data never leaves user's device
- **Public Data Only**: ENS names and avatars are public information

## Responsive Design Architecture

### Breakpoint Strategy
```scss
// Mobile-first approach
$mobile: 320px;
$tablet: 768px;  
$desktop: 1024px;
$wide: 1440px;
```

### Layout Patterns
- **Mobile**: Single column, full-width grid
- **Tablet**: Centered layout with max-width constraints
- **Desktop**: Larger virtual keyboard, more breathing room

### Dynamic Grid Sizing
- **Variable Width**: Grid adapts to ENS name length (3-12 characters)
- **Responsive Scaling**: Cell size adjusts per screen size
- **Touch Targets**: Minimum 44px for mobile interaction

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript (basic form)
- **Enhanced Experience**: Full interactive gameplay with JS
- **Offline Capability**: Service Worker for cached gameplay

## Error Handling Architecture

### Error Boundaries
```typescript
class GameErrorBoundary extends React.Component {
  // Graceful fallback for React errors
}
```

### Network Error Handling
- **Avatar Loading**: Timeout → Placeholder image
- **ENS Resolution**: Retry logic → Fallback to cached data
- **RPC Failures**: Circuit breaker pattern

### User Experience Errors
- **Invalid Input**: Visual feedback, prevent submission
- **Game State Corruption**: Reset to fresh game
- **Performance Issues**: Graceful degradation

## Testing Architecture

### Testing Strategy
- **Unit Tests**: Game logic, utility functions (Vitest)
- **Component Tests**: UI components, user interactions (RTL)
- **Integration Tests**: ENS integration, state persistence
- **E2E Tests**: Complete user flows (Playwright)

### Test Structure
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── __integration__/
└── __e2e__/
```

### Testing Utilities
- **Mock ENS Data**: Predictable test scenarios
- **Local Storage Mocking**: Isolated test environment
- **Network Mocking**: Simulate various connection states

## Deployment Architecture

### Build Process
- **Vite Build**: Optimized production bundle
- **Asset Optimization**: Image compression, CSS minification
- **Bundle Analysis**: Size monitoring and splitting

### Hosting Strategy
- **Static Hosting**: Vercel, Netlify, or GitHub Pages
- **CDN**: Global asset distribution
- **Caching**: Aggressive caching for static assets

### PWA Configuration
- **Manifest**: App-like installation experience  
- **Service Worker**: Offline gameplay capability
- **Caching Strategy**: Critical resources cached locally

### Environment Configuration
```typescript
// Environment-specific settings
interface Config {
  RPC_ENDPOINTS: string[];
  ENS_CACHE_TTL: number;
  GAME_SETTINGS: {
    maxGuesses: number;
    curated_names: string[];
  };
}
```

## Monitoring and Analytics

### Error Monitoring
- **Client-Side Errors**: Sentry or similar service
- **Performance Monitoring**: Web Vitals tracking
- **User Experience**: Error rate monitoring

### Game Analytics (Optional)
- **Privacy-First**: No personal data collection
- **Aggregate Metrics**: Game completion rates, average guesses
- **Performance Metrics**: Load times, interaction responsiveness

## Future Architecture Considerations

### Scalability Preparation
- **Backend Integration**: API layer for advanced features
- **User Accounts**: OAuth integration for progress tracking
- **Multiplayer**: WebSocket architecture for real-time play

### Feature Extensions
- **Daily Puzzle Mode**: Server-side puzzle generation
- **Statistics**: Historical game data storage
- **Social Features**: Share and compare results

### Technical Debt Prevention
- **Regular Refactoring**: Component optimization cycles
- **Dependency Updates**: Security and performance patches
- **Architecture Review**: Quarterly architecture assessment

## Implementation Roadmap

### Phase 1: Core Foundation (Weeks 1-2)
1. Project setup with Vite + React + TypeScript
2. Basic game grid component with dynamic sizing
3. Virtual keyboard implementation
4. Game state management setup

### Phase 2: ENS Integration (Weeks 2-3)
1. wagmi/viem configuration
2. Avatar fetching service
3. Curated ENS name management
4. Error handling for Web3 operations

### Phase 3: Polish & Optimization (Weeks 3-4)
1. Mobile-responsive design implementation
2. Animations and micro-interactions
3. PWA configuration
4. Performance optimization

### Phase 4: Testing & Deployment (Week 4)
1. Comprehensive testing suite
2. Cross-browser compatibility
3. Deployment pipeline setup
4. Production monitoring