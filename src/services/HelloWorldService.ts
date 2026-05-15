import { inject, injectable } from 'tsyringe';
import { WSTLogger } from '@wst/logger';
import { BaseError } from '@wst/core';
import { HelloWorldRequestDTO, HelloWorldResponseDTO } from '../presentation/dto/HelloWorldDTO';

@injectable()
export class HelloWorldService {
  constructor(
    @inject('Logger')
    private logger: WSTLogger
  ) {}

  async processHelloWorld(request: HelloWorldRequestDTO): Promise<HelloWorldResponseDTO> {
    this.logger.info('HelloWorldService: Processing hello world request', {
      userId: request.userId,
      tenantId: request.tenantId
    });    // Validate request
    if (!request.userId) {
      this.logger.error('HelloWorldService: Invalid user ID provided');
      throw new BaseError('Invalid user', 401, 'AUTHENTICATION_ERROR');
    }

    // Business logic - In a real scenario, you might:
    // - Check user permissions
    // - Validate access to tenant/project
    // - Perform domain-specific operations
    // - Interact with repositories

    this.logger.info('HelloWorldService: Successfully processed hello world request');

    // Return response
    return {
      message: 'Hello World',
      userId: request.userId,
      tenantId: request.tenantId,
      projectId: request.projectId
    };
  }
}
