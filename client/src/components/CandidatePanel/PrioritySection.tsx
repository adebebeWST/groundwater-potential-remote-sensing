import React, { useState } from 'react';
import type { CandidateArea, Priority } from '../../types';
import { CandidateItem } from './CandidateItem';

interface PrioritySectionProps {
  priority: Priority;
  count: number;
  areas: CandidateArea[];
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string }> = {
  1: { label: 'Priority 1',  color: 'text-green-700',  dot: 'bg-green-500'  },
  2: { label: 'Priority 2',  color: 'text-yellow-700', dot: 'bg-yellow-500' },
  3: { label: 'Priority 3',  color: 'text-red-700',    dot: 'bg-red-400'    }
};

export const PrioritySection: React.FC<PrioritySectionProps> = ({ priority, count, areas }) => {
  const [expanded, setExpanded] = useState(priority === 1);
  const config = PRIORITY_CONFIG[priority];

  return (
    <section>
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(prev => !prev)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot}`} />
          <span className={`text-sm font-semibold ${config.color}`}>
            {config.label} ({count})
          </span>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▴' : '▾'}</span>
      </button>

      {expanded && (
        <ul className="px-2 pb-2 space-y-0.5">
          {areas.length === 0 ? (
            <li className="px-3 py-2 text-xs text-gray-400 italic">No areas found.</li>
          ) : (
            areas.map(area => <CandidateItem key={area.id} area={area} />)
          )}
        </ul>
      )}
    </section>
  );
};
