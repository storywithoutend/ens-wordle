# ENS Wordle 🎯

A Web3 twist on the popular Wordle game where players guess ENS domain names using avatar images as visual clues.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 🎮 How to Play

1. **See the Avatar**: Each game shows an ENS domain's avatar image as your clue
2. **Guess the Name**: Enter your guess for the ENS name (without `.eth`)
3. **Get Feedback**: 
   - 🟩 Green: Letter is correct and in the right position
   - 🟨 Yellow: Letter is in the name but wrong position  
   - ⬜ Gray: Letter is not in the name
4. **Win or Learn**: You have 6 tries to guess the correct ENS name!

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm 9+

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run type-check   # TypeScript type checking
npm run lint         # Lint with ESLint
npm run format       # Format with Prettier
npm run quality:check # Run all quality checks
```

### Project Structure

```
src/
├── components/          # React components
│   ├── game/           # Game-specific components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # Business logic and external services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles and CSS
├── data/               # Static data (ENS names list)
└── test/               # Test configuration
```

## 🎯 Game Features

### Current (MVP)
- ✅ Core Wordle gameplay mechanics
- ✅ Dynamic grid adapting to ENS name length
- ✅ Touch-optimized virtual keyboard
- ✅ Local game state persistence
- ✅ Responsive mobile-first design
- ✅ Accessibility support (WCAG AA)
- ⏳ ENS avatar integration (coming soon)

### Planned
- 🔮 ENS avatar fetching via wagmi/viem
- 🔮 Curated list of notable ENS names
- 🔮 Game statistics and streaks
- 🔮 Share results functionality
- 🔮 PWA capabilities for offline play

## 🧪 Testing

The project includes comprehensive testing:
- **Unit Tests**: Game logic and utilities
- **Component Tests**: React component behavior
- **Integration Tests**: Cross-component interactions

```bash
npm test                 # Run all tests
npm run test:coverage    # Generate coverage report
```

## 📱 Responsive Design

ENS Wordle is mobile-first and works great on:
- 📱 Mobile phones (iOS Safari, Chrome Mobile)
- 📱 Tablets (iPad, Android tablets)  
- 💻 Desktop browsers (Chrome, Firefox, Safari, Edge)

## ♿ Accessibility

- Screen reader support with proper ARIA labels
- Keyboard navigation for all interactions
- High contrast mode support
- Color blind friendly design
- Touch targets meet WCAG guidelines (44px minimum)

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite  
- **Web3**: wagmi + viem (for ENS integration)
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules with CSS Custom Properties
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 🌐 Web3 Integration

ENS Wordle integrates with Ethereum Name Service (ENS) to:
- Fetch avatar images for visual clues
- Validate ENS name existence  
- Provide educational context about Web3 identity

*Note: No wallet connection required - the game only reads public ENS data.*

## 📖 Documentation

Full project documentation available in `/docs`:
- [Development Setup Guide](docs/development-setup.md)
- [Architecture Overview](docs/frontend-architecture.md)
- [Product Requirements](docs/prd.md)
- [UI/UX Specifications](docs/front-end-spec.md)

## 🤝 Contributing

1. Read the [Development Setup Guide](docs/development-setup.md)
2. Follow the established code style and testing patterns
3. Ensure all quality checks pass: `npm run quality:check`
4. Submit a pull request with clear description

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle/index.html) by Josh Wardle
- Built for the Ethereum Name Service (ENS) community
- Uses public ENS data to showcase Web3 identity systems

---

**Have fun guessing! 🎯**