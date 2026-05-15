import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { BaseController } from '@wst/middleware';
import { IStationService } from '../../services/StationService';
import { CreateStationRequestDTO, UpdateStationRequestDTO, StationsNearLocationRequestDTO } from '../dto/StationDTO';

@injectable()
export class StationController extends BaseController {
  constructor(
    @inject('StationService')
    private stationService: IStationService
  ) {
    super();
  }

  // GET /stations
  async getAllStations(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = Number(req.headers['x-tenant-id']) || Number(req.query.tenantId) || 1;
      
      const result = await this.stationService.getAllStations(tenantId);
      
      this.ok(res, result);
    } catch (error) {
      throw error;
    }
  }
  // GET /stations/:id
  async getStationById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const tenantId = Number(req.headers['x-tenant-id']) || Number(req.query.tenantId) || 1;
        if (!id || isNaN(id)) {
        this.fail(res, 'Invalid station ID', 400);
        return;
      }

      const result = await this.stationService.getStationById(id, tenantId);
      
      this.ok(res, result);
    } catch (error) {
      throw error;
    }
  }
  // GET /stations/by-code/:code
  async getStationByCode(req: Request, res: Response): Promise<void> {
    try {
      const code = req.params.code;
      const tenantId = Number(req.headers['x-tenant-id']) || Number(req.query.tenantId) || 1;
      
      if (!code) {
        this.fail(res, 'Station code is required', 400);
        return;
      }

      const result = await this.stationService.getStationByCode(code, tenantId);
      
      this.ok(res, result);
    } catch (error) {
      throw error;
    }
  }

  // POST /stations
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      // Default tenant ID from headers or body
      const tenantId = Number(req.headers['x-tenant-id']) || Number(req.body.tenantId) || 1;
      
      const requestData: CreateStationRequestDTO = {
        ...req.body,
        tenantId
      };

      const result = await this.stationService.createStation(requestData);
      
      this.created(res, result);
    } catch (error) {
      throw error;
    }
  }
  // PUT /stations/:id
  async updateStation(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const tenantId = Number(req.headers['x-tenant-id']) || Number(req.body.tenantId) || 1;
      
      if (!id || isNaN(id)) {
        this.fail(res, 'Invalid station ID', 400);
        return;
      }

      const requestData: UpdateStationRequestDTO = req.body;

      const result = await this.stationService.updateStation(id, requestData, tenantId);
      
      this.ok(res, result);
    } catch (error) {
      throw error;
    }
  }
  // DELETE /stations/:id
  async deleteStation(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const tenantId = Number(req.headers['x-tenant-id']) || Number(req.query.tenantId) || 1;
      
      if (!id || isNaN(id)) {
        this.fail(res, 'Invalid station ID', 400);
        return;
      }

      await this.stationService.deleteStation(id, tenantId);
      
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  }

  // POST /stations/near
  async getStationsNearLocation(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = Number(req.headers['x-tenant-id']) || Number(req.body.tenantId) || 1;
      
      const requestData: StationsNearLocationRequestDTO = {
        ...req.body,
        tenantId
      };

      const result = await this.stationService.getStationsNearLocation(requestData);
      
      this.ok(res, result);
    } catch (error) {
      throw error;
    }
  }
}
