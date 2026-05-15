export declare class Entity {
  public id: number | undefined;
}

export declare class BaseError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  constructor(message: string, statusCode?: number, code?: string);
}
