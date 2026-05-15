import { injectable } from 'tsyringe';
import { IWoredaRepository } from '../../domain/interfaces/IWoredaRepository';
import { Woreda, CreateWoredaData } from '../../domain/entities/Woreda';

/**
 * In-memory woreda (Ethiopian district) repository with seed data.
 * Replace with a PostGIS-backed implementation for production use.
 */
@injectable()
export class WoredaRepository implements IWoredaRepository {
  private store: Woreda[] = this.seed();

  private seed(): Woreda[] {
    const rawData: Array<[string, string, string]> = [
      ['Akaki-Kaliti',  'Addis Ababa', 'Addis Ababa'],
      ['Bole',          'Addis Ababa', 'Addis Ababa'],
      ['Nifas Silk',    'Addis Ababa', 'Addis Ababa'],
      ['Yeka',          'Addis Ababa', 'Addis Ababa'],
      ['Kolfe Keranio', 'Addis Ababa', 'Addis Ababa'],
      ['Gulele',        'Addis Ababa', 'Addis Ababa'],
      ['Lideta',        'Addis Ababa', 'Addis Ababa'],
      ['Kirkos',        'Addis Ababa', 'Addis Ababa'],
      ['Arada',         'Addis Ababa', 'Addis Ababa'],
      ['Addis Ketema',  'Addis Ababa', 'Addis Ababa'],
      ['Adama',         'Oromia',      'East Shewa'],
      ['Bishoftu',      'Oromia',      'East Shewa'],
      ['Sebeta',        'Oromia',      'West Shewa'],
      ['Ambo',          'Oromia',      'West Shewa'],
      ['Jimma',         'Oromia',      'Jimma'],
      ['Hawassa',       'Sidama',      'Hawassa'],
      ['Shashemene',    'Oromia',      'West Arsi'],
      ['Bahir Dar',     'Amhara',      'South Gondar'],
      ['Gondar',        'Amhara',      'Central Gondar'],
      ['Dessie',        'Amhara',      'South Wollo'],
      ['Mekelle',       'Tigray',      'Central Tigray'],
      ['Dire Dawa',     'Dire Dawa',   'Dire Dawa'],
    ];

    return rawData.map((row, i) => {
      const w = new Woreda(row[0], row[1], row[2]);
      (w as any).id = i + 1;
      return w;
    });
  }

  async findAll(): Promise<Woreda[]> {
    return [...this.store];
  }

  async findById(id: number): Promise<Woreda | null> {
    return this.store.find(w => w.id === id) ?? null;
  }

  async searchByName(query: string, limit = 10): Promise<Woreda[]> {
    if (!query || query.trim().length === 0) return [];
    const lower = query.trim().toLowerCase();
    return this.store
      .filter(w => w.name.toLowerCase().includes(lower) || w.region?.toLowerCase().includes(lower) || false)
      .slice(0, limit);
  }

  async create(data: CreateWoredaData): Promise<Woreda> {
    const woreda = Woreda.create(data);
    const maxId = this.store.reduce((m, w) => Math.max(m, w.id ?? 0), 0);
    (woreda as any).id = maxId + 1;
    this.store.push(woreda);
    return woreda;
  }

  async update(id: number, data: Partial<CreateWoredaData>): Promise<Woreda | null> {
    const index = this.store.findIndex(w => w.id === id);
    if (index === -1) return null;
    Object.assign(this.store[index], data);
    return this.store[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.store.findIndex(w => w.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }
}
