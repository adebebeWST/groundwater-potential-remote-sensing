import { GroundwaterPoint, CreateGroundwaterPointData } from '../entities/GroundwaterPoint';

export interface BboxFilter {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface FeatureInfoQuery {
  lat: number;
  lon: number;
}

export interface IGroundwaterRepository {
  findAll(): Promise<GroundwaterPoint[]>;
  findById(id: number): Promise<GroundwaterPoint | null>;
  findByBbox(bbox: BboxFilter): Promise<GroundwaterPoint[]>;
  findByType(type: 'borehole' | 'ves_point', bbox?: BboxFilter): Promise<GroundwaterPoint[]>;
  findNearLocation(lat: number, lon: number, radiusDeg?: number): Promise<GroundwaterPoint[]>;
  findByWoreda(woreda_id: number): Promise<GroundwaterPoint[]>;
  create(data: CreateGroundwaterPointData): Promise<GroundwaterPoint>;
  update(id: number, data: Partial<CreateGroundwaterPointData>): Promise<GroundwaterPoint | null>;
  delete(id: number): Promise<boolean>;
}
