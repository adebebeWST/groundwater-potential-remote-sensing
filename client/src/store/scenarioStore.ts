import { create } from 'zustand';
import type { ScenarioId, ScenarioYear } from '../types';

interface ScenarioState {
  scenarioId: ScenarioId;
  year: ScenarioYear;
  setScenario: (id: ScenarioId) => void;
  setYear: (year: ScenarioYear) => void;
}

export const useScenarioStore = create<ScenarioState>(set => ({
  scenarioId: 'ssp245',
  year: 2050,
  setScenario: scenarioId => set({ scenarioId }),
  setYear: year => set({ year })
}));
