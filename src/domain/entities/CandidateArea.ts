import { Entity as WSTEntity } from '@wst/core';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Priority } from './GroundwaterPoint';

@Entity('candidate_areas')
export class CandidateArea extends WSTEntity {
  @PrimaryGeneratedColumn()
  declare public id: number;

  @Column('int')
  public priority!: Priority;

  @Column('int', { nullable: true })
  public woreda_id?: number;

  @Column('varchar', { length: 100, nullable: true })
  public woreda_name?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  public area_km2?: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  public avg_yield_lps?: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  public confidence!: number;

  @Column('int', { default: 0 })
  public borehole_count!: number;

  @Column('simple-json', { nullable: true })
  public geom?: Record<string, unknown>; // GeoJSON Polygon

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  constructor(
    priority: Priority,
    confidence: number,
    borehole_count: number,
    woreda_id?: number,
    woreda_name?: string,
    area_km2?: number,
    avg_yield_lps?: number,
    geom?: Record<string, unknown>
  ) {
    super();
    if (priority !== undefined) {
      this.priority = priority;
      this.confidence = confidence;
      this.borehole_count = borehole_count;
      this.woreda_id = woreda_id;
      this.woreda_name = woreda_name;
      this.area_km2 = area_km2;
      this.avg_yield_lps = avg_yield_lps;
      this.geom = geom;
    }
  }

  public static create(data: CreateCandidateAreaData): CandidateArea {
    return new CandidateArea(
      data.priority,
      data.confidence,
      data.borehole_count,
      data.woreda_id,
      data.woreda_name,
      data.area_km2,
      data.avg_yield_lps,
      data.geom
    );
  }

  public getPriorityLabel(): string {
    const labels: Record<number, string> = {
      1: 'Priority 1 – High Suitability',
      2: 'Priority 2 – Moderate Suitability',
      3: 'Priority 3 – Lower Suitability'
    };
    return labels[this.priority] || `Priority ${this.priority}`;
  }
}

export interface CreateCandidateAreaData {
  priority: Priority;
  confidence: number;
  borehole_count: number;
  woreda_id?: number;
  woreda_name?: string;
  area_km2?: number;
  avg_yield_lps?: number;
  geom?: Record<string, unknown>;
}
