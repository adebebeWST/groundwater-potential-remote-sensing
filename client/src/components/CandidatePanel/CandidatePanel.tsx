import React, { useEffect, useState } from 'react';
import { PrioritySection } from './PrioritySection';
import { mapService } from '../../services/mapService';
import { useUIStore } from '../../store/uiStore';
import type { CandidateCountByPriority, Priority } from '../../types';
import { LoadingSpinner } from '../Shared/LoadingSpinner';

export const CandidatePanel: React.FC = () => {
  const { rightPanelOpen, setRightPanelOpen } = useUIStore();
  const [data, setData] = useState<CandidateCountByPriority | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await mapService.getCandidateAreas();
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError('Failed to load candidate areas.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/* Collapse toggle */}
      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-[1001] bg-white border border-gray-200
                   rounded-l-md px-1 py-3 shadow-md text-gray-500 hover:text-primary-600 transition-colors`}
        style={{ right: rightPanelOpen ? '288px' : '0px' }}
        aria-label={rightPanelOpen ? 'Collapse candidate panel' : 'Expand candidate panel'}
        title={rightPanelOpen ? 'Collapse' : 'Expand'}
      >
        {rightPanelOpen ? '›' : '‹'}
      </button>

      {rightPanelOpen && (
        <aside className="w-72 h-full bg-white border-l border-gray-200 shadow-md flex flex-col overflow-hidden z-[1000]">
          {/* Header */}
          <div className="px-4 py-3 bg-primary-700 text-white flex-shrink-0">
            <h2 className="text-sm font-bold tracking-tight">Candidate Areas</h2>
            <p className="text-xs text-primary-200 mt-0.5">
              Click an area to zoom the map
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            )}
            {error && (
              <p className="px-4 py-4 text-sm text-red-600">{error}</p>
            )}
            {!loading && !error && data && (
              <>
                {([1, 2, 3] as Priority[]).map(p => (
                  <PrioritySection
                    key={p}
                    priority={p}
                    count={data[`priority_${p}` as 'priority_1' | 'priority_2' | 'priority_3']}
                    areas={data.areas.filter(a => a.priority === p)}
                  />
                ))}
              </>
            )}
          </div>
        </aside>
      )}
    </>
  );
};
