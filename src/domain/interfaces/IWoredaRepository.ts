import { Woreda, CreateWoredaData } from '../entities/Woreda';

export interface IWoredaRepository {
  findAll(): Promise<Woreda[]>;
  findById(id: number): Promise<Woreda | null>;
  searchByName(query: string, limit?: number): Promise<Woreda[]>;
  create(data: CreateWoredaData): Promise<Woreda>;
  update(id: number, data: Partial<CreateWoredaData>): Promise<Woreda | null>;
  delete(id: number): Promise<boolean>;
}
