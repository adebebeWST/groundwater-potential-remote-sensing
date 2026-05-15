import type { Request, Response, NextFunction, RequestHandler } from 'express';

export declare class BaseController {
  execute(req: Request, res: Response): Promise<void>;
  protected executeImpl(req: Request, res: Response): Promise<void | any>;
  protected ok(res: Response, data?: any): Response;
  protected created(res: Response, data?: any): Response;
  protected fail(res: Response, message: string, statusCode?: number): Response;
}

export declare function ValidateRequest(DTOClass: new () => any): RequestHandler;

export declare function requestLoggingMiddleware(logger: any): RequestHandler;

export declare function errorLoggingMiddleware(
  logger: any
): (error: any, req: Request, res: Response, next: NextFunction) => void;

export declare function errorMiddleware(): (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
