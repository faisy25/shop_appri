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

// Export paths from swagger file
export { roleFeaturePermissionPaths } from './roleFeaturePermission.swagger.js';
