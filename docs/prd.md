# ENS-Wordle Product Requirements Document (PRD)

## Goals and Background Context

### Goals
Based on your Project Brief, here are the key desired outcomes:

- Deliver an engaging Web3 gaming experience that combines familiar Wordle mechanics with ENS domain knowledge
- Create a mobile-optimized game interface that Web3 enthusiasts can enjoy casually on phones/tablets  
- Successfully integrate ENS avatar fetching using wagmi/viem to provide visual clues for gameplay
- Build a simple, immediately playable game that requires no user accounts or wallet connections
- Establish a foundation for exploring Web3 identity systems through gamification
- Provide an educational tool that helps users learn about notable ENS domain holders in an entertaining format

### Background Context

ENS-Wordle addresses the need for more accessible and entertaining ways to engage with Web3 identity systems. While ENS (Ethereum Name Service) has become a cornerstone of Web3 identity, there are limited fun, educational tools that help users explore and learn about the ecosystem of notable ENS holders.

By adapting the wildly popular Wordle game format, this project creates a bridge between mainstream gaming mechanics and Web3 concepts. The use of avatar images as visual clues transforms the traditional word-guessing challenge into a Web3 identity recognition game, making ENS exploration both educational and entertaining for the community.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| TBD | 1.0 | Initial PRD creation | John (PM) |

## Requirements

### Functional Requirements

**FR1:** The game shall display a random ENS domain's avatar image as a visual clue at the start of each game session.

**FR2:** The game shall provide a 6-row input grid where players can enter their guesses for the ENS name (excluding the .eth suffix).

**FR3:** The game shall validate each guess against the target ENS name and provide visual feedback using the traditional Wordle color scheme (green for correct letter and position, yellow for correct letter but wrong position, gray for letters not in the name).

**FR4:** The game shall randomly select ENS names from a curated hardcoded list for each new game session.

**FR5:** The game shall fetch ENS avatar images dynamically using wagmi/viem integration.

**FR6:** The game shall display a placeholder image when an ENS name has no associated avatar.

**FR7:** The game shall persist game state (current guesses, game progress) in local browser storage.

**FR8:** The game shall end after 6 incorrect guesses or when the correct ENS name is guessed.

**FR9:** The game shall display win/loss state with appropriate feedback and the correct answer revealed.

**FR10:** The game shall allow players to start a new game session after completing the current game.

### Non-Functional Requirements

**NFR1:** The game interface shall be mobile-first and responsive, optimized for phone and tablet usage.

**NFR2:** The game shall load and be playable without requiring user accounts, wallet connections, or authentication.

**NFR3:** The game shall maintain playable performance on mobile devices with standard web browsers.

**NFR4:** The avatar images shall load within 3 seconds or display the placeholder fallback.

**NFR5:** The game state shall persist across browser sessions using local storage.

**NFR6:** The application shall function as a client-side only solution without backend dependencies for core gameplay.

## User Interface Design Goals

### Overall UX Vision

Create an intuitive, engaging mobile gaming experience that feels familiar to Wordle players while seamlessly integrating Web3 visual elements. The interface should prioritize immediate comprehension and smooth gameplay flow, allowing Web3 enthusiasts to focus on the ENS guessing challenge rather than learning complex UI patterns. The design should feel polished yet lightweight, encouraging repeat play sessions.

### Key Interaction Paradigms

- **Touch-First Input**: Large, finger-friendly letter tiles and input areas optimized for mobile touch interaction
- **Visual Feedback Hierarchy**: Clear, immediate color-coded feedback (green/yellow/gray) following established Wordle conventions
- **Progressive Disclosure**: Avatar clue prominently displayed, with game board and input becoming the focus after the initial visual impression
- **Gesture-Based Navigation**: Swipe or tap interactions for starting new games and navigating between game states

### Core Screens and Views

From a product perspective, the essential screens to deliver the PRD goals:

- **Game Board Screen**: Primary gameplay interface with avatar display area, 6-row guess grid, and on-screen keyboard
- **Game Complete Screen**: Win/loss state display with correct answer reveal and new game option
- **Loading State**: Brief transition screen while fetching avatar data
- **Error State**: Fallback interface when avatar loading fails or network issues occur

### Accessibility: WCAG AA

Given the Web3 target audience and mobile-first approach, implementing WCAG AA standards ensures broader accessibility while maintaining the visual gaming experience. This includes proper color contrast ratios, keyboard navigation support, and screen reader compatibility for essential game functions.

### Branding

Clean, modern Web3 aesthetic that complements ENS avatar imagery without competing for visual attention. The interface should enhance the avatar clues rather than distract from them, using subtle gradients or solid colors that work well with diverse avatar art styles. Consider incorporating subtle Ethereum/ENS visual cues (like .eth domain highlighting) without overwhelming the core Wordle-style gameplay.

