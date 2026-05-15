import 'reflect-metadata';
import { jest } from '@jest/globals';
import { HelloWorldService } from './HelloWorldService';
import { HelloWorldRequestDTO } from '../presentation/dto/HelloWorldDTO';
import { WSTLogger } from '@wst/logger';
import { BaseError } from '@wst/core';

// Mock dependencies

const mockLogger: jest.Mocked<WSTLogger> = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  setLogLevel: jest.fn(),
  getLogLevel: jest.fn(),
  addContext: jest.fn(),
  removeContext: jest.fn(),
  clearContext: jest.fn(),
} as any;

describe('HelloWorldService', () => {
  let service: HelloWorldService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HelloWorldService(
      mockLogger
    );
  });

  describe('processHelloWorld', () => {
    it('should process hello world request successfully', async () => {
      // Arrange
      const request: HelloWorldRequestDTO = {
        userId: 1,
        tenantId: 1,
        projectId: 1,
      };

      // Act
      const result = await service.processHelloWorld(request);

      // Assert
      expect(result).toEqual({
        message: 'Hello World',
        userId: 1,
        tenantId: 1,
        projectId: 1,
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'HelloWorldService: Processing hello world request',
        {
          userId: 1,
          tenantId: 1,
        }
      );

      expect(mockLogger.info).toHaveBeenCalledWith(
        'HelloWorldService: Successfully processed hello world request'
      );
    });

    it('should throw BaseError when userId is not provided', async () => {
      // Arrange
      const request: HelloWorldRequestDTO = {
        userId: 0, // Invalid userId
        tenantId: 1,
        projectId: 1,
      };

      // Act & Assert
      await expect(service.processHelloWorld(request)).rejects.toThrow(BaseError);
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        'HelloWorldService: Invalid user ID provided'
      );
    });

    it('should throw BaseError when userId is undefined', async () => {
      // Arrange
      const request: HelloWorldRequestDTO = {
        userId: undefined as any, // Invalid userId
        tenantId: 1,
        projectId: 1,
      };

      // Act & Assert
      await expect(service.processHelloWorld(request)).rejects.toThrow(BaseError);
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        'HelloWorldService: Invalid user ID provided'
      );
    });
  });
});
