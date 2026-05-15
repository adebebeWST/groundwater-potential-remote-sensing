import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { BaseController } from '@wst/middleware';
import { HelloWorldService } from '../../services/HelloWorldService';
import { HelloWorldRequestDTO } from '../dto/HelloWorldDTO';

@injectable()
export class HelloWorldController extends BaseController {
  constructor(
    @inject('HelloWorldService')
    private helloWorldService: HelloWorldService
  ) {
    super();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void | any> {
    try {
      // Get user info from Lambda authorizer context or headers
      // In a real AWS setup, userId would come from the authorizer context
      const userId = req.headers['x-user-id'] || req.body.userId || 1;
      const tenantId = req.headers['x-tenant-id'] || req.body.tenantId || 1;
      const projectId = req.headers['x-project-id'] || req.body.projectId || 1;

      // Map the request data to the DTO format
      const requestData: HelloWorldRequestDTO = {
        userId: Number(userId),
        tenantId: Number(tenantId),
        projectId: Number(projectId),
        ...req.body // Allow overriding from request body if needed
      };

      const result = await this.helloWorldService.processHelloWorld(requestData);
      
      return this.ok(res, result);
    } catch (error) {
      throw error;
    }
  }
}