### Target Device and Platforms: Web Responsive

Web Responsive design with mobile-first optimization, supporting all major mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile) and scaling appropriately for tablet and desktop viewing. Progressive Web App capabilities for enhanced mobile experience including offline gameplay with cached assets.

## Technical Assumptions

### Repository Structure: Monorepo

Single repository containing the complete ENS-Wordle application. This aligns with the project's simplicity goals and client-side-only architecture, avoiding the complexity of coordinating multiple repositories for what is essentially a single web application.

### Service Architecture

**Monolith Architecture**: Single-page web application with client-side only implementation. No backend services required for core functionality. The application will be a static React/TypeScript build that can be served from any static hosting platform (Vercel, Netlify, GitHub Pages). ENS data fetching happens client-side using wagmi/viem directly to Ethereum nodes.

### Testing Requirements

**Unit + Integration Testing**: Given this is identified as a "learning project" for Web3 development, implementing a solid testing foundation is critical. Unit tests for game logic components, integration tests for ENS data fetching, and component testing for React UI elements. Manual testing convenience methods for testing with different ENS names and avatar scenarios during development.

### Additional Technical Assumptions and Requests

**Frontend Framework**: Vite + React + TypeScript as specified in the project brief - this provides fast development experience and strong typing for Web3 integrations.

**Web3 Integration**: wagmi/viem for ENS interactions - these are modern, well-maintained libraries that provide excellent TypeScript support and React hooks for ENS operations.

**State Management**: React Context API or Zustand for game state management, avoiding Redux complexity for a simple game. Local storage integration for persistence.

**Styling Approach**: CSS Modules or Styled Components for component-scoped styling, enabling easy responsive design implementation without global CSS conflicts.

**Build and Deployment**: Static site generation with Vite build, deployable to any CDN or static hosting service. No server-side rendering requirements.

**Development Environment**: Node.js 18+ for modern JavaScript features and optimal Vite performance.

**Browser Support**: Modern browsers with ES2020+ support, focusing on mobile browsers (iOS Safari 14+, Chrome Mobile 90+).

**Performance Requirements**: Code splitting for wagmi/viem libraries to optimize initial load time, lazy loading for non-critical components.

**Error Handling**: Graceful fallbacks for ENS lookup failures, network issues, and missing avatar scenarios.

## Epic List

**Epic 1: Foundation & Core Game Infrastructure**
Establish project setup, basic React application structure, and implement core Wordle game mechanics with local storage persistence.

**Epic 2: ENS Integration & Avatar Display**
Integrate wagmi/viem for ENS data fetching, implement avatar loading with fallback handling, and create the curated ENS name management system.

**Epic 3: Mobile-First UI & Game Polish**
Implement responsive design, optimize touch interactions, add game completion states, and enhance the overall user experience with animations and feedback.

## Epic 1: Foundation & Core Game Infrastructure

**Epic Goal:** Establish a fully functional, deployable Wordle-style game with React/TypeScript foundation, core game mechanics, local storage persistence, and basic UI. This epic delivers an immediately testable game that validates core mechanics and provides the foundation for ENS integration.

### Story 1.1: Project Setup and Development Environment

As a developer,
I want a properly configured React/TypeScript project with Vite build system,
so that I have a solid foundation for building the ENS-Wordle game with fast development cycles.

#### Acceptance Criteria
1. Vite + React + TypeScript project is initialized with proper folder structure
2. Development server runs successfully with hot reload functionality
3. TypeScript configuration supports modern ES features and strict type checking
4. ESLint and Prettier are configured for code quality and consistency
5. Basic package.json scripts are available for dev, build, and preview commands
6. Git repository is initialized with appropriate .gitignore for Node.js/React projects
7. README.md contains basic project setup and development instructions

### Story 1.2: Core Game State Management

As a player,
I want the game to track my current guesses and game progress,
so that I can see my progress and the game can determine win/loss conditions.

#### Acceptance Criteria
1. Game state includes: current word, all guesses made, current attempt number, game status (playing/won/lost)
2. React Context API or Zustand manages game state across components
3. Game state properly initializes for new games
4. Game state updates correctly when guesses are made
5. Win condition is detected when correct word is guessed
6. Loss condition is detected after 6 incorrect guesses
7. Game state includes letter feedback for each guess (correct/wrong position/not in word)

### Story 1.3: Game Board UI and Input System

As a player,
I want a visual game board where I can enter my guesses and see feedback,
so that I can play the word-guessing game effectively.

#### Acceptance Criteria
1. 6-row grid displays properly with each row showing 5 letter positions (for ENS names without .eth)
2. Current active row is visually indicated for user clarity
3. Letters can be typed and appear in the current guess row
4. Backspace functionality removes the last entered letter
5. Enter/submit functionality processes the current guess when row is complete
6. Visual feedback shows letter states: correct position (green), wrong position (yellow), not in word (gray)
7. Game board prevents input when game is complete (won or lost)
8. Basic responsive layout works on desktop browsers

