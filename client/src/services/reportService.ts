import api from './api';
import type { MapViewport, LayerVisibility, ScenarioId, ScenarioYear } from '../types';

export interface ReportRequest {
  mapState?: {
    center: { lat: number; lng: number };
    zoom: number;
    layers: string[];
  };
  candidateSelections?: number[];
  scenario?: ScenarioId;
  year?: ScenarioYear;
  userEmail?: string;
}

export interface ReportResponse {
  reportId: string;
  reportUrl: string;
  status: string;
  message: string;
  requestedAt: string;
}

export const reportService = {
  async generateReport(request: ReportRequest): Promise<ReportResponse> {
    const { data } = await api.post<ReportResponse>('/report/generate', request);
    return data;
  },

  async getSharedState(token: string): Promise<Record<string, unknown>> {
    const { data } = await api.get(`/report/share/${token}`);
    return data;
  },

  /** Build a shareable URL encoding current map state */
  buildShareUrl(
    viewport: MapViewport,
    layers: LayerVisibility,
    scenarioId: ScenarioId,
    year: ScenarioYear
  ): string {
    const params = new URLSearchParams({
      lat:  viewport.center.lat.toFixed(6),
      lng:  viewport.center.lng.toFixed(6),
      zoom: String(viewport.zoom),
      scenario: scenarioId,
      year: String(year),
      layers: Object.entries(layers)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(',')
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }
};
