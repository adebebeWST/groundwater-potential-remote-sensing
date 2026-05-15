import { Router } from 'express';
import { HelloWorldController } from '../controllers/HelloWorldController';
import { ValidateRequest } from '@wst/middleware';
import { HelloWorldRequestBodyDTO } from '../dto/HelloWorldDTO';
import { container } from 'tsyringe';
import { WSTLogger } from '@wst/logger';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = Router();
const logger = container.resolve<WSTLogger>('Logger');

logger.info('Loading auth.routes.ts file');

/**
 * @swagger
 * /hello-world:
 *   post:
 *     summary: Hello world example endpoint
 *     tags:
 *       - API
 *     description: Example endpoint that demonstrates validation and error handling
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: number
 *               projectId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: number
 *                 tenantId:
 *                   type: number
 *                 projectId:
 *                   type: number
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/hello-world',  [
    ValidateRequest(HelloWorldRequestBodyDTO)
  ],  (req: any, res: any) => {
    logger.info('Route /hello-world reached!');
    const helloWorldController = container.resolve(HelloWorldController);
    helloWorldController.execute(req, res);
  }
);

// Test route for development
router.post(
  '/hello-world-test',
  [],
  (req: any, res: any) => {
    logger.info('Test route /hello-world-test reached!');
    
    // Mock headers for testing (simulating API Gateway/Lambda authorizer)
    req.headers['x-user-id'] = '1';
    req.headers['x-tenant-id'] = '1';
    req.headers['x-project-id'] = '1';
    
    const helloWorldController = container.resolve(HelloWorldController);
    helloWorldController.execute(req, res);
  }
);

logger.info('API routes registered');

export { router as apiRoutes };
