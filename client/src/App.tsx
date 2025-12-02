import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import AppRouter from './Router';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">An Unexpected Error Occurred</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">We're sorry for the inconvenience. Please try reloading the page.</p>
            {this.state.error && (
              <details className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-left">
                <summary className="cursor-pointer mb-2">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  // Fix the useAuth hook usage - it should be called inside a component
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <SimpleErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="App min-h-screen bg-background text-foreground">
              <AppRouter />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#ffffff',
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 7000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SimpleErrorBoundary>
  );
}

export default App;