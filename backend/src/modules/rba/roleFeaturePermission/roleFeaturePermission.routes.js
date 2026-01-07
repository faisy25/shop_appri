import { Router } from 'express';
import {
  createRoleFeaturePermission,
  deleteRoleFeaturePermission,
  getRoleFeaturePermission,
  getRoleFeaturePermissionDelete,
  getRoleFeaturePermissions,
  hardDeleteRoleFeaturePermission,
  updateRoleFeaturePermission,
  getRoleFeaturePermissionsWithDeleted,
  bulkAssignPermissions,
  bulkRemovePermissions,
  getPermissionsByRole,
} from './roleFeaturePermission.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import {
  createRoleFeaturePermissionSchema,
  editRoleFeaturePermissionSchema,
  bulkAssignPermissionsSchema,
  bulkRemovePermissionsSchema,
} from './roleFeaturePermission.validation.js';

const router = Router();

router.get('/', getRoleFeaturePermissions);
router.post('/', validate(createRoleFeaturePermissionSchema), createRoleFeaturePermission);

router.get('/hard', getRoleFeaturePermissionsWithDeleted);
router.delete('/hard/:roleId/:featureId/:permissionId', hardDeleteRoleFeaturePermission);
router.get('/hard/:roleId/:featureId/:permissionId', getRoleFeaturePermissionDelete);

router.get('/role/:roleId', getPermissionsByRole);
router.post('/role/:roleId/bulk-assign', validate(bulkAssignPermissionsSchema), bulkAssignPermissions);
router.post('/role/:roleId/bulk-remove', validate(bulkRemovePermissionsSchema), bulkRemovePermissions);

router.get('/:roleId/:featureId/:permissionId', getRoleFeaturePermission);
router.put(
  '/:roleId/:featureId/:permissionId',
  validate(editRoleFeaturePermissionSchema),
  updateRoleFeaturePermission,
);
router.delete('/:roleId/:featureId/:permissionId', deleteRoleFeaturePermission);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  roleFeaturePermissionSchemaSwagger,
  createRoleFeaturePermissionSchemaSwagger,
  editRoleFeaturePermissionSchemaSwagger,
  roleFeaturePermissionIdSchemaSwagger,
} from './roleFeaturePermission.validation.js';

const tag = 'Role Feature Permission';
export const roleFeaturePermissionPaths = {
  '/role-feature-permissions': {
    get: makeGet(tag, 'Get all role feature permissions', roleFeaturePermissionSchemaSwagger, true),
    post: makePost(
      tag,
      'Create role feature permission',
      createRoleFeaturePermissionSchemaSwagger,
      roleFeaturePermissionIdSchemaSwagger,
    ),
  },

  '/role-feature-permissions/{roleId}/{featureId}/{permissionId}': {
    get: makeGet(tag, 'Get role feature permission', roleFeaturePermissionSchemaSwagger),
    put: makePut(
      tag,
      'Update role feature permission',
      editRoleFeaturePermissionSchemaSwagger,
      roleFeaturePermissionIdSchemaSwagger,
    ),
    delete: makeDelete(tag, 'Delete role feature permission', roleFeaturePermissionIdSchemaSwagger),
  },

  '/role-feature-permissions/hard/{roleId}/{featureId}/{permissionId}': {
    delete: makeDelete(
      tag,
      'Delete role feature permission permanently',
      roleFeaturePermissionIdSchemaSwagger,
    ),
  },
};
