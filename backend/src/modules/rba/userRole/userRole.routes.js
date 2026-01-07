import { Router } from 'express';
import {
  createUserRole,
  deleteUserRole,
  getUserRole,
  getUserRoles,
  getUserRolesByUserId,
  hardDeleteUserRole,
  getUserRoleDelete,
  getUserRolesWithDeleted,
} from './userRole.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createUserRoleSchema } from './userRole.validation.js';

const router = Router();

router.get('/', getUserRoles);
router.post('/', validate(createUserRoleSchema), createUserRole);

router.get('/user/:userId', getUserRolesByUserId);

router.get('/hard', getUserRolesWithDeleted);
router.delete('/hard/:userId/:roleId', hardDeleteUserRole);
router.get('/hard/:userId/:roleId', getUserRoleDelete);

router.get('/:userId/:roleId', getUserRole);
router.delete('/:userId/:roleId', deleteUserRole);

export default router;

// For redoc documentation
import { makeGet, makePost, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  userRoleSchemaSwagger,
  createUserRoleSchemaSwagger,
  userRoleIdSchemaSwagger,
} from './userRole.validation.js';

const tag = 'User Role';
export const userRolePaths = {
  '/user-roles': {
    get: makeGet(tag, 'Get all user roles', userRoleSchemaSwagger, true),
    post: makePost(tag, 'Create user role', createUserRoleSchemaSwagger, userRoleIdSchemaSwagger),
  },

  '/user-roles/{userId}/{roleId}': {
    get: makeGet(tag, 'Get user role', userRoleSchemaSwagger),
    delete: makeDelete(tag, 'Delete user role', userRoleIdSchemaSwagger),
  },

  '/user-roles/hard/{userId}/{roleId}': {
    delete: makeDelete(tag, 'Delete user role permanently', userRoleIdSchemaSwagger),
  },
};

