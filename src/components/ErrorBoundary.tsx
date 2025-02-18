'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
          <div className="max-w-xl w-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-accent mb-4">Something went wrong</h1>
              <p className="text-gray-300 mb-8">
                We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
              {this.state.error && (
                <div className="bg-white/10 rounded-lg p-4 mb-8">
                  <p className="text-red-400 font-mono text-sm">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
