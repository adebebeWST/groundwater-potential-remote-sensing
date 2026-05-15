import { Connection, Schema, Mongoose } from 'mongoose';

declare function initialize(connection: Connection): void;

declare function plugin(schema: Schema, options: Object): void;

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        tenant_id?: number;
        project_id?: number;
        token?: string;
        tenant?: {
          role_id: number;
        };
        profile?: {
          role_id: number;
        };
      };
      validatedData?: any;
      requestId?: string;
    }
  }
}
