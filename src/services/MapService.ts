import { inject, injectable } from 'tsyringe';
import { WSTLogger } from '@wst/logger';
import { BaseError } from '@wst/core';
import { IGroundwaterRepository, BboxFilter } from '../domain/interfaces/IGroundwaterRepository';
import { ICandidateAreaRepository, CandidateAreaFilter } from '../domain/interfaces/ICandidateAreaRepository';
import { IWoredaRepository } from '../domain/interfaces/IWoredaRepository';
import { GroundwaterPoint } from '../domain/entities/GroundwaterPoint';
import { CandidateArea } from '../domain/entities/CandidateArea';
import { Woreda } from '../domain/entities/Woreda';
import { buildClimateScenario, ClimateScenario, ScenarioId, ScenarioYear, SCENARIO_DEFINITIONS } from '../domain/entities/ClimateScenario';
import type { Priority } from '../domain/entities/GroundwaterPoint';

// DTO types returned by the service
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
  gwp_suitability: string | null;
  yield_lps: number | null;
  depth_m: number | null;
  confidence: number | null;
  uncertainty_category: string | null;
  priority: number | null;
  woreda: string | null;
  nearest_points: GroundwaterPoint[];
}

export interface CandidateAreaSummary {
  id: number;
  priority: number;
  woreda_name: string | null;
  area_km2: number | null;
  avg_yield_lps: number | null;
  confidence: number;
  borehole_count: number;
  geom: Record<string, unknown> | null;
}

export interface CandidateCountByPriority {
  priority_1: number;
  priority_2: number;
  priority_3: number;
  areas: CandidateAreaSummary[];
}

export interface WoredaSearchResult {
  id: number;
  name: string;
  region: string | null;
  zone: string | null;
  full_name: string;
}

export interface IMapService {
  getLayers(scenarioId?: string, year?: number): Promise<LayerMetadata[]>;
  getFeatureInfo(lat: number, lon: number): Promise<FeatureInfoResult>;
  getCandidateAreas(priority?: number, woreda?: string): Promise<CandidateCountByPriority>;
  searchWoreda(query: string): Promise<WoredaSearchResult[]>;
  getBoreholes(bbox?: BboxFilter): Promise<GroundwaterPoint[]>;
  getVESPoints(bbox?: BboxFilter): Promise<GroundwaterPoint[]>;
  getClimateScenarios(): Promise<ClimateScenario[]>;
}

@injectable()
export class MapService implements IMapService {
  constructor(
    @inject('GroundwaterRepository')
    private groundwaterRepository: IGroundwaterRepository,
    @inject('CandidateAreaRepository')
    private candidateAreaRepository: ICandidateAreaRepository,
    @inject('WoredaRepository')
    private woredaRepository: IWoredaRepository,
    @inject('Logger')
    private logger: WSTLogger
  ) {}

  async getLayers(scenarioId?: string, year?: number): Promise<LayerMetadata[]> {
    this.logger.info(`MapService: Getting layers for scenario=${scenarioId}, year=${year}`);

    const tileBase = process.env.RASTER_TILE_BASE_URL ?? 'https://tiles.example.com';
    const geoserverUrl = process.env.GEOSERVER_URL ?? '';

    const layers: LayerMetadata[] = [
      {
        id: 'gwp_map',
        name: 'Groundwater Potential Map',
        type: 'raster',
        url: `${tileBase}/gwp/{z}/{x}/{y}.png`,
        visible: true,
        opacity: 0.75
      },
      {
        id: 'uncertainty',
        name: 'Uncertainty Layer',
        type: 'raster',
        url: `${tileBase}/uncertainty/{z}/{x}/{y}.png`,
        visible: false,
        opacity: 0.6
      },
      {
        id: 'candidate_areas',
        name: 'Candidate Areas',
        type: 'vector',
        url: '/api/map/candidate-areas',
        visible: true,
        opacity: 0.8
      },
      {
        id: 'boreholes',
        name: 'Boreholes',
        type: 'vector',
        url: '/api/map/boreholes',
        visible: true,
        opacity: 1.0
      },
      {
        id: 'ves_points',
        name: 'VES Points',
        type: 'vector',
        url: '/api/map/ves-points',
        visible: false,
        opacity: 1.0
      }
    ];

    // Append scenario-specific layer if provided
    if (scenarioId && year) {
      layers.push({
        id: `scenario_${scenarioId}_${year}`,
        name: `Scenario Layer (${scenarioId.toUpperCase()} ${year})`,
        type: 'raster',
        url: `${tileBase}/scenario/${scenarioId}/${year}/{z}/{x}/{y}.png`,
        visible: true,
        opacity: 0.7
      });
    }

    return layers;
  }

