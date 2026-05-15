import { Router } from 'express';
import { container } from 'tsyringe';
import { WSTLogger } from '@wst/logger';
import { MapController } from '../controllers/MapController';

const router = Router();
const logger = container.resolve<WSTLogger>('Logger');

logger.info('Loading map.routes.ts');

/**
 * @swagger
 * tags:
 *   - name: Map
 *     description: Groundwater Spatial Decision Support System map endpoints
 *   - name: GEE
 *     description: Google Earth Engine proxy endpoints for dynamic scenario computation
 *   - name: Report
 *     description: Report generation and share URL endpoints
 */

/**
 * @swagger
 * /api/map/layers:
 *   get:
 *     summary: List available map layers with metadata
 *     tags: [Map]
 *     parameters:
 *       - in: query
 *         name: scenario
 *         schema:
 *           type: string
 *           enum: [ssp126, ssp245, ssp370, ssp585]
 *         description: Climate scenario ID
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           enum: [2030, 2050, 2080]
 *         description: Target year for scenario layer
 *     responses:
 *       200:
 *         description: Array of layer metadata objects
 */
router.get('/api/map/layers', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.getLayers(req, res);
});

/**
 * @swagger
 * /api/map/feature-info:
 *   get:
 *     summary: Get groundwater data at a clicked map location
 *     tags: [Map]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Feature info including GWP suitability, yield, confidence
 *       400:
 *         description: Invalid or missing coordinates
 */
router.get('/api/map/feature-info', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.getFeatureInfo(req, res);
});

/**
 * @swagger
 * /api/map/candidate-areas:
 *   get:
 *     summary: Get candidate areas filtered by priority or woreda
 *     tags: [Map]
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *       - in: query
 *         name: woreda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate area list with counts per priority
 */
router.get('/api/map/candidate-areas', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.getCandidateAreas(req, res);
});

/**
 * @swagger
 * /api/map/search/woreda:
 *   get:
 *     summary: Autocomplete search for Ethiopian woreda (district) names
 *     tags: [Map]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Minimum 2-character search term
 *     responses:
 *       200:
 *         description: Matching woreda list
 *       400:
 *         description: Query too short
 */
router.get('/api/map/search/woreda', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.searchWoreda(req, res);
});

/**
 * @swagger
 * /api/map/boreholes:
 *   get:
 *     summary: Get borehole points as GeoJSON (optionally filtered by bbox)
 *     tags: [Map]
 *     parameters:
 *       - in: query
 *         name: bbox
 *         schema:
 *           type: string
 *         description: "Bounding box: minLng,minLat,maxLng,maxLat"
 *     responses:
 *       200:
 *         description: GeoJSON FeatureCollection of boreholes
 */
router.get('/api/map/boreholes', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.getBoreholes(req, res);
});

/**
 * @swagger
 * /api/map/ves-points:
 *   get:
 *     summary: Get VES points as GeoJSON (optionally filtered by bbox)
 *     tags: [Map]
 *     parameters:
 *       - in: query
 *         name: bbox
 *         schema:
 *           type: string
 *         description: "Bounding box: minLng,minLat,maxLng,maxLat"
 *     responses:
 *       200:
 *         description: GeoJSON FeatureCollection of VES points
 */
router.get('/api/map/ves-points', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.getVESPoints(req, res);
});

/**
 * @swagger
 * /api/map/scenarios:
 *   get:
 *     summary: List all available climate scenarios and their parameters
 *     tags: [Map]
 *     responses:
 *       200:
 *         description: Array of ClimateScenario objects
 */
router.get('/api/map/scenarios', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.getScenarios(req, res);
});

/**
 * @swagger
 * /api/gee/compute-scenario:
 *   post:
 *     summary: Compute dynamic scenario tile URL via GEE proxy
 *     tags: [GEE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scenario, year]
 *             properties:
 *               scenario:
 *                 type: string
 *                 enum: [ssp126, ssp245, ssp370, ssp585]
 *               year:
 *                 type: integer
 *                 enum: [2030, 2050, 2080]
 *               bbox:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tile URL and scenario metadata
 */
router.post('/api/gee/compute-scenario', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.computeScenario(req, res);
});

/**
 * @swagger
 * /api/report/generate:
 *   post:
 *     summary: Generate PDF report for current map state and candidate selections
 *     tags: [Report]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mapState:
 *                 type: object
 *               candidateSelections:
 *                 type: array
 *                 items:
 *                   type: integer
 *               scenario:
 *                 type: string
 *               year:
 *                 type: integer
 *               userEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report generation result with download URL
 */
router.post('/api/report/generate', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.generateReport(req, res);
});

/**
 * @swagger
 * /api/report/share/{token}:
 *   get:
 *     summary: Retrieve shared map state by token
 *     tags: [Report]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shared state object
 */
router.get('/api/report/share/:token', [], (req: any, res: any) => {
  const ctrl = container.resolve(MapController);
  ctrl.getSharedState(req, res);
});

logger.info('Map routes registered');

export { router as mapRoutes };
