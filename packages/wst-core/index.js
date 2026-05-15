/**
 * @wst/core — base entity and error classes for the WST Framework.
 */

export class Entity {
  id = undefined;
}

export class BaseError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'BaseError';
    this.statusCode = statusCode;
    this.code = code;
    // Restore prototype chain (important for `instanceof` checks with transpilers)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
