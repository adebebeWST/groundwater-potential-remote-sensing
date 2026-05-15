import { container } from 'tsyringe';
import { HelloWorldService } from '../services/HelloWorldService';
import { IHelloWorldService } from '../services/interfaces/IHelloWorldService';
import { StationService, IStationService } from '../services/StationService';
import { IStationRepository } from '../domain/interfaces/IStationRepository';
import { StationRepository } from '../infrastructure/repositories/StationRepository';
import { WSTLogger, LoggerConfig } from '@wst/logger';
import { DatabaseConnection, EnvironmentConfigLoader } from '@wst/database';

// Create logger configuration for this service
const loggerConfig: LoggerConfig = {
  service: 'auth-service',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.npm_package_version || '1.0.0',
  logPath: process.env.LOG_PATH || 'logs',
  logLevel: 'info'
};

// Infrastructure - Register logger instance with a token
const logger = new WSTLogger(loggerConfig);
container.registerInstance('Logger', logger);

// Database Configuration and Connection
const databaseConfig = {
  type: 'mssql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPassword123!',
  database: process.env.DB_DATABASE || 'wst_services',
  options: {
    trustServerCertificate: true,
    encrypt: false,
  }
};
const databaseConnection = DatabaseConnection.getInstance(databaseConfig, logger);
container.registerInstance('DatabaseConnection', databaseConnection);

// Repositories
container.registerSingleton<IStationRepository>('StationRepository', StationRepository);

// Services
container.registerSingleton<IHelloWorldService>('HelloWorldService', HelloWorldService);
container.registerSingleton<IStationService>('StationService', StationService);