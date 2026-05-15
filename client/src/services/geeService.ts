import api from './api';
import type { ScenarioId, ScenarioYear, ClimateScenario } from '../types';

export interface GEEScenarioResult {
  tileUrl: string;
  metadata: ClimateScenario;
  computed_at: string;
  source: string;
}

export const geeService = {
  /**
   * Request a GEE-computed scenario tile URL for a given (scenario, year) pair.
   * Falls back to pre-computed tiles when GEE is unavailable.
   */
  async computeScenario(
    scenario: ScenarioId,
    year: ScenarioYear,
    bbox?: string
  ): Promise<GEEScenarioResult> {
    const { data } = await api.post<GEEScenarioResult>('/gee/compute-scenario', {
      scenario,
      year,
      bbox
    });
    return data;
  }
};
