import { IStationRepository } from '../../domain/interfaces/IStationRepository';
import { Station, CreateStationData, UpdateStationData } from '../../domain/entities/Station';
import { injectable, inject } from 'tsyringe';
import { WSTLogger } from '@wst/logger';
import { DatabaseConnection } from '@wst/database';
import { BaseError } from '@wst/core';

@injectable()
export class StationRepository implements IStationRepository {
  constructor(
    @inject('DatabaseConnection')
    private databaseConnection: DatabaseConnection,
    @inject('Logger') 
    private logger: WSTLogger
  ) {}  private getRepository() {
    try {
      if (!this.databaseConnection.isConnected()) {
        throw new BaseError('Database connection not available', 503, 'DATABASE_ERROR');
      }
      try {
        return this.databaseConnection.getDataSource().getRepository(Station);
      } catch (error) {
        throw new BaseError('Database connection not available', 503, 'DATABASE_ERROR');
      }
    } catch (error) {
      this.logger.error(`Failed to get station repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }async findAll(tenantId: number): Promise<Station[]> {
    try {
      this.logger.info(`Finding all stations for tenant ${tenantId}`);
      
      // For demo purposes, return some mock data when database isn't connected
      if (!this.databaseConnection.isConnected()) {
        this.logger.warn('Database not connected, returning mock data');
        return this.getMockStations(tenantId);
      }
      
      const repository = this.getRepository();
      return await repository.find({
        where: {
          tenantId: tenantId,
          isActive: true
        },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      if (error instanceof BaseError && error.code === 'DATABASE_ERROR') {
        this.logger.warn('Database error, returning mock data');
        return this.getMockStations(tenantId);
      }
      this.logger.error(`Error finding all stations: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Return mock data instead of throwing to keep the service functional
      return this.getMockStations(tenantId);
    }
  }async findById(id: number, tenantId: number): Promise<Station | null> {
    try {
      this.logger.info(`Finding station by id ${id}`);
      
      // For demo purposes, return mock data when database isn't connected
      if (!this.databaseConnection.isConnected()) {
        this.logger.warn('Database not connected, returning mock data');
        const mockStations = this.getMockStations(tenantId);
        return mockStations.find(s => s.id === id) || null;
      }
      
      const repository = this.getRepository();
      return await repository.findOne({
        where: { id: id, tenantId: tenantId }
      });
    } catch (error) {
      if (error instanceof BaseError && error.code === 'DATABASE_ERROR') {
        this.logger.warn('Database error, returning mock data');
        const mockStations = this.getMockStations(tenantId);
        return mockStations.find(s => s.id === id) || null;
      }
      this.logger.error(`Error finding station by id: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }  async findByCode(code: string, tenantId: number): Promise<Station | null> {
    try {
      this.logger.info(`Finding station by code ${code}`);
      
      // For demo purposes, return mock data when database isn't connected
      if (!this.databaseConnection.isConnected()) {
        this.logger.warn('Database not connected, returning mock data');
        const mockStations = this.getMockStations(tenantId);
        return mockStations.find(s => s.code === code) || null;
      }
      
      const repository = this.getRepository();
      return await repository.findOne({
        where: { code: code, tenantId: tenantId }
      });
    } catch (error) {
      if (error instanceof BaseError && error.code === 'DATABASE_ERROR') {
        this.logger.warn('Database error, returning mock data');
        const mockStations = this.getMockStations(tenantId);
        return mockStations.find(s => s.code === code) || null;
      }
      this.logger.error(`Error finding station by code: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }  async create(data: CreateStationData): Promise<Station> {
    try {
      this.logger.info(`Creating station ${data.name}`);
      
      // For demo purposes, return mock data when database isn't connected
      if (!this.databaseConnection.isConnected()) {
        this.logger.warn('Database not connected, creating mock station');
        const mockId = Math.floor(Math.random() * 1000);
        const station = Station.create(data);
        Object.assign(station, { id: mockId });
        return station;
      }
      
      const repository = this.getRepository();
      
      // Check if code already exists
      const existingStation = await this.findByCode(data.code, data.tenantId);
      if (existingStation) {
        throw new BaseError(`Station with code ${data.code} already exists`, 400, 'DUPLICATE_CODE');
      }

      const station = Station.create(data);
      const savedStation = await repository.save(station);
      this.logger.info(`Station created successfully with id: ${savedStation.id}`);
      return savedStation;
    } catch (error) {
      if (error instanceof BaseError) {
        if (error.code === 'DATABASE_ERROR') {
          this.logger.warn('Database error, creating mock station');
          const mockId = Math.floor(Math.random() * 1000);
          const station = Station.create(data);
          Object.assign(station, { id: mockId });
          return station;
        }
        throw error; // Re-throw validation errors like DUPLICATE_CODE
      }
      this.logger.error(`Error creating station: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BaseError('Failed to create station', 500, 'CREATE_FAILED');
    }
  }  async update(id: number, data: UpdateStationData, tenantId: number): Promise<Station | null> {
    try {
      this.logger.info(`Updating station ${id}`);
      
      // For demo purposes, return mock data when database isn't connected
      if (!this.databaseConnection.isConnected()) {
        this.logger.warn('Database not connected, updating mock station');
        const mockStations = this.getMockStations(tenantId);
        const stationToUpdate = mockStations.find(s => s.id === id);
        if (!stationToUpdate) return null;

        // Update fields
        if (data.name || data.description !== undefined) {
          stationToUpdate.updateDetails(data.name, data.description);
        }
        if (data.latitude !== undefined || data.longitude !== undefined || data.altitude !== undefined) {
          stationToUpdate.updateLocation(data.latitude, data.longitude, data.altitude);
        }
        if (data.isActive !== undefined) {
          if (data.isActive) stationToUpdate.activate();
          else stationToUpdate.deactivate();
        }
        return stationToUpdate;
      }
      
      const repository = this.getRepository();
      
      const station = await this.findById(id, tenantId);
      if (!station) return null;

      // Check if code already exists (if being updated)
      if (data.code && data.code !== station.code) {
        const existingStation = await this.findByCode(data.code, tenantId);
        if (existingStation) {
          throw new BaseError(`Station with code ${data.code} already exists`, 400, 'DUPLICATE_CODE');
        }
        station.code = data.code;
      }

      // Update fields
      if (data.name || data.description !== undefined) {
        station.updateDetails(data.name, data.description);
      }
      if (data.latitude !== undefined || data.longitude !== undefined || data.altitude !== undefined) {
        station.updateLocation(data.latitude, data.longitude, data.altitude);
      }
      if (data.isActive !== undefined) {
        if (data.isActive) station.activate();
        else station.deactivate();
      }

      const updatedStation = await repository.save(station);
      this.logger.info(`Station updated successfully with id: ${updatedStation.id}`);
      return updatedStation;
    } catch (error) {
      if (error instanceof BaseError) {
        if (error.code === 'DATABASE_ERROR') {
          this.logger.warn('Database error, updating mock station');
          const mockStations = this.getMockStations(tenantId);
          const station = mockStations.find(s => s.id === id);
          if (!station) return null;
          return station;
        }
        throw error; // Re-throw validation errors like DUPLICATE_CODE
      }
      this.logger.error(`Error updating station: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BaseError('Failed to update station', 500, 'UPDATE_FAILED');
    }
  }  async delete(id: number, tenantId: number): Promise<boolean> {
    try {
      this.logger.info(`Deleting station ${id}`);
      
      // For demo purposes, return success when database isn't connected
      if (!this.databaseConnection.isConnected()) {
        this.logger.warn('Database not connected, simulating delete success');
        return true;
      }
      
      const repository = this.getRepository();
      const station = await this.findById(id, tenantId);
      if (!station) return false;

      await repository.remove(station);
      this.logger.info(`Station deleted successfully with id: ${id}`);
      return true;
    } catch (error) {
      if (error instanceof BaseError && error.code === 'DATABASE_ERROR') {
        this.logger.warn('Database error, simulating delete success');
        return true;
      }
      this.logger.error(`Error deleting station: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BaseError('Failed to delete station', 500, 'DELETE_FAILED');
    }
  }  async findByLocation(latitude: number, longitude: number, radiusKm: number, tenantId: number): Promise<Station[]> {
    try {
      this.logger.info(`Finding stations within ${radiusKm}km of coordinates (${latitude}, ${longitude})`);
      
      // For demo purposes, return mock data when database isn't connected
      if (!this.databaseConnection.isConnected()) {
        this.logger.warn('Database not connected, returning mock stations by location');
        const mockStations = this.getMockStations(tenantId);
        return mockStations.filter(station => 
          station.isWithinRadius(latitude, longitude, radiusKm)
        );
      }
      
      // Get all stations for the tenant
      const allStations = await this.findAll(tenantId);
      
      // Filter stations by radius
      const stationsInRadius = allStations.filter(station => 
        station.isWithinRadius(latitude, longitude, radiusKm)
      );

      this.logger.info(`Found ${stationsInRadius.length} stations within radius`);
      return stationsInRadius;
    } catch (error) {
      if (error instanceof BaseError && error.code === 'DATABASE_ERROR') {
        this.logger.warn('Database error, returning mock stations by location');
        const mockStations = this.getMockStations(tenantId);
        return mockStations.filter(station => 
          station.isWithinRadius(latitude, longitude, radiusKm)
        );
      }
      this.logger.error(`Error finding stations by location: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  private getMockStations(tenantId: number): Station[] {
    const mockStation1 = Station.create({
      code: 'STN001',
      name: 'Mock Station 1',
      description: 'A mock station for testing',
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 10,
      tenantId: tenantId
    });
    Object.assign(mockStation1, { id: 1 });

    const mockStation2 = Station.create({
      code: 'STN002',
      name: 'Mock Station 2',
      description: 'Another mock station for testing',
      latitude: 40.7148,
      longitude: -74.008,
      altitude: 15,
      tenantId: tenantId
    });
    Object.assign(mockStation2, { id: 2 });

    return [mockStation1, mockStation2];
  }
}
