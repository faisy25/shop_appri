import { Router } from 'express';
import {
  createRole,
  deleteRole,
  getRole,
  getRoleDelete,
  getRoles,
  hardDeleteRole,
  updateRole,
  getRolesWithDeleted,
} from './role.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createRoleSchema, editRoleSchema } from './role.validation.js';

const router = Router();

router.get('/', getRoles);
router.post('/', validate(createRoleSchema), createRole);

router.get('/hard', getRolesWithDeleted);
router.delete('/hard/:id', hardDeleteRole);
router.get('/hard/:id', getRoleDelete);

router.get('/:id', getRole);
router.put('/:id', validate(editRoleSchema), updateRole);
router.delete('/:id', deleteRole);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  roleSchemaSwagger,
  createRoleSchemaSwagger,
  editRoleSchemaSwagger,
  roleIdSchemaSwagger,
} from './role.swagger.js';

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
