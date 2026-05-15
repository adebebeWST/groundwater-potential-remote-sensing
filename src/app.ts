import 'reflect-metadata';
import 'module-alias/register.js';
import 'express-async-errors';

import cors from 'cors';
import { container } from 'tsyringe';
import { WSTLogger } from '@wst/logger';

// Import containers FIRST to register dependencies
import './container/modules';
import './container/providers';

import express from 'express';
import { router } from './presentation/routes';
import { DatabaseConnection } from '@wst/database';
import { requestLoggingMiddleware } from '@wst/middleware';

const logger = container.resolve<WSTLogger>('Logger');

// Initialize database connection
async function initializeDatabase() {
  const shouldInitDB = process.env.NODE_ENV !== 'test' && process.env.SKIP_DB_INIT !== 'true';
  if (!shouldInitDB) {
    logger.info('🚀 Server running in test mode!');
    return;
  }

  const databaseConnection = container.resolve<DatabaseConnection>('DatabaseConnection');
  try {
    await databaseConnection.connect();
    logger.info('🚀 Database connected successfully!');
  } catch (err) {
    logger.error('Database connection failed:', err as Error);
    // Don't throw, let the application start without DB
  }
}

export const app = express();

// Add request logging middleware early
app.use(requestLoggingMiddleware(logger));

// Setup basic Express middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ services: 'WST Template Service is running' });
});

// Register routes
app.use(router);

// Initialize database on startup
initializeDatabase().catch(err => {
  logger.error('Failed to initialize database:', err);
});