### Story 1.4: Local Storage Game Persistence

As a player,
I want my game progress to be saved automatically,
so that I can continue my current game if I close and reopen the browser.

#### Acceptance Criteria
1. Game state is automatically saved to local storage after each guess
2. Game state is restored from local storage when the application loads
3. New game functionality clears saved state and starts fresh
4. Local storage gracefully handles missing or corrupted data
5. Game works properly even when local storage is unavailable (in-memory fallback)
6. Saved state includes all game progress: guesses, current attempt, game status
7. Local storage data is properly typed and validated before use

### Story 1.5: Basic Word Validation and Feedback Logic

As a player,
I want the game to check my guesses against the target word and show feedback,
so that I can understand which letters are correct and adjust my strategy.

#### Acceptance Criteria
1. Game validates guess length matches target word length
2. Letter matching algorithm correctly identifies exact matches (correct position)
3. Letter matching algorithm correctly identifies partial matches (wrong position)
4. Letter matching algorithm handles duplicate letters correctly
5. Feedback is applied to the game board UI with appropriate colors
6. Invalid guesses (wrong length) are rejected with user feedback
7. Game uses a hardcoded test word initially for development validation
8. Guess submission updates game state and triggers win/loss check

## Epic 2: ENS Integration & Avatar Display

**Epic Goal:** Transform the basic Wordle game into ENS-Wordle by integrating wagmi/viem for ENS data fetching, implementing avatar display functionality, and creating a curated ENS name system. This epic delivers the unique Web3 value proposition that differentiates the game from standard Wordle.

### Story 2.1: wagmi/viem Integration Setup

As a developer,
I want wagmi and viem properly configured in the React application,
so that I can fetch ENS data and avatars from the Ethereum network.

#### Acceptance Criteria
1. wagmi and viem packages are installed and configured with TypeScript support
2. WagmiConfig provider wraps the React application with appropriate Ethereum mainnet configuration
3. Public Ethereum RPC endpoints are configured for ENS data access
4. Basic ENS resolution functionality is tested and working
5. Error handling is implemented for network connectivity issues
6. Configuration supports both development and production environments
7. No wallet connection requirements - read-only ENS data access only

### Story 2.2: ENS Avatar Fetching Service

As a player,
I want to see the avatar image associated with the ENS name I'm trying to guess,
so that I have a visual clue to help identify the correct ENS domain.

#### Acceptance Criteria
1. Service function fetches avatar image URL for a given ENS name using wagmi/viem
2. Avatar fetching handles both standard avatar records and NFT-based avatars
3. Service returns appropriate image URL or null if no avatar exists
4. Avatar fetching includes reasonable timeout (3 seconds) to prevent hanging
5. Service gracefully handles ENS resolution failures and network errors
6. Avatar URLs are validated to ensure they point to actual image resources
7. Service supports common image formats (PNG, JPG, GIF, SVG)

### Story 2.3: Avatar Display Component with Fallback

As a player,
I want to see either the ENS avatar or a placeholder image at the start of each game,
so that I have a visual clue regardless of whether the ENS name has an avatar.

#### Acceptance Criteria
1. Avatar component displays ENS avatar image when available
2. Placeholder image is shown when ENS name has no avatar
3. Loading state is displayed while avatar is being fetched
4. Avatar images are properly sized and responsive for mobile devices
5. Image loading errors fall back gracefully to placeholder
6. Avatar display area is prominently positioned above the game board
7. Component handles various aspect ratios and image sizes appropriately
8. Alt text is provided for accessibility describing the avatar or placeholder

### Story 2.4: Curated ENS Name Management System

As a game administrator,
I want a system to manage the list of ENS names used in the game,
so that players get interesting and recognizable ENS domains to guess.

#### Acceptance Criteria
1. Hardcoded array of curated ENS names is maintained in a dedicated file/module
2. ENS name list includes well-known Web3 personalities and projects
3. Names are validated to ensure they exist and resolve properly
4. List includes mix of difficulty levels (short/long names, common/obscure)
5. System can randomly select an ENS name for each new game
6. Selected names exclude the .eth suffix for gameplay (players guess only the 2LD)
7. Name list is easily maintainable and expandable for future updates
8. Comments or metadata can be associated with each name for context

### Story 2.5: Game Integration with ENS Data

As a player,
I want to play the guessing game using real ENS names with their avatars,
so that I can experience the complete ENS-Wordle gameplay.

