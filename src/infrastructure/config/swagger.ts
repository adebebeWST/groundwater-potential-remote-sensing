import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WST Template API',
      version: '1.0.0',
      description: 'A template microservice built with WST Framework',
    },
    servers: [
      {
        url: process.env.URL || `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
      },
      schemas: {
        Station: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            code: { type: 'string' },
            latitude: { type: 'number', minimum: -90, maximum: 90 },
            longitude: { type: 'number', minimum: -180, maximum: 180 },
            altitude: { type: 'number' },
            description: { type: 'string' },
            isActive: { type: 'boolean' },
            tenantId: { type: 'number' }
          }
        }
      }
    },
    paths: {
      '/stations': {
        get: {
          summary: 'Get all stations',
          tags: ['Stations'],
          responses: {
            '200': {
              description: 'List of stations',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      stations: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Station' }
                      },
                      total: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new station',
          tags: ['Stations'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Station' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Station created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Station' }
                }
              }
            }
          }
        }
      },
      '/stations/{id}': {
        get: {
          summary: 'Get station by ID',
          tags: ['Stations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'number' }
            }
          ],
          responses: {
            '200': {
              description: 'Station details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Station' }
                }
              }
            }
          }
        },
        put: {
          summary: 'Update station',
          tags: ['Stations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'number' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Station' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Station updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Station' }
                }
              }
            }
          }
        },
        delete: {
          summary: 'Delete station',
          tags: ['Stations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'number' }
            }
          ],
          responses: {
            '204': {
              description: 'Station deleted'
            }
          }
        }
      }
    }
  },
  apis: [], // Remove automatic scanning for now
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerRoutes = Router();

// Swagger UI
swaggerRoutes.use('/docs', swaggerUi.serve);
swaggerRoutes.get('/docs', swaggerUi.setup(swaggerSpec));

// JSON spec endpoint
swaggerRoutes.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export { swaggerRoutes, swaggerSpec };
