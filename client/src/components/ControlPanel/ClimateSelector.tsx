import React from 'react';
import { useScenarioStore } from '../../store/scenarioStore';
import { SCENARIO_OPTIONS } from '../../types';
import type { ScenarioId } from '../../types';

export const ClimateSelector: React.FC = () => {
  const { scenarioId, setScenario } = useScenarioStore();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        Climate Scenario
      </label>
      <select
        value={scenarioId}
        onChange={e => setScenario(e.target.value as ScenarioId)}
        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                   text-gray-700"
        aria-label="Select climate scenario"
      >
        {SCENARIO_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
