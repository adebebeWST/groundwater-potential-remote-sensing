import { injectable } from 'tsyringe';
import { IGroundwaterRepository, BboxFilter } from '../../domain/interfaces/IGroundwaterRepository';
import { GroundwaterPoint, CreateGroundwaterPointData } from '../../domain/entities/GroundwaterPoint';

/**
 * In-memory groundwater repository with seed data for Ethiopia.
 * Replace with a PostGIS-backed implementation by injecting a
 * DatabaseConnection and executing spatial SQL queries.
 */
@injectable()
export class GroundwaterRepository implements IGroundwaterRepository {
  private store: GroundwaterPoint[] = this.seed();

  private seed(): GroundwaterPoint[] {
    const points: GroundwaterPoint[] = [];
    let id = 1;

    const rawData: Array<ConstructorParameters<typeof GroundwaterPoint> & { woreda_id?: number }> = [
      ['borehole', 38.765, 9.012, 'high',     88, 1, 1, 12.5, 45.0, 'high_pot_low_uncert',   {}],
      ['borehole', 38.820, 9.050, 'high',     80, 1, 1, 10.2, 52.0, 'high_pot_low_uncert',   {}],
      ['borehole', 38.700, 8.980, 'moderate', 65, 2, 2, 7.8,  60.0, 'high_pot_med_uncert',   {}],
      ['ves_point',38.750, 9.030, 'high',     75, 1, 1, null, null, 'high_pot_low_uncert',   {}],
      ['borehole', 38.850, 9.100, 'low',      40, 3, 3, 3.2,  80.0, 'high_pot_high_uncert',  {}],
      ['borehole', 39.000, 9.200, 'high',     90, 1, 2, 14.1, 38.0, 'high_pot_low_uncert',   {}],
      ['ves_point',38.900, 9.150, 'moderate', 60, 2, 2, null, null, 'high_pot_med_uncert',   {}],
      ['borehole', 38.600, 8.900, 'moderate', 58, 2, 3, 6.5,  70.0, 'high_pot_med_uncert',   {}],
      ['borehole', 38.650, 8.950, 'low',      35, 3, 3, 2.1,  95.0, 'high_pot_high_uncert',  {}],
      ['ves_point',39.050, 9.250, 'high',     82, 1, 2, null, null, 'high_pot_low_uncert',   {}],
    ];

    for (const row of rawData) {
      const p = new GroundwaterPoint(
        row[0] as any, row[1] as any, row[2] as any,
        row[3] as any, row[4] as any, row[5] as any,
        row[6] as any, row[7] as any, row[8] as any,
        row[9] as any, row[10] as any
      );
      (p as any).id = id++;
      p.createdAt = new Date();
      p.updatedAt = new Date();
      points.push(p);
    }
    return points;
  }

  async findAll(): Promise<GroundwaterPoint[]> {
    return [...this.store];
  }

  async findById(id: number): Promise<GroundwaterPoint | null> {
    return this.store.find(p => p.id === id) ?? null;
  }

  async findByBbox(bbox: BboxFilter): Promise<GroundwaterPoint[]> {
    return this.store.filter(p =>
      p.longitude >= bbox.minLng &&
      p.longitude <= bbox.maxLng &&
      p.latitude  >= bbox.minLat &&
      p.latitude  <= bbox.maxLat
    );
  }

  async findByType(type: 'borehole' | 'ves_point', bbox?: BboxFilter): Promise<GroundwaterPoint[]> {
    let results = this.store.filter(p => p.type === type);
    if (bbox) {
      results = results.filter(p =>
        p.longitude >= bbox.minLng &&
        p.longitude <= bbox.maxLng &&
        p.latitude  >= bbox.minLat &&
        p.latitude  <= bbox.maxLat
      );
    }
    return results;
  }

  async findNearLocation(lat: number, lon: number, radiusDeg = 0.05): Promise<GroundwaterPoint[]> {
    return this.store.filter(p =>
      Math.abs(p.latitude - lat) <= radiusDeg &&
      Math.abs(p.longitude - lon) <= radiusDeg
    );
  }

  async findByWoreda(woreda_id: number): Promise<GroundwaterPoint[]> {
    return this.store.filter(p => p.woreda_id === woreda_id);
  }

  async create(data: CreateGroundwaterPointData): Promise<GroundwaterPoint> {
    const point = GroundwaterPoint.create(data);
    const maxId = this.store.reduce((m, p) => Math.max(m, p.id ?? 0), 0);
    (point as any).id = maxId + 1;
    point.createdAt = new Date();
    point.updatedAt = new Date();
    this.store.push(point);
    return point;
  }

  async update(id: number, data: Partial<CreateGroundwaterPointData>): Promise<GroundwaterPoint | null> {
    const index = this.store.findIndex(p => p.id === id);
    if (index === -1) return null;
    const point = this.store[index];
    Object.assign(point, data, { updatedAt: new Date() });
    return point;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.store.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }
}
