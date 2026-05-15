/**
 * @wst/database — TypeORM-based database connection wrapper for the WST Framework.
 */
import { DataSource } from 'typeorm';

export class EnvironmentConfigLoader {
  static load() {
    return {
      type: process.env.DB_TYPE || 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '1433'),
      username: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || '',
    };
  }
}

export class DatabaseConnection {
  static #instance = null;
  #dataSource = null;
  #connected = false;
  #config;
  #logger;

  constructor(config, logger) {
    this.#config = config;
    this.#logger = logger;
  }

  static getInstance(config, logger) {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection(config, logger);
    }
    return DatabaseConnection.#instance;
  }

  async connect() {
    const { type, host, port, username, password, database, options, entities } = this.#config;
    const dataSourceOptions = {
      type: type || 'mssql',
      host: host || 'localhost',
      port: port || 1433,
      username,
      password,
      database,
      entities: entities || [],
      synchronize: false,
      ...(options ? { extra: options } : {}),
    };

    this.#dataSource = new DataSource(dataSourceOptions);
    await this.#dataSource.initialize();
    this.#connected = true;
    if (this.#logger) {
      this.#logger.info('Database connected successfully');
    }
  }

  isConnected() {
    return this.#connected && this.#dataSource?.isInitialized === true;
  }

  getDataSource() {
    if (!this.#dataSource) {
      throw new Error('DataSource not initialized. Call connect() first.');
    }
    return this.#dataSource;
  }

  async disconnect() {
    if (this.#dataSource?.isInitialized) {
      await this.#dataSource.destroy();
      this.#connected = false;
    }
  }
}
