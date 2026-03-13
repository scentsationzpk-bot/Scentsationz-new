import * as React from 'react';
import { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
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
      let errorMessage = "An unexpected error occurred.";
      
      try {
        // Try to parse Firestore error JSON if it exists
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = `Database Error: ${parsed.error}`;
          }
        }
      } catch (e) {
        // Not a JSON error, use raw message if it's user-friendly
        if (this.state.error?.message && !this.state.error.message.includes('{')) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
          <div className="max-w-md w-full bg-white border-4 border-slate-900 p-8 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] text-center">
            <div className="w-20 h-20 bg-red-50 rounded-2xl border-4 border-slate-900 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">System Alert</h1>
            <p className="text-slate-600 font-bold mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest text-sm"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
