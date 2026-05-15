import { Router } from 'express';
import { StationController } from '../controllers/StationController';
import { ValidateRequest } from '@wst/middleware';
import { CreateStationRequestDTO, UpdateStationRequestDTO, StationsNearLocationRequestDTO } from '../dto/StationDTO';
import { container } from 'tsyringe';
import { WSTLogger } from '@wst/logger';

const router = Router();
const logger = container.resolve<WSTLogger>('Logger');

logger.info('Loading station.routes.ts file');

/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         altitude:
 *           type: number
 *           minimum: -500
 *           maximum: 9000
 *         description:
 *           type: string
 *         isActive:
 *           type: boolean
 *         tenantId:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateStationRequest:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - latitude
 *         - longitude
 *         - tenantId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         code:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         altitude:
 *           type: number
 *           minimum: -500
 *           maximum: 9000
 *         description:
 *           type: string
 *           maxLength: 500
 *         tenantId:
 *           type: number
 *           minimum: 1
 */

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Get all stations
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         schema:
 *           type: number
 *         description: Tenant ID
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: number
 *         description: Tenant ID (alternative to header)
 *     responses:
 *       200:
 *         description: List of stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Station'
 *                 total:
 *                   type: number
 */
router.get(
  '/stations',
  [],
  (req: any, res: any) => {
    logger.info('Route GET /stations reached!');
    const stationController = container.resolve(StationController);
    stationController.getAllStations(req, res);
  }
);

/**
 * @swagger
 * /stations/{id}:
 *   get:
 *     summary: Get station by ID
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Station ID
 *       - in: header
 *         name: x-tenant-id
 *         schema:
 *           type: number
 *         description: Tenant ID
 *     responses:
 *       200:
 *         description: Station details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 */
router.get(
  '/stations/:id',
  [],
  (req: any, res: any) => {
    logger.info('Route GET /stations/:id reached!');
    const stationController = container.resolve(StationController);
    stationController.getStationById(req, res);
  }
);

/**
 * @swagger
 * /stations/by-code/{code}:
 *   get:
 *     summary: Get station by code
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Station code
 *       - in: header
 *         name: x-tenant-id
 *         schema:
 *           type: number
 *         description: Tenant ID
 *     responses:
 *       200:
 *         description: Station details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 */
router.get(
  '/stations/by-code/:code',
  [],
  (req: any, res: any) => {
    logger.info('Route GET /stations/by-code/:code reached!');
    const stationController = container.resolve(StationController);
    stationController.getStationByCode(req, res);
  }
);

/**
 * @swagger
 * /stations:
 *   post:
 *     summary: Create a new station
 *     tags:
 *       - Stations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStationRequest'
 *     responses:
 *       201:
 *         description: Station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Station code already exists
 */
router.post(
  '/stations',
  [
    ValidateRequest(CreateStationRequestDTO)
  ],
  (req: any, res: any) => {
    logger.info('Route POST /stations reached!');
    const stationController = container.resolve(StationController);
    stationController.execute(req, res);
  }
);

/**
 * @swagger
 * /stations/{id}:
 *   put:
 *     summary: Update a station
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Station ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               altitude:
 *                 type: number
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *       409:
 *         description: Station code already exists
 */
router.put(
  '/stations/:id',
  [
    ValidateRequest(UpdateStationRequestDTO)
  ],
  (req: any, res: any) => {
    logger.info('Route PUT /stations/:id reached!');
    const stationController = container.resolve(StationController);
    stationController.updateStation(req, res);
  }
);

/**
 * @swagger
 * /stations/{id}:
 *   delete:
 *     summary: Delete a station
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Station ID
 *       - in: header
 *         name: x-tenant-id
 *         schema:
 *           type: number
 *         description: Tenant ID
 *     responses:
 *       204:
 *         description: Station deleted successfully
 *       404:
 *         description: Station not found
 */
router.delete(
  '/stations/:id',
  [],
  (req: any, res: any) => {
    logger.info('Route DELETE /stations/:id reached!');
    const stationController = container.resolve(StationController);
    stationController.deleteStation(req, res);
  }
);

/**
 * @swagger
 * /stations/near:
 *   post:
 *     summary: Find stations near a location
 *     tags:
 *       - Stations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *               - radius
 *               - tenantId
 *             properties:
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *               radius:
 *                 type: number
 *                 minimum: 0.001
 *                 maximum: 10
 *                 description: Search radius in degrees
 *               tenantId:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Stations near the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Station'
 *                 total:
 *                   type: number
 */
router.post(
  '/stations/near',
  [
    ValidateRequest(StationsNearLocationRequestDTO)
  ],
  (req: any, res: any) => {
    logger.info('Route POST /stations/near reached!');
    const stationController = container.resolve(StationController);
    stationController.getStationsNearLocation(req, res);
  }
);

logger.info('Station routes registered');

export { router as stationRoutes };
