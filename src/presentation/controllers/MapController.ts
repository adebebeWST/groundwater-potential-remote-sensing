import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { BaseController } from '@wst/middleware';
import { IMapService } from '../../services/MapService';
import { buildClimateScenario, SCENARIO_DEFINITIONS } from '../../domain/entities/ClimateScenario';
import type { ScenarioId, ScenarioYear } from '../../domain/entities/ClimateScenario';
import type { BboxFilter } from '../../domain/interfaces/IGroundwaterRepository';

@injectable()
export class MapController extends BaseController {
  constructor(
    @inject('MapService')
    private mapService: IMapService
  ) {
    super();
  }

  // GET /api/map/layers
  async getLayers(req: Request, res: Response): Promise<void> {
    const { scenario, year } = req.query as { scenario?: string; year?: string };
    const result = await this.mapService.getLayers(scenario, year ? Number(year) : undefined);
    this.ok(res, result);
  }

  // GET /api/map/feature-info?lat=...&lon=...
  async getFeatureInfo(req: Request, res: Response): Promise<void> {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);

    if (isNaN(lat) || isNaN(lon)) {
      this.fail(res, 'lat and lon query parameters are required and must be numeric', 400);
      return;
    }

    const result = await this.mapService.getFeatureInfo(lat, lon);
    this.ok(res, result);
  }

  // GET /api/map/candidate-areas
  async getCandidateAreas(req: Request, res: Response): Promise<void> {
    const priority = req.query.priority ? Number(req.query.priority) : undefined;
    const woreda = req.query.woreda as string | undefined;

    if (priority !== undefined && ![1, 2, 3].includes(priority)) {
      this.fail(res, 'priority must be 1, 2, or 3', 400);
      return;
    }

    const result = await this.mapService.getCandidateAreas(priority, woreda);
    this.ok(res, result);
  }

  // GET /api/map/search/woreda?q=...
  async searchWoreda(req: Request, res: Response): Promise<void> {
    const q = (req.query.q as string) ?? '';

    if (!q || q.trim().length < 2) {
      this.fail(res, 'Search query must be at least 2 characters', 400);
      return;
    }

    const result = await this.mapService.searchWoreda(q);
    this.ok(res, result);
  }

  // GET /api/map/boreholes?bbox=minLng,minLat,maxLng,maxLat
  async getBoreholes(req: Request, res: Response): Promise<void> {
    const bbox = this.parseBbox(req.query.bbox as string | undefined);
    const points = await this.mapService.getBoreholes(bbox);
    this.ok(res, this.toGeoJSON(points));
  }

  // GET /api/map/ves-points?bbox=minLng,minLat,maxLng,maxLat
  async getVESPoints(req: Request, res: Response): Promise<void> {
    const bbox = this.parseBbox(req.query.bbox as string | undefined);
    const points = await this.mapService.getVESPoints(bbox);
    this.ok(res, this.toGeoJSON(points));
  }

  // GET /api/map/scenarios
  async getScenarios(req: Request, res: Response): Promise<void> {
    const scenarios = await this.mapService.getClimateScenarios();
    this.ok(res, scenarios);
  }

  // POST /api/gee/compute-scenario
  async computeScenario(req: Request, res: Response): Promise<void> {
    const { scenario, year, bbox } = req.body as { scenario: ScenarioId; year: ScenarioYear; bbox?: string };

    if (!scenario || !year) {
      this.fail(res, 'scenario and year are required', 400);
      return;
    }

    const validScenarios = Object.keys(SCENARIO_DEFINITIONS);
    if (!validScenarios.includes(scenario)) {
      this.fail(res, `scenario must be one of: ${validScenarios.join(', ')}`, 400);
      return;
    }

    if (![2030, 2050, 2080].includes(year)) {
      this.fail(res, 'year must be 2030, 2050, or 2080', 400);
      return;
    }

    const scenarioData = buildClimateScenario(scenario, year);
    const tileBase = process.env.RASTER_TILE_BASE_URL ?? 'https://tiles.example.com';

    // In production: delegate to GEE proxy service to compute on-demand COG tiles
    this.ok(res, {
      tileUrl: `${tileBase}/scenario/${scenario}/${year}/{z}/{x}/{y}.png`,
      metadata: scenarioData,
      computed_at: new Date().toISOString(),
      source: 'pre-computed' // 'gee' in production
    });
  }

  // POST /api/report/generate
  async generateReport(req: Request, res: Response): Promise<void> {
    const { mapState, candidateSelections, scenario, year, userEmail } = req.body;

    // In production: use Puppeteer to render a headless page and generate PDF
    const reportId = `report_${Date.now()}`;
    const reportUrl = `/api/report/download/${reportId}`;

    this.ok(res, {
      reportId,
      reportUrl,
      status: 'generated',
      message: 'Report generation is queued. In production, PDF is generated via Puppeteer.',
      requestedAt: new Date().toISOString(),
      params: { mapState, candidateSelections, scenario, year, userEmail }
    });
  }

  // GET /api/report/share/:token
  async getSharedState(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    // In production: decode JWT/signed token and return the persisted UI state
    this.ok(res, {
      token,
      state: null,
      message: 'Share link decoding is handled by the frontend via URL query params.'
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private parseBbox(raw: string | undefined): BboxFilter | undefined {
    if (!raw) return undefined;
    const parts = raw.split(',').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return undefined;
    return { minLng: parts[0], minLat: parts[1], maxLng: parts[2], maxLat: parts[3] };
  }

  private toGeoJSON(points: Array<{ id: number; type: string; longitude: number; latitude: number; gwp_suitability: string; yield_lps?: number | null; depth_m?: number | null; confidence: number; priority: number; uncertainty_category?: string | null; woreda_id?: number | null }>): object {
    return {
      type: 'FeatureCollection',
      features: points.map(p => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.longitude, p.latitude]
        },
        properties: {
          id: p.id,
          point_type: p.type,
          gwp_suitability: p.gwp_suitability,
          yield_lps: p.yield_lps ?? null,
          depth_m: p.depth_m ?? null,
          confidence: p.confidence,
          priority: p.priority,
          uncertainty_category: p.uncertainty_category ?? null,
          woreda_id: p.woreda_id ?? null
        }
      }))
    };
  }

  // Required by BaseController for default POST handling
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    this.fail(res, 'Method not implemented', 405);
  }
}
