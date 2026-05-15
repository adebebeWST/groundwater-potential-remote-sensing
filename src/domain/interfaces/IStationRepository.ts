import { Station, CreateStationData, UpdateStationData } from '../entities/Station';

export interface IStationRepository {
  findAll(tenantId: number): Promise<Station[]>;
  findById(id: number, tenantId: number): Promise<Station | null>;
  findByCode(code: string, tenantId: number): Promise<Station | null>;
  create(data: CreateStationData): Promise<Station>;
  update(id: number, data: UpdateStationData, tenantId: number): Promise<Station | null>;
  delete(id: number, tenantId: number): Promise<boolean>;
  findByLocation(latitude: number, longitude: number, radiusKm: number, tenantId: number): Promise<Station[]>;
}
