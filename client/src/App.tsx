import React, { Suspense } from 'react';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { MapView } from './components/MapView/MapView';
import { CandidatePanel } from './components/CandidatePanel/CandidatePanel';
import { SearchBar } from './components/SearchBar/SearchBar';
import { ActionBar } from './components/Shared/ActionBar';
import { ErrorBoundary } from './components/Shared/ErrorBoundary';
import { LoadingSpinner } from './components/Shared/LoadingSpinner';
import { useUIStore } from './store/uiStore';

const App: React.FC = () => {
  const { loading, error, setError } = useUIStore();

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
        {/* Global error banner */}
        {error && (
          <div className="flex items-center justify-between px-4 py-2 bg-red-600 text-white text-sm z-50 flex-shrink-0">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-200 hover:text-white"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Global loading overlay */}
        {loading && (
          <div className="fixed inset-0 z-[2000] bg-black/10 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <LoadingSpinner size="md" />
            </div>
          </div>
        )}

        {/* Main layout: three-column (left panel | map | right panel) */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* LEFT: Control Panel */}
          <ErrorBoundary>
            <ControlPanel />
          </ErrorBoundary>

          {/* CENTER: Map */}
          <main className="flex-1 relative overflow-hidden">
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <MapView />
              </Suspense>
            </ErrorBoundary>

            {/* Search bar overlaid on the map */}
            <ErrorBoundary>
              <SearchBar />
            </ErrorBoundary>
          </main>

          {/* RIGHT: Candidate Panel */}
          <ErrorBoundary>
            <CandidatePanel />
          </ErrorBoundary>
        </div>

        {/* BOTTOM: Action Bar (Generate Report, Share) */}
        <ErrorBoundary>
          <ActionBar />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default App;
