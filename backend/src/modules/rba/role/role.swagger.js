import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  createRoleSchema,
  editRoleSchema,
  roleIdSchema,
  roleSchema,
} from './role.validation.js';

// Swagger schema exports
export const { swagger: roleSchemaSwagger } = j2s(roleSchema);
export const { swagger: roleIdSchemaSwagger } = j2s(roleIdSchema);
export const { swagger: createRoleSchemaSwagger } = j2s(createRoleSchema);
export const { swagger: editRoleSchemaSwagger } = j2s(editRoleSchema);

// For redoc documentation
const tag = 'Role';
export const rolePaths = {
  '/roles': {
    get: {
      summary: 'Get all roles',
      tags: [tag],
      parameters: [
        {
          name: 'organization_id',
          in: 'query',
          required: false,
          schema: { type: 'integer' },
          description: 'Filter by organization ID',
        },
        {
          name: 'department_id',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by department ID',
        },
        {
          name: 'designation_id',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by designation ID',
        },
      ],
      responses: {
        200: {
          description: 'Get all roles [success]',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: roleSchemaSwagger },
                    },
                  },
                ],
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
    post: makePost(tag, 'Create role', createRoleSchemaSwagger, roleSchemaSwagger),
  },

  '/roles/{id}': {
    get: makeGet(tag, 'Get role', roleSchemaSwagger),
    put: makePut(tag, 'Update role', editRoleSchemaSwagger, roleSchemaSwagger),
    delete: makeDelete(tag, 'Delete role', roleIdSchemaSwagger),
  },

  '/roles/hard': {
    get: makeGet(tag, 'Get all roles with deleted', roleSchemaSwagger, true),
  },

  '/roles/hard/{id}': {
    get: makeGet(tag, 'Get role with deleted', roleSchemaSwagger),
    delete: makeDelete(tag, 'Delete role permanently', roleIdSchemaSwagger),
  },
};

