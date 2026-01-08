import { Router } from 'express';
import {
  createPermission,
  deletePermission,
  getPermission,
  getPermissionDelete,
  getPermissions,
  hardDeletePermission,
  updatePermission,
  getPermissionsWithDeleted,
} from './permission.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createPermissionSchema, editPermissionSchema } from './permission.validation.js';

const router = Router();

router.get('/', getPermissions);
router.post('/', validate(createPermissionSchema), createPermission);

router.get('/hard', getPermissionsWithDeleted);
router.delete('/hard/:id', hardDeletePermission);
router.get('/hard/:id', getPermissionDelete);

router.get('/:id', getPermission);
router.put('/:id', validate(editPermissionSchema), updatePermission);
router.delete('/:id', deletePermission);

export default router;

// Export paths from swagger file
export { permissionPaths } from './permission.swagger.js';
