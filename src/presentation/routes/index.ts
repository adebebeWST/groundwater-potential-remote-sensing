import { swaggerRoutes } from '../../infrastructure/config/swagger';
import { apiRoutes } from './api.routes';
import { stationRoutes } from './station.routes';
import { Router } from 'express';
import { errorMiddleware, errorLoggingMiddleware } from '@wst/middleware';
import { container } from 'tsyringe';
import { WSTLogger } from '@wst/logger';

const router = Router();

const moduleRegister = [
  {
    name: 'Doc',
    url: '/doc',
    handlers: swaggerRoutes,
  },
  {
    name: 'API',
    url: '/',
    handlers: apiRoutes,
  },
  {
    name: 'Stations',
    url: '/',
    handlers: stationRoutes,
  },
];

moduleRegister.map(module => {
  router.use(module.url, module.handlers);
});

// Use @wst/middleware logging and error middleware
const logger = container.resolve<WSTLogger>('Logger');
router.use(errorLoggingMiddleware(logger));
router.use(errorMiddleware());

export { router, moduleRegister };
