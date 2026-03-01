import { Component, type ErrorInfo, type ReactNode } from 'react';

// ─── Types ───
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ─── Error Boundary (class component required by React) ───

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Caught:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/home';
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return <ErrorFallbackUI onReload={this.handleReload} onGoHome={this.handleGoHome} />;
  }
}

// ─── Fallback UI Component ───

function ErrorFallbackUI({ onReload, onGoHome }: {
  onReload: () => void;
  onGoHome: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <span className="material-icons text-4xl text-red-500 dark:text-red-400">
            error_outline
          </span>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          An unexpected error occurred. Please try refreshing the page
          or return to the home screen.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onReload}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={onGoHome}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Go to Home
          </button>
        </div>

        {/* Branding */}
        <p className="mt-8 text-xs text-gray-400 dark:text-gray-600">
          Infinity Ventures · Secure Investment Platform
        </p>
      </div>
    </div>
  );
}