  async getFeatureInfo(lat: number, lon: number): Promise<FeatureInfoResult> {
    this.logger.info(`MapService: Getting feature info at (${lat}, ${lon})`);

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new BaseError('Invalid coordinates', 400, 'INVALID_COORDINATES');
    }

    const nearbyPoints = await this.groundwaterRepository.findNearLocation(lat, lon, 0.1);

    if (nearbyPoints.length === 0) {
      return {
        lat, lon,
        gwp_suitability: null,
        yield_lps: null,
        depth_m: null,
        confidence: null,
        uncertainty_category: null,
        priority: null,
        woreda: null,
        nearest_points: []
      };
    }

    // Return data from the closest point
    const closest = nearbyPoints[0];
    let woredaName: string | null = null;
    if (closest.woreda_id) {
      const woreda = await this.woredaRepository.findById(closest.woreda_id);
      woredaName = woreda?.name ?? null;
    }

    return {
      lat,
      lon,
      gwp_suitability: closest.gwp_suitability,
      yield_lps: closest.yield_lps ?? null,
      depth_m: closest.depth_m ?? null,
      confidence: closest.confidence,
      uncertainty_category: closest.uncertainty_category ?? null,
      priority: closest.priority,
      woreda: woredaName,
      nearest_points: nearbyPoints.slice(0, 5)
    };
  }

  async getCandidateAreas(priority?: number, woreda?: string): Promise<CandidateCountByPriority> {
    this.logger.info(`MapService: Getting candidate areas priority=${priority}, woreda=${woreda}`);

    const filter: CandidateAreaFilter = {};
    if (priority) filter.priority = priority as Priority;
    if (woreda) filter.woreda_name = woreda;

    const areas = await this.candidateAreaRepository.findByFilter(filter);
    const counts = await this.candidateAreaRepository.countByPriority();

    return {
      priority_1: counts[1] ?? 0,
      priority_2: counts[2] ?? 0,
      priority_3: counts[3] ?? 0,
      areas: areas.map(a => ({
        id: a.id,
        priority: a.priority,
        woreda_name: a.woreda_name ?? null,
        area_km2: a.area_km2 ?? null,
        avg_yield_lps: a.avg_yield_lps ?? null,
        confidence: a.confidence,
        borehole_count: a.borehole_count,
        geom: a.geom ?? null
      }))
    };
  }

  async searchWoreda(query: string): Promise<WoredaSearchResult[]> {
    this.logger.info(`MapService: Searching woreda with query="${query}"`);

    if (!query || query.trim().length < 2) {
      throw new BaseError('Search query must be at least 2 characters', 400, 'QUERY_TOO_SHORT');
    }

    const woredas = await this.woredaRepository.searchByName(query, 10);
    return woredas.map(w => ({
      id: w.id,
      name: w.name,
      region: w.region ?? null,
      zone: w.zone ?? null,
      full_name: w.getFullName()
    }));
  }

  async getBoreholes(bbox?: BboxFilter): Promise<GroundwaterPoint[]> {
    this.logger.info(`MapService: Getting boreholes bbox=${JSON.stringify(bbox)}`);
    return this.groundwaterRepository.findByType('borehole', bbox);
  }

  async getVESPoints(bbox?: BboxFilter): Promise<GroundwaterPoint[]> {
    this.logger.info(`MapService: Getting VES points bbox=${JSON.stringify(bbox)}`);
    return this.groundwaterRepository.findByType('ves_point', bbox);
  }

  async getClimateScenarios(): Promise<ClimateScenario[]> {
    const scenarios: ClimateScenario[] = [];
    const scenarioIds = Object.keys(SCENARIO_DEFINITIONS) as ScenarioId[];
    const years: ScenarioYear[] = [2030, 2050, 2080];

    for (const id of scenarioIds) {
      for (const year of years) {
        scenarios.push(buildClimateScenario(id, year));
      }
    }
    return scenarios;
  }
}
