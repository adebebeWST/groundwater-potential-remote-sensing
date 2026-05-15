export interface LoggerConfig {
  service: string;
  environment: string;
  version: string;
  logPath: string;
  logLevel: string;
}

export declare class WSTLogger {
  constructor(config: LoggerConfig);
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  setLogLevel(level: string): void;
  getLogLevel(): string;
  addContext(key: string, value: any): void;
  removeContext(key: string): void;
  clearContext(): void;
}
