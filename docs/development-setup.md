# Development Environment Setup - ENS-Wordle

## Prerequisites

### Required Software
- **Node.js**: Version 18+ (LTS recommended)
- **npm**: Version 9+ (comes with Node.js)
- **Git**: Latest stable version
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Development Tools (Recommended)
- **VS Code**: With TypeScript and ES7+ React/Redux/React-Native snippets extensions
- **Chrome DevTools**: For debugging and performance analysis
- **React Developer Tools**: Browser extension for React debugging

## Project Structure

```
ens-wordle/
├── docs/                          # Project documentation
│   ├── brief.md                   # Project overview and goals  
│   ├── prd.md                     # Product requirements document
│   ├── front-end-spec.md          # UI/UX specifications
│   ├── frontend-architecture.md   # Technical architecture
│   ├── definition-of-done.md      # Quality standards
│   ├── ens-curation-guidelines.md # ENS name curation rules
│   └── development-setup.md       # This file
├── src/
│   ├── components/                # React components
│   │   ├── game/                  # Game-specific components
│   │   ├── ui/                    # Reusable UI components
│   │   └── layout/                # Layout components
│   ├── hooks/                     # Custom React hooks
│   ├── services/                  # Business logic and API calls
│   ├── data/                      # Static data and configurations
│   │   └── curated-ens-names.json # ENS name list
│   ├── utils/                     # Utility functions
│   ├── types/                     # TypeScript type definitions
│   ├── styles/                    # Global styles and themes
│   └── __tests__/                 # Test files
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── .eslintrc.json                 # ESLint configuration
└── README.md                      # Project README
```

## Initial Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd ens-wordle

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Required Environment Variables

Create `.env.local` with:

```bash
# RPC Endpoints for ENS resolution
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
VITE_ETHEREUM_RPC_BACKUP=https://mainnet.infura.io/v3/your-key

# Development settings
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG_LOGS=true

# Optional: Analytics (production only)
VITE_ANALYTICS_ID=your-analytics-id
```

### 3. Start Development Server

```bash
# Start development server
npm run dev

# Server will be available at http://localhost:5173
```

## Development Scripts

### Core Commands
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally  
npm run preview

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

### Quality Assurance Commands
```bash
# Full quality check (before commits)
npm run quality:check

# Fix auto-fixable issues
npm run quality:fix

# Test coverage report
npm run test:coverage

# Build and analyze bundle size
npm run analyze
```

## Development Workflow

### 1. Feature Development Process

```bash
# 1. Create feature branch
git checkout -b feature/story-1-2-game-state

# 2. Develop with TDD approach
npm run test:watch  # Keep running in separate terminal

# 3. Regular quality checks
npm run quality:check

# 4. Commit with conventional commits
git add .
git commit -m "feat: implement game state management with local storage"

# 5. Push and create PR
git push origin feature/story-1-2-game-state
```

### 2. Code Quality Standards

#### TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **No Any Types**: Explicit typing required
- **Import Organization**: Absolute imports from `src/`

#### Component Standards
```typescript
// Component template
import React from 'react';
import { ComponentProps } from './ComponentName.types';
import styles from './ComponentName.module.css';

export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 
}) => {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

#### Testing Standards
```typescript
// Test template
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const mockHandler = jest.fn();
    render(<ComponentName onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

### 3. Git Workflow

#### Branch Naming Convention
- **Feature**: `feature/story-1-2-brief-description`
- **Bug Fix**: `fix/issue-description`
- **Hotfix**: `hotfix/critical-issue`
- **Release**: `release/v1.0.0`

#### Commit Message Format
```
type(scope): description

feat(game): add letter feedback animation
fix(ens): handle avatar loading timeout
docs(readme): update setup instructions
test(utils): add word validation tests
```

## Environment Configurations

### Development Environment
- **Hot Reload**: Enabled for instant feedback
- **Debug Logging**: Verbose console output
- **Source Maps**: Full source maps for debugging
- **Mock Data**: Use test ENS names when offline

### Staging Environment
- **Production Build**: Optimized bundle
- **Real ENS Data**: Live Ethereum mainnet
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Web Vitals tracking

### Production Environment
- **Optimized Bundle**: Minified and compressed
- **CDN Assets**: Served from global CDN
- **Analytics**: User behavior tracking
- **PWA Features**: Service worker and caching

## Testing Strategy

### Unit Testing
- **Framework**: Vitest for fast execution
- **Coverage Target**: 80%+ for new code
- **Focus Areas**: Game logic, utility functions

### Component Testing
- **Framework**: React Testing Library
- **Approach**: User-centric testing
- **Coverage**: All user interactions and edge cases

### Integration Testing
- **ENS Integration**: Mock wagmi/viem responses
- **Local Storage**: Test persistence and recovery
- **Error Scenarios**: Network failures and timeouts

### Manual Testing Checklist
- [ ] Game functionality on Chrome Mobile (Android)
- [ ] Game functionality on Safari Mobile (iOS)
- [ ] Responsive design across breakpoints
- [ ] Avatar loading and fallback behavior
- [ ] Performance on mid-range mobile devices

## Common Development Issues

### ENS Integration Debugging
```typescript
// Debug ENS resolution issues
const debugENS = async (name: string) => {
  console.log(`Resolving: ${name}.eth`);
  const address = await publicClient.getEnsAddress({ name: `${name}.eth` });
  const avatar = await publicClient.getEnsAvatar({ name: `${name}.eth` });
  console.log({ address, avatar });
};
```

### Performance Debugging
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
# Use Chrome DevTools Memory tab during gameplay
```

### Common Fixes
- **Avatar Not Loading**: Check CORS and image URL validity
- **TypeScript Errors**: Ensure wagmi/viem types are properly imported
- **Build Failures**: Clear node_modules and reinstall dependencies
- **Test Failures**: Check for async/await issues in test setup

## IDE Configuration

### VS Code Settings (`.vscode/settings.json`)
```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Recommended Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets  
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- GitLens
- Thunder Client (for API testing)

This setup ensures consistent development experience and maintains code quality throughout the project lifecycle.