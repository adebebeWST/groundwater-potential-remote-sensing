import type { DataSource } from 'typeorm';

export interface DatabaseConfig {
  type?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  entities?: any[];
  synchronize?: boolean;
  options?: Record<string, any>;
}

export declare class EnvironmentConfigLoader {
  static load(): DatabaseConfig;
}

export declare class DatabaseConnection {
  static getInstance(config: DatabaseConfig, logger?: any): DatabaseConnection;
  connect(): Promise<void>;
  isConnected(): boolean;
  getDataSource(): DataSource;
  disconnect(): Promise<void>;
}
