import api from './api';
import type {
  LayerMetadata,
  FeatureInfoResult,
  CandidateCountByPriority,
  Woreda,
  ClimateScenario,
  ScenarioId,
  ScenarioYear
} from '../types';

export const mapService = {
  /** List available map layers (optionally with scenario/year filter) */
  async getLayers(scenario?: ScenarioId, year?: ScenarioYear): Promise<LayerMetadata[]> {
    const params: Record<string, string | number> = {};
    if (scenario) params.scenario = scenario;
    if (year) params.year = year;
    const { data } = await api.get<LayerMetadata[]>('/map/layers', { params });
    return data;
  },

  /** Query groundwater data at a specific lat/lon */
  async getFeatureInfo(lat: number, lon: number): Promise<FeatureInfoResult> {
    const { data } = await api.get<FeatureInfoResult>('/map/feature-info', { params: { lat, lon } });
    return data;
  },

  /** Get candidate areas, optionally filtered by priority or woreda name */
  async getCandidateAreas(priority?: number, woreda?: string): Promise<CandidateCountByPriority> {
    const params: Record<string, string | number> = {};
    if (priority) params.priority = priority;
    if (woreda) params.woreda = woreda;
    const { data } = await api.get<CandidateCountByPriority>('/map/candidate-areas', { params });
    return data;
  },

  /** Autocomplete search for Ethiopian woredas */
  async searchWoreda(query: string): Promise<Woreda[]> {
    if (!query || query.trim().length < 2) return [];
    const { data } = await api.get<Woreda[]>('/map/search/woreda', { params: { q: query } });
    return data;
  },

  /** Get borehole GeoJSON, optionally clipped to bbox */
  async getBoreholes(bbox?: string): Promise<GeoJSON.FeatureCollection> {
    const params: Record<string, string> = {};
    if (bbox) params.bbox = bbox;
    const { data } = await api.get<GeoJSON.FeatureCollection>('/map/boreholes', { params });
    return data;
  },

  /** Get VES point GeoJSON, optionally clipped to bbox */
  async getVESPoints(bbox?: string): Promise<GeoJSON.FeatureCollection> {
    const params: Record<string, string> = {};
    if (bbox) params.bbox = bbox;
    const { data } = await api.get<GeoJSON.FeatureCollection>('/map/ves-points', { params });
    return data;
  },

  /** List all pre-defined climate scenarios */
  async getScenarios(): Promise<ClimateScenario[]> {
    const { data } = await api.get<ClimateScenario[]>('/map/scenarios');
    return data;
  },

  /** Compute a scenario tile URL via GEE proxy */
  async computeScenario(scenario: ScenarioId, year: ScenarioYear, bbox?: string): Promise<{ tileUrl: string; metadata: ClimateScenario }> {
    const { data } = await api.post('/gee/compute-scenario', { scenario, year, bbox });
    return data;
  }
};
