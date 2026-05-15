/**
 * @wst/middleware — Express middleware and base controller for the WST Framework.
 * Uses class-validator and class-transformer (resolved from host project's node_modules).
 */

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class BaseController {
  /**
   * The public entry point — delegates to executeImpl.
   */
  async execute(req, res) {
    await this.executeImpl(req, res);
  }

  /**
   * Subclasses override this method to handle the primary POST action.
   */
  async executeImpl(req, res) {
    this.fail(res, 'Not implemented', 501);
  }

  ok(res, data) {
    return res.status(200).json({ success: true, data });
  }

  created(res, data) {
    return res.status(201).json({ success: true, data });
  }

  fail(res, message, statusCode = 500) {
    return res.status(statusCode).json({ success: false, error: message });
  }
}

/**
 * Returns an Express middleware that validates req.body against the given DTO class.
 */
export function ValidateRequest(DTOClass) {
  return async (req, res, next) => {
    try {
      const dto = plainToInstance(DTOClass, req.body);
      const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: false });

      if (errors.length > 0) {
        const messages = errors
          .map(err => Object.values(err.constraints || {}).join(', '))
          .join('; ');
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: messages,
        });
      }

      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Express middleware that logs each incoming request and its response status/time.
 */
export function requestLoggingMiddleware(logger) {
  return (req, res, next) => {
    const start = Date.now();
    logger.info(`→ ${req.method} ${req.url}`);
    res.on('finish', () => {
      const ms = Date.now() - start;
      logger.info(`← ${req.method} ${req.url} ${res.statusCode} (${ms}ms)`);
    });
    next();
  };
}

/**
 * Express error-logging middleware (4-arg signature required by Express).
 */
export function errorLoggingMiddleware(logger) {
  // eslint-disable-next-line no-unused-vars
  return (error, req, res, next) => {
    logger.error(`Error on ${req.method} ${req.url}: ${error?.message || error}`);
    next(error);
  };
}

/**
 * Express error-handler middleware — converts thrown errors to JSON responses.
 */
export function errorMiddleware() {
  // eslint-disable-next-line no-unused-vars
  return (error, req, res, next) => {
    const statusCode = error?.statusCode || 500;
    const message = error?.message || 'Internal Server Error';
    res.status(statusCode).json({ success: false, error: message });
  };
}
