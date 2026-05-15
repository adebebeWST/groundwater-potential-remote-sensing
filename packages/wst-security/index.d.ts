import type { RequestHandler } from 'express';

export declare class SecurityService {
  hashPassword(password: string): Promise<string>;
  comparePassword(plain: string, hashed: string): Promise<boolean>;
}

export declare function authMiddleware(): RequestHandler;
export declare function jwtMiddleware(): RequestHandler;
