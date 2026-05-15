// ─── Core domain types ────────────────────────────────────────────────────────

export type GWPSuitability = 'high' | 'moderate' | 'low';
export type PointType = 'borehole' | 'ves_point';
export type Priority = 1 | 2 | 3;
export type UncertaintyCategory =
  | 'high_pot_low_uncert'
  | 'high_pot_med_uncert'
  | 'high_pot_high_uncert';
export type ScenarioId = 'ssp126' | 'ssp245' | 'ssp370' | 'ssp585';
export type ScenarioYear = 2030 | 2050 | 2080;

export interface GroundwaterPoint {
  id: number;
  type: PointType;
  coordinates: [number, number]; // [lng, lat]
  woreda_id?: number;
  gwp_suitability: GWPSuitability;
  yield_lps?: number | null;
  depth_m?: number | null;
  confidence: number; // 0-100
  priority: Priority;
  uncertainty_category?: UncertaintyCategory | null;
  metadata?: Record<string, unknown>;
}

export interface ClimateScenario {
  id: ScenarioId;
  name: string;
  description: string;
  year: ScenarioYear;
  rainfall_change_percent: number;
  et_change_percent: number;
  recharge_index: number; // 0-1
}

export interface CandidateArea {
  id: number;
  priority: Priority;
  woreda_name: string | null;
  area_km2: number | null;
  avg_yield_lps: number | null;
  confidence: number;
  borehole_count: number;
  geom?: GeoJSONPolygon | null;
}

export interface Woreda {
  id: number;
  name: string;
  region: string | null;
  zone: string | null;
  full_name: string;
}

// ─── GeoJSON types ────────────────────────────────────────────────────────────

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface GeoJSONPolygon {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface GeoJSONFeature<G = GeoJSONPoint, P = Record<string, unknown>> {
  type: 'Feature';
  geometry: G;
  properties: P;
}

export interface GeoJSONFeatureCollection<F = GeoJSONFeature> {
  type: 'FeatureCollection';
  features: F[];
}

// ─── API response types ───────────────────────────────────────────────────────

export interface LayerMetadata {
  id: string;
  name: string;
  type: 'raster' | 'vector' | 'wms';
  url: string;
  visible: boolean;
  opacity: number;
}

export interface FeatureInfoResult {
  lat: number;
  lon: number;
  gwp_suitability: GWPSuitability | null;
  yield_lps: number | null;
  depth_m: number | null;
  confidence: number | null;
  uncertainty_category: UncertaintyCategory | null;
  priority: Priority | null;
  woreda: string | null;
  nearest_points: GroundwaterPointProperties[];
}

export interface GroundwaterPointProperties {
  id: number;
  point_type: PointType;
  gwp_suitability: GWPSuitability;
  yield_lps: number | null;
  depth_m: number | null;
  confidence: number;
  priority: Priority;
  uncertainty_category: UncertaintyCategory | null;
}

export interface CandidateCountByPriority {
  priority_1: number;
  priority_2: number;
  priority_3: number;
  areas: CandidateArea[];
}

// ─── Map state types ──────────────────────────────────────────────────────────

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapViewport {
  center: MapCenter;
  zoom: number;
}

export interface LayerVisibility {
  gwp_map: boolean;
  candidate_areas: boolean;
  boreholes: boolean;
  ves_points: boolean;
  uncertainty: boolean;
}

// ─── UI state types ───────────────────────────────────────────────────────────

export interface UIState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  loading: boolean;
  error: string | null;
  selectedCandidateId: number | null;
}

// ─── Scenario state types ─────────────────────────────────────────────────────

export interface ScenarioState {
  scenarioId: ScenarioId;
  year: ScenarioYear;
}

// ─── Share URL state ──────────────────────────────────────────────────────────

export interface ShareableState {
  center: MapCenter;
  zoom: number;
  layers: LayerVisibility;
  scenarioId: ScenarioId;
  year: ScenarioYear;
}

// ─── Uncertainty label map ────────────────────────────────────────────────────

export const UNCERTAINTY_LABELS: Record<UncertaintyCategory, string> = {
  high_pot_low_uncert:  'High Potential + Low Uncertainty',
  high_pot_med_uncert:  'High Potential + Medium Uncertainty',
  high_pot_high_uncert: 'High Potential + High Uncertainty'
};

export const GWP_COLORS: Record<GWPSuitability, string> = {
  high:     '#22c55e',
  moderate: '#f59e0b',
  low:      '#ef4444'
};

export const SCENARIO_OPTIONS: { value: ScenarioId; label: string }[] = [
  { value: 'ssp126', label: 'SSP1-2.6 – Low Emissions'           },
  { value: 'ssp245', label: 'SSP2-4.5 – Intermediate Emissions'  },
  { value: 'ssp370', label: 'SSP3-7.0 – High Emissions'          },
  { value: 'ssp585', label: 'SSP5-8.5 – Very High Emissions'     }
];

export const YEAR_OPTIONS: ScenarioYear[] = [2030, 2050, 2080];
