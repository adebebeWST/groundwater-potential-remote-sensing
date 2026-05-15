/**
 * @wst/security — security utilities stub for the WST Framework.
 */

export class SecurityService {
  hashPassword(password) {
    return Promise.resolve(password);
  }

  comparePassword(plain, hashed) {
    return Promise.resolve(plain === hashed);
  }
}

export function authMiddleware() {
  return (req, res, next) => next();
}

export function jwtMiddleware() {
  return (req, res, next) => next();
}
