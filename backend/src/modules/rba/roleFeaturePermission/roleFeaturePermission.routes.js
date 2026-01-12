import { Router } from 'express';
import {
  bulkAssignPermissions,
  bulkRemovePermissions,
  getPermissionsByRole,
} from './roleFeaturePermission.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import {
  bulkAssignPermissionsSchema,
  bulkRemovePermissionsSchema,
} from './roleFeaturePermission.validation.js';

const router = Router();

// Only 3 APIs: GET, CREATE (bulk), DELETE (bulk)
router.get('/role/:roleId', getPermissionsByRole);
router.post(
  '/role/:roleId/bulk-assign',
  validate(bulkAssignPermissionsSchema),
  bulkAssignPermissions,
);
router.post(
  '/role/:roleId/bulk-remove',
  validate(bulkRemovePermissionsSchema),
  bulkRemovePermissions,
);

export default router;

// Export paths from swagger file
export { roleFeaturePermissionPaths } from './roleFeaturePermission.swagger.js';