#### Acceptance Criteria
1. New game initializes by selecting a random ENS name from the curated list
2. Selected ENS name's avatar is fetched and displayed at game start
3. Game board adapts to the length of the selected ENS name (excluding .eth)
4. Guess validation works correctly with ENS names (letter matching logic)
5. Game completion reveals the full ENS name including .eth suffix
6. Avatar loading errors don't prevent game from being playable
7. Game state persistence includes the current ENS name and avatar URL
8. Players can start multiple games with different ENS names and avatars

## Epic 3: Mobile-First UI & Game Polish

**Epic Goal:** Transform the functional ENS-Wordle game into a polished, mobile-optimized experience with responsive design, touch interactions, animations, and production-ready user experience. This epic ensures the final product meets the mobile-first goals and provides a compelling user experience.

### Story 3.1: Mobile-First Responsive Design Implementation

As a mobile player,
I want the game interface to be optimized for my phone screen,
so that I can comfortably play ENS-Wordle on mobile devices.

#### Acceptance Criteria
1. Game board and avatar display are properly sized for mobile screens (320px+ width)
2. Touch targets (letters, buttons) are minimum 44px for comfortable finger interaction
3. Typography scales appropriately across mobile, tablet, and desktop breakpoints
4. Avatar image area is proportionally sized and centered on mobile layouts
5. Game board maintains readability without horizontal scrolling on mobile
6. CSS uses mobile-first media queries with progressive enhancement
7. Layout adapts gracefully to both portrait and landscape orientations
8. All interactive elements are easily reachable with thumb navigation

### Story 3.2: Touch-Optimized Input System

As a mobile player,
I want intuitive touch interactions for entering my guesses,
so that I can efficiently input letters and submit guesses on my mobile device.

#### Acceptance Criteria
1. On-screen keyboard displays with large, touch-friendly letter buttons
2. Letter buttons provide visual feedback (highlight/press states) when touched
3. Backspace and Enter buttons are clearly labeled and appropriately sized
4. Touch interactions feel responsive without delays or missed touches
5. Haptic feedback (where supported) enhances button press experience
6. Keyboard layout follows standard QWERTY arrangement for familiarity
7. Current guess row highlights to show active input location
8. Touch interactions work consistently across iOS Safari and Chrome Mobile

### Story 3.3: Game Animations and Visual Feedback

As a player,
I want smooth animations and clear visual feedback during gameplay,
so that the game feels polished and engaging throughout my experience.

#### Acceptance Criteria
1. Letter reveals animate with timing similar to original Wordle (sequential reveal)
2. Color transitions for correct/wrong/partial matches are smooth and clear
3. Row completion includes satisfying animation before feedback display
4. Avatar loading includes smooth fade-in animation when image loads
5. Game completion (win/loss) includes celebratory or consoling animation
6. Transition animations don't delay gameplay or feel sluggish
7. Animations are optimized for mobile performance without frame drops
8. Animation timing follows established UI patterns (200-300ms transitions)

### Story 3.4: Game Completion States and New Game Flow

As a player,
I want clear feedback when I win or lose, and easy access to start a new game,
so that I can understand my results and continue playing seamlessly.

#### Acceptance Criteria
1. Win state displays congratulatory message with guess count and time taken
2. Loss state reveals the correct ENS name with encouraging message
3. Game completion screen shows the full ENS name including .eth suffix
4. Avatar remains visible during completion state for context
5. "New Game" button is prominently displayed and easily accessible
6. New game initialization includes smooth transition to fresh game state
7. Completion statistics could be shown (games played, win rate) if locally tracked
8. Game completion prevents further input while maintaining visual clarity

### Story 3.5: Progressive Web App Features and Performance Optimization

As a mobile player,
I want the game to load quickly and work reliably on my mobile device,
so that I can access ENS-Wordle conveniently like a native app.

#### Acceptance Criteria
1. Progressive Web App manifest enables "Add to Home Screen" functionality
2. Service worker provides offline gameplay capability after initial load
3. Critical CSS and JavaScript load quickly on mobile networks
4. Images (avatars, placeholders) are optimized for mobile bandwidth
5. App launches quickly from home screen icon with splash screen
6. Core game functionality works offline using cached ENS data
7. Application feels responsive on mid-range mobile devices (60fps interactions)
8. Bundle size is optimized with appropriate code splitting for wagmi/viem libraries

### Story 3.6: Error Handling and Edge Case Management

As a player,
I want the game to handle errors gracefully and continue working even when things go wrong,
so that I can always complete my current game regardless of network issues.

#### Acceptance Criteria
1. Network failures during avatar loading don't prevent game from starting
2. Invalid ENS names in curated list are detected and handled appropriately
3. Local storage failures fall back to in-memory game state gracefully
4. Slow avatar loading includes timeout with automatic fallback to placeholder
5. User-friendly error messages explain issues without technical jargon
6. Game state recovery handles corrupted data without crashing
7. Edge cases like extremely long ENS names are handled appropriately
8. Application provides retry mechanisms for recoverable errors