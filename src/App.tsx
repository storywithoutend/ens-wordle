/**
 * Main App component for ENS-Wordle
 */
import { GameBoard } from './components/game/GameBoard';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './styles/App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">ENS Wordle</h1>
          <p className="app-subtitle">Guess the ENS name using avatar clues</p>
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
    </ErrorBoundary>
  );
}

export default App;