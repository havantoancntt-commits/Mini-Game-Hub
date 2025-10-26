import * as React from 'react';
import StyledButton from './StyledButton';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// FIX: Refactored to use a namespace import for React ('import * as React') and fully-qualified types
// (e.g., React.ReactNode, React.ErrorInfo) to resolve a TypeScript error where 'this.props' was not being found on the component instance.
// This ensures unambiguous type resolution.
class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-lg mx-auto bg-slate-800/60 backdrop-blur-md rounded-2xl border border-red-500/50 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Oops! Something Went Wrong</h2>
          <p className="text-slate-400 mb-6">
            An unexpected error occurred while loading the game. Please try reloading the page.
          </p>
          <StyledButton onClick={() => window.location.reload()}>
            Reload Page
          </StyledButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
