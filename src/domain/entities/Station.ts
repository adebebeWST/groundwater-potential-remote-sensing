import { Entity as WSTEntity } from '@wst/core';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('stations')
export class Station extends WSTEntity {
  @PrimaryGeneratedColumn()
  declare public id: number;
  @Column('nvarchar', { length: 255 })
  public name!: string;

  @Column('nvarchar', { length: 100, unique: true })
  public code!: string;

  @Column('decimal', { precision: 10, scale: 8 })
  public latitude!: number;

  @Column('decimal', { precision: 11, scale: 8 })
  public longitude!: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  public altitude?: number;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  public description?: string;

  @Column('bit', { default: true })
  public isActive!: boolean;
  @Column('int')
  public tenantId!: number;

  @Column('int')
  public projectId!: number;
  @CreateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  public updatedAt!: Date;
  constructor(
    name: string,
    code: string,
    latitude: number,
    longitude: number,
    tenantId: number,
    projectId: number,
    altitude?: number,
    description?: string
  ) {
    super();
    if (name && code && latitude !== undefined && longitude !== undefined && tenantId && projectId) {
      this.name = name;
      this.code = code;
      this.latitude = latitude;
      this.longitude = longitude;
      this.tenantId = tenantId;
      this.projectId = projectId;
      this.altitude = altitude;
      this.description = description;
      this.isActive = true;
    }
  }

  // Static factory method for creating new stations
  public static create(data: CreateStationData, projectId: number = 1): Station {
    return new Station(
      data.name,
      data.code,
      data.latitude,
      data.longitude,
      data.tenantId,
      projectId,
      data.altitude,
      data.description
    );
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getCode(): string {
    return this.code;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public getAltitude(): number | undefined {
    return this.altitude;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
  public getTenantId(): number {
    return this.tenantId;
  }

  public getProjectId(): number {
    return this.projectId;
  }

  // Business methods
  public updateDetails(name?: string, description?: string): void {
    if (name) this.name = name;
    if (description !== undefined) this.description = description;
  }

  public updateLocation(latitude?: number, longitude?: number, altitude?: number): void {
    if (latitude !== undefined) this.latitude = latitude;
    if (longitude !== undefined) this.longitude = longitude;
    if (altitude !== undefined) this.altitude = altitude;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public isWithinRadius(targetLat: number, targetLon: number, radiusKm: number): boolean {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(targetLat - this.latitude);
    const dLon = this.toRadians(targetLon - this.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(this.latitude)) * Math.cos(this.toRadians(targetLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance <= radiusKm;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export interface CreateStationData {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  tenantId: number;
  altitude?: number;
  description?: string;
}

export interface UpdateStationData {
  name?: string;
  code?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  description?: string;
  isActive?: boolean;
}

export interface CreateStationRequest {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  description?: string;
}

export interface UpdateStationRequest {
  name?: string;
  code?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  description?: string;
  isActive?: boolean;
}
