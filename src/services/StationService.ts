import { inject, injectable } from 'tsyringe';
import { WSTLogger } from '@wst/logger';
import { BaseError } from '@wst/core';
import { IStationRepository } from '../domain/interfaces/IStationRepository';
import { Station, CreateStationData, UpdateStationData } from '../domain/entities/Station';
import { CreateStationRequestDTO, UpdateStationRequestDTO, StationResponseDTO, StationListResponseDTO, StationsNearLocationRequestDTO } from '../presentation/dto/StationDTO';

export interface IStationService {
  getAllStations(tenantId: number): Promise<StationListResponseDTO>;
  getStationById(id: number, tenantId: number): Promise<StationResponseDTO>;
  getStationByCode(code: string, tenantId: number): Promise<StationResponseDTO>;
  createStation(request: CreateStationRequestDTO): Promise<StationResponseDTO>;
  updateStation(id: number, request: UpdateStationRequestDTO, tenantId: number): Promise<StationResponseDTO>;
  deleteStation(id: number, tenantId: number): Promise<void>;
  getStationsNearLocation(request: StationsNearLocationRequestDTO): Promise<StationListResponseDTO>;
}

@injectable()
export class StationService implements IStationService {
  constructor(
    @inject('StationRepository')
    private stationRepository: IStationRepository,
    @inject('Logger')
    private logger: WSTLogger
  ) {}
  async getAllStations(tenantId: number): Promise<StationListResponseDTO> {
    this.logger.info(`StationService: Getting all stations for tenant ${tenantId}`);

    const stations = await this.stationRepository.findAll(tenantId);
    
    this.logger.info(`StationService: Retrieved ${stations.length} stations successfully for tenant ${tenantId}`);

    return {
      stations: stations.map(this.mapToResponseDTO),
      total: stations.length
    };
  }
  async getStationById(id: number, tenantId: number): Promise<StationResponseDTO> {
    this.logger.info(`StationService: Getting station by ID ${id} for tenant ${tenantId}`);

    const station = await this.stationRepository.findById(id, tenantId);
    
    if (!station) {
      this.logger.warn(`StationService: Station ${id} not found for tenant ${tenantId}`);
      throw new BaseError('Station not found', 404, 'STATION_NOT_FOUND');
    }

    this.logger.info(`StationService: Station ${id} retrieved successfully for tenant ${tenantId}`);
    return this.mapToResponseDTO(station);
  }
  async getStationByCode(code: string, tenantId: number): Promise<StationResponseDTO> {
    this.logger.info(`StationService: Getting station by code ${code} for tenant ${tenantId}`);

    const station = await this.stationRepository.findByCode(code, tenantId);
    
    if (!station) {
      this.logger.warn(`StationService: Station not found by code ${code} for tenant ${tenantId}`);
      throw new BaseError('Station not found', 404, 'STATION_NOT_FOUND');
    }

    this.logger.info(`StationService: Station retrieved successfully by code ${code} for tenant ${tenantId}`);
    return this.mapToResponseDTO(station);
  }
  async createStation(request: CreateStationRequestDTO): Promise<StationResponseDTO> {
    this.logger.info(`StationService: Creating new station ${request.code} for tenant ${request.tenantId}`);

    // Check if station code already exists
    const existingStation = await this.stationRepository.findByCode(request.code, request.tenantId);
    if (existingStation) {
      this.logger.warn(`StationService: Station code ${request.code} already exists for tenant ${request.tenantId}`);
      throw new BaseError('Station code already exists', 409, 'STATION_CODE_EXISTS');
    }

    const createData: CreateStationData = {
      name: request.name,
      code: request.code,
      latitude: request.latitude,
      longitude: request.longitude,
      altitude: request.altitude,
      description: request.description,
      tenantId: request.tenantId
    };

    const station = await this.stationRepository.create(createData);
    
    this.logger.info(`StationService: Station created successfully with id ${station.id}, code ${station.code} for tenant ${station.tenantId}`);

    return this.mapToResponseDTO(station);
  }
  async updateStation(id: number, request: UpdateStationRequestDTO, tenantId: number): Promise<StationResponseDTO> {
    this.logger.info(`StationService: Updating station ${id} for tenant ${tenantId}`);

    // Check if station exists
    const existingStation = await this.stationRepository.findById(id, tenantId);
    if (!existingStation) {
      this.logger.warn(`StationService: Station ${id} not found for update for tenant ${tenantId}`);
      throw new BaseError('Station not found', 404, 'STATION_NOT_FOUND');
    }

    // Check if new code conflicts with existing stations
    if (request.code && request.code !== existingStation.code) {
      const conflictingStation = await this.stationRepository.findByCode(request.code, tenantId);
      if (conflictingStation) {
        this.logger.warn(`StationService: Station code ${request.code} already exists during update for tenant ${tenantId}`);
        throw new BaseError('Station code already exists', 409, 'STATION_CODE_EXISTS');
      }
    }

    const updateData: UpdateStationData = {
      name: request.name,
      code: request.code,
      latitude: request.latitude,
      longitude: request.longitude,
      altitude: request.altitude,
      description: request.description,
      isActive: request.isActive
    };

    const updatedStation = await this.stationRepository.update(id, updateData, tenantId);
    
    if (!updatedStation) {
      this.logger.error(`StationService: Failed to update station ${id} for tenant ${tenantId}`);
      throw new BaseError('Failed to update station', 500, 'UPDATE_FAILED');
    }

    this.logger.info(`StationService: Station updated successfully with id ${updatedStation.id} for tenant ${tenantId}`);

    return this.mapToResponseDTO(updatedStation);
  }
  async deleteStation(id: number, tenantId: number): Promise<void> {
    this.logger.info(`StationService: Deleting station ${id} for tenant ${tenantId}`);

    // Check if station exists
    const existingStation = await this.stationRepository.findById(id, tenantId);
    if (!existingStation) {
      this.logger.warn(`StationService: Station ${id} not found for deletion for tenant ${tenantId}`);
      throw new BaseError('Station not found', 404, 'STATION_NOT_FOUND');
    }

    const deleted = await this.stationRepository.delete(id, tenantId);
    
    if (!deleted) {
      this.logger.error(`StationService: Failed to delete station ${id} for tenant ${tenantId}`);
      throw new BaseError('Failed to delete station', 500, 'DELETE_FAILED');
    }

    this.logger.info(`StationService: Station ${id} deleted successfully for tenant ${tenantId}`);
  }
  async getStationsNearLocation(request: StationsNearLocationRequestDTO): Promise<StationListResponseDTO> {
    this.logger.info(`StationService: Finding stations near location (${request.latitude}, ${request.longitude}) within ${request.radius}km for tenant ${request.tenantId}`);

    const stations = await this.stationRepository.findByLocation(
      request.latitude,
      request.longitude,
      request.radius,
      request.tenantId
    );

    this.logger.info(`StationService: Found ${stations.length} stations near location for tenant ${request.tenantId}`);

    return {
      stations: stations.map(this.mapToResponseDTO),
      total: stations.length
    };
  }

  private mapToResponseDTO(station: Station): StationResponseDTO {
    return {
      id: station.id,
      name: station.name,
      code: station.code,
      latitude: station.latitude,
      longitude: station.longitude,
      altitude: station.altitude,
      description: station.description,
      isActive: station.isActive,
      tenantId: station.tenantId,
      createdAt: station.createdAt,
      updatedAt: station.updatedAt
    };
  }
}
