/**
 * Error boundary component for handling React errors gracefully
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    // Clear any corrupted local storage
    try {
      localStorage.removeItem('ens-wordle-game-state');
      localStorage.removeItem('ens-wordle-stats');
    } catch {
      // Ignore localStorage errors
    }

    this.setState({ hasError: false });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>Something went wrong</h1>
            <p>
              We're sorry, but something unexpected happened. You can try
              reloading the page or starting fresh.
            </p>

            <div className="error-actions">
              <button onClick={this.handleReload} className="btn btn-primary">
                Reload Page
              </button>
              <button onClick={this.handleReset} className="btn btn-secondary">
                Start Fresh
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
