import { Entity as WSTEntity } from '@wst/core';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('woredas')
export class Woreda extends WSTEntity {
  @PrimaryGeneratedColumn()
  declare public id: number;

  @Column('varchar', { length: 100 })
  public name!: string;

  @Column('varchar', { length: 50, nullable: true })
  public region?: string;

  @Column('varchar', { length: 50, nullable: true })
  public zone?: string;

  @Column('simple-json', { nullable: true })
  public geom?: Record<string, unknown>; // GeoJSON MultiPolygon

  constructor(name: string, region?: string, zone?: string, geom?: Record<string, unknown>) {
    super();
    if (name) {
      this.name = name;
      this.region = region;
      this.zone = zone;
      this.geom = geom;
    }
  }

  public static create(data: CreateWoredaData): Woreda {
    return new Woreda(data.name, data.region, data.zone, data.geom);
  }

  public getFullName(): string {
    const parts = [this.name];
    if (this.zone) parts.push(this.zone);
    if (this.region) parts.push(this.region);
    return parts.join(', ');
  }
}

export interface CreateWoredaData {
  name: string;
  region?: string;
  zone?: string;
  geom?: Record<string, unknown>;
}
