import React from 'react';
import { useScenarioStore } from '../../store/scenarioStore';
import { YEAR_OPTIONS } from '../../types';
import type { ScenarioYear } from '../../types';

export const YearSlider: React.FC = () => {
  const { year, setYear } = useScenarioStore();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        Target Year
      </label>
      <div className="flex gap-2">
        {YEAR_OPTIONS.map(y => (
          <button
            key={y}
            onClick={() => setYear(y as ScenarioYear)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              year === y
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-pressed={year === y}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
};
