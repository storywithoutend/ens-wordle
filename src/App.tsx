/**
 * Main App component for ENS-Wordle
 */
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './config/wagmi';
import { GameBoard } from './components/game/GameBoard';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './styles/App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime in newer versions)
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <div className="app">
            <header className="app-header">
              <h1 className="app-title">ENS Wordle</h1>
              <p className="app-subtitle">
                Guess the ENS name using avatar clues
              </p>
            </header>

            <main className="app-main">
              <GameBoard />
            </main>

            <footer className="app-footer">
              <p>
                A Web3 twist on{' '}
                <a
                  href="https://www.nytimes.com/games/wordle/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wordle
                </a>
              </p>
            </footer>
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
