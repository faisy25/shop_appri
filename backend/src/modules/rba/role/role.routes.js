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
} from './role.validation.js';

const tag = 'Role';
export const rolePaths = {
  '/roles': {
    get: makeGet(tag, 'Get all roles', roleSchemaSwagger, true),
    post: makePost(tag, 'Create role', createRoleSchemaSwagger, roleIdSchemaSwagger),
  },

  '/roles/{id}': {
    get: makeGet(tag, 'Get role', roleSchemaSwagger),
    put: makePut(tag, 'Update role', editRoleSchemaSwagger, roleIdSchemaSwagger),
    delete: makeDelete(tag, 'Delete role', roleIdSchemaSwagger),
  },

  '/roles/hard/{id}': {
    delete: makeDelete(tag, 'Delete role permanently', roleIdSchemaSwagger),
  },
};
