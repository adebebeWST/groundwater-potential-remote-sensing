export type ScenarioId = 'ssp126' | 'ssp245' | 'ssp370' | 'ssp585';
export type ScenarioYear = 2030 | 2050 | 2080;

export interface ClimateScenario {
  id: ScenarioId;
  name: string;
  description: string;
  year: ScenarioYear;
  rainfall_change_percent: number;
  et_change_percent: number;
  recharge_index: number; // 0-1
}

export const SCENARIO_DEFINITIONS: Record<ScenarioId, Omit<ClimateScenario, 'year' | 'rainfall_change_percent' | 'et_change_percent' | 'recharge_index'>> = {
  ssp126: {
    id: 'ssp126',
    name: 'SSP1-2.6',
    description: 'Low emissions – sustainable development pathway (~1.5°C warming by 2100)'
  },
  ssp245: {
    id: 'ssp245',
    name: 'SSP2-4.5',
    description: 'Intermediate emissions – middle-of-the-road pathway (~2.7°C warming by 2100)'
  },
  ssp370: {
    id: 'ssp370',
    name: 'SSP3-7.0',
    description: 'High emissions – regional rivalry pathway (~3.6°C warming by 2100)'
  },
  ssp585: {
    id: 'ssp585',
    name: 'SSP5-8.5',
    description: 'Very high emissions – fossil-fueled development pathway (~4.4°C warming by 2100)'
  }
};

/** Pre-computed scenario parameters for each (scenario, year) combination */
export const SCENARIO_PARAMETERS: Record<string, Pick<ClimateScenario, 'rainfall_change_percent' | 'et_change_percent' | 'recharge_index'>> = {
  'ssp126_2030': { rainfall_change_percent: 2.1,  et_change_percent: 1.5,  recharge_index: 0.82 },
  'ssp126_2050': { rainfall_change_percent: 3.4,  et_change_percent: 2.1,  recharge_index: 0.79 },
  'ssp126_2080': { rainfall_change_percent: 4.0,  et_change_percent: 2.8,  recharge_index: 0.77 },
  'ssp245_2030': { rainfall_change_percent: 1.8,  et_change_percent: 2.0,  recharge_index: 0.75 },
  'ssp245_2050': { rainfall_change_percent: -0.5, et_change_percent: 3.5,  recharge_index: 0.68 },
  'ssp245_2080': { rainfall_change_percent: -2.1, et_change_percent: 5.2,  recharge_index: 0.60 },
  'ssp370_2030': { rainfall_change_percent: 1.2,  et_change_percent: 2.8,  recharge_index: 0.70 },
  'ssp370_2050': { rainfall_change_percent: -3.0, et_change_percent: 5.5,  recharge_index: 0.55 },
  'ssp370_2080': { rainfall_change_percent: -6.8, et_change_percent: 9.1,  recharge_index: 0.42 },
  'ssp585_2030': { rainfall_change_percent: 0.9,  et_change_percent: 3.2,  recharge_index: 0.65 },
  'ssp585_2050': { rainfall_change_percent: -4.5, et_change_percent: 7.0,  recharge_index: 0.48 },
  'ssp585_2080': { rainfall_change_percent: -9.2, et_change_percent: 12.3, recharge_index: 0.31 }
};

export function buildClimateScenario(id: ScenarioId, year: ScenarioYear): ClimateScenario {
  const key = `${id}_${year}`;
  const params = SCENARIO_PARAMETERS[key] ?? { rainfall_change_percent: 0, et_change_percent: 0, recharge_index: 0.5 };
  return {
    ...SCENARIO_DEFINITIONS[id],
    year,
    ...params
  };
}
