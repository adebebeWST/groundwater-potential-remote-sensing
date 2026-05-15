import { injectable } from 'tsyringe';
import { ICandidateAreaRepository, CandidateAreaFilter } from '../../domain/interfaces/ICandidateAreaRepository';
import { CandidateArea, CreateCandidateAreaData } from '../../domain/entities/CandidateArea';

/**
 * In-memory candidate area repository with seed data for Ethiopia.
 * Replace with a PostGIS-backed implementation for production use.
 */
@injectable()
export class CandidateAreaRepository implements ICandidateAreaRepository {
  private store: CandidateArea[] = this.seed();

  private seed(): CandidateArea[] {
    const areas: CandidateArea[] = [];
    let id = 1;

    const rawData: Array<[number, string, number, number, number, number]> = [
      [1, 'Akaki-Kaliti',  1, 155.4, 11.8, 5],
      [1, 'Bole',          1, 92.1,  13.2, 3],
      [1, 'Nifas Silk',    1, 78.5,  10.5, 4],
      [1, 'Yeka',          1, 110.3, 12.0, 6],
      [1, 'Kolfe Keranio', 1, 88.7,  11.2, 4],
      [2, 'Gulele',        2, 65.2,  8.4,  3],
      [2, 'Lideta',        2, 54.8,  7.9,  2],
      [2, 'Kirkos',        2, 60.1,  8.1,  3],
      [3, 'Arada',         3, 42.3,  5.5,  2],
      [3, 'Addis Ketema',  3, 38.6,  4.8,  1],
    ];

    for (const row of rawData) {
      const a = new CandidateArea(
        row[0] as any,
        row[2] * 10, // confidence from priority
        row[5],
        undefined,
        row[1],
        row[3],
        row[4]
      );
      (a as any).id = id++;
      a.createdAt = new Date();
      a.updatedAt = new Date();
      areas.push(a);
    }

    // Adjust confidence values realistically
    const confidences = [88, 85, 82, 80, 78, 65, 62, 60, 45, 42];
    areas.forEach((a, i) => { a.confidence = confidences[i]; });

    return areas;
  }

  async findAll(): Promise<CandidateArea[]> {
    return [...this.store];
  }

  async findById(id: number): Promise<CandidateArea | null> {
    return this.store.find(a => a.id === id) ?? null;
  }

  async findByFilter(filter: CandidateAreaFilter): Promise<CandidateArea[]> {
    return this.store.filter(a => {
      if (filter.priority !== undefined && a.priority !== filter.priority) return false;
      if (filter.woreda_id !== undefined && a.woreda_id !== filter.woreda_id) return false;
      if (filter.woreda_name && !a.woreda_name?.toLowerCase().includes(filter.woreda_name.toLowerCase())) return false;
      return true;
    });
  }

  async countByPriority(): Promise<Record<number, number>> {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    for (const a of this.store) {
      counts[a.priority] = (counts[a.priority] ?? 0) + 1;
    }
    return counts;
  }

  async create(data: CreateCandidateAreaData): Promise<CandidateArea> {
    const area = CandidateArea.create(data);
    const maxId = this.store.reduce((m, a) => Math.max(m, a.id ?? 0), 0);
    (area as any).id = maxId + 1;
    area.createdAt = new Date();
    area.updatedAt = new Date();
    this.store.push(area);
    return area;
  }

  async update(id: number, data: Partial<CreateCandidateAreaData>): Promise<CandidateArea | null> {
    const index = this.store.findIndex(a => a.id === id);
    if (index === -1) return null;
    const area = this.store[index];
    Object.assign(area, data, { updatedAt: new Date() });
    return area;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.store.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }
}
