import { CandidateArea, CreateCandidateAreaData } from '../entities/CandidateArea';
import type { Priority } from '../entities/GroundwaterPoint';

export interface CandidateAreaFilter {
  priority?: Priority;
  woreda_id?: number;
  woreda_name?: string;
}

export interface ICandidateAreaRepository {
  findAll(): Promise<CandidateArea[]>;
  findById(id: number): Promise<CandidateArea | null>;
  findByFilter(filter: CandidateAreaFilter): Promise<CandidateArea[]>;
  countByPriority(): Promise<Record<number, number>>;
  create(data: CreateCandidateAreaData): Promise<CandidateArea>;
  update(id: number, data: Partial<CreateCandidateAreaData>): Promise<CandidateArea | null>;
  delete(id: number): Promise<boolean>;
}
