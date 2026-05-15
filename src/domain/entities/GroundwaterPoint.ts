import { Entity as WSTEntity } from '@wst/core';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export type GWPSuitability = 'high' | 'moderate' | 'low';
export type PointType = 'borehole' | 'ves_point';
export type Priority = 1 | 2 | 3;
export type UncertaintyCategory =
  | 'high_pot_low_uncert'
  | 'high_pot_med_uncert'
  | 'high_pot_high_uncert';

@Entity('groundwater_points')
export class GroundwaterPoint extends WSTEntity {
  @PrimaryGeneratedColumn()
  declare public id: number;

  @Column('varchar', { length: 20 })
  public type!: PointType;

  @Column('decimal', { precision: 11, scale: 8 })
  public longitude!: number;

  @Column('decimal', { precision: 10, scale: 8 })
  public latitude!: number;

  @Column('int', { nullable: true })
  public woreda_id?: number;

  @Column('varchar', { length: 10 })
  public gwp_suitability!: GWPSuitability;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  public yield_lps?: number;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  public depth_m?: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  public confidence!: number;

  @Column('int', { default: 3 })
  public priority!: Priority;

  @Column('varchar', { length: 50, nullable: true })
  public uncertainty_category?: UncertaintyCategory;

  @Column('simple-json', { nullable: true })
  public metadata?: Record<string, unknown>;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  constructor(
    type: PointType,
    longitude: number,
    latitude: number,
    gwp_suitability: GWPSuitability,
    confidence: number,
    priority: Priority,
    woreda_id?: number,
    yield_lps?: number,
    depth_m?: number,
    uncertainty_category?: UncertaintyCategory,
    metadata?: Record<string, unknown>
  ) {
    super();
    if (type && longitude !== undefined && latitude !== undefined && gwp_suitability) {
      this.type = type;
      this.longitude = longitude;
      this.latitude = latitude;
      this.gwp_suitability = gwp_suitability;
      this.confidence = confidence;
      this.priority = priority;
      this.woreda_id = woreda_id;
      this.yield_lps = yield_lps;
      this.depth_m = depth_m;
      this.uncertainty_category = uncertainty_category;
      this.metadata = metadata;
    }
  }

  public static create(data: CreateGroundwaterPointData): GroundwaterPoint {
    return new GroundwaterPoint(
      data.type,
      data.longitude,
      data.latitude,
      data.gwp_suitability,
      data.confidence,
      data.priority,
      data.woreda_id,
      data.yield_lps,
      data.depth_m,
      data.uncertainty_category,
      data.metadata
    );
  }

  public getCoordinates(): [number, number] {
    return [this.longitude, this.latitude];
  }

  public getSuitabilityLabel(): string {
    const labels: Record<GWPSuitability, string> = {
      high: 'High Potential',
      moderate: 'Moderate Potential',
      low: 'Low Potential'
    };
    return labels[this.gwp_suitability];
  }

  public getConfidenceCategory(): string {
    if (this.confidence >= 75) return 'High';
    if (this.confidence >= 50) return 'Moderate';
    return 'Low';
  }
}

export interface CreateGroundwaterPointData {
  type: PointType;
  longitude: number;
  latitude: number;
  gwp_suitability: GWPSuitability;
  confidence: number;
  priority: Priority;
  woreda_id?: number;
  yield_lps?: number;
  depth_m?: number;
  uncertainty_category?: UncertaintyCategory;
  metadata?: Record<string, unknown>;
}
