import swaggerJsdoc from 'swagger-jsdoc';
import { productPaths } from '../../modules/product/product.routes.js';
import { mediaPaths } from '../../modules/media/media.routes.js';
import { organizationPaths } from '../../modules/rba/organization/organization.routes.js';
import { departmentPaths } from '../../modules/rba/department/department.routes.js';
import { designationPaths } from '../../modules/rba/designation/designation.routes.js';
import { permissionPaths } from '../../modules/rba/permission/permission.routes.js';
import { rolePaths } from '../../modules/rba/role/role.routes.js';
import { featurePaths } from '../../modules/rba/feature/feature.routes.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Firma Documentation',
    version: '1.0.0',
    description: 'API documentation for the Node.js code . For the firma application here.',
  },

  servers: [
    {
      url: 'http://localhost:8000/api',
      description: 'Local server',
    },
  ],

  components: {
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          message: { type: 'string', example: 'Success message' },
          data: { type: 'object' },
        },
      },

      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 500 },
          message: { type: 'string', example: 'Something went wrong' },
          extra: { type: 'object' },
        },
      },
    },

    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },

      NotFound: {
        description: 'Resource Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },

      ServerError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  },

  // Add the paths here.
  paths: {
    ...productPaths,
    ...mediaPaths,
    ...organizationPaths,
    ...departmentPaths,
    ...designationPaths,
    ...permissionPaths,
    ...rolePaths,
    ...featurePaths,
  },
};

export const swaggerSpecs = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './src/modules/**/**/*.js', // controllers/routes inside modules
  ],
});
