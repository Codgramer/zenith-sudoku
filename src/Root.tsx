import * as React from "react";

import {createRootRoute, createRoute, createRouter, RouterProvider} from "@tanstack/react-router";

import Game from "./pages/Game";
import SelectGame from "./pages/SelectGame";
import {OfflineIndicator} from "./components/OfflineIndicator";

const rootRoute = createRootRoute();

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Game,
});

const selectGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/select-game",
  component: SelectGame,
});

rootRoute.addChildren([gameRoute, selectGameRoute]);

const router = createRouter({
  routeTree: rootRoute,
});

// Error Boundary Component: This component is a safety net for your app. If any part of the app crashes, it will catch the error and display a user-friendly message instead of a blank screen. It also provides options to refresh the page or report the bug on GitHub.
const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Error caught by boundary:", error.error);
      setError(error.error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      setError(new Error(event.reason));
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="max-w-md w-full bg-surface dark:bg-surface-dark rounded-lg p-6 text-center shadow-lg">
          <div className="text-danger text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-4">Something went wrong</h1>
          <p className="text-text-secondary dark:text-gray-400 mb-6">
            We're sorry, but something unexpected happened. Please report the bug on GitHub and describe what you did to
            have it happen.
          </p>
          <div className="space-y-3">
            <a
              href={`https://github.com/YourNewUsername/zenith-sudoku/issues/new?title=Bug%20report%20from%20Zenith%20Sudoku&body=error%20details%3A%0A%0A${error?.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary-accent text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
            >
              Report Bug on GitHub
            </a>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
          {error && (
            <div className="mt-4 text-left">
              <h2 className="font-bold text-text-primary dark:text-white">Error Details</h2>
              <pre className="mt-2 text-xs bg-surface-secondary dark:bg-gray-800 p-2 rounded overflow-auto text-text-primary dark:text-gray-100">
                {error.toString()}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;