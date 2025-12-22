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
import { validate } from '../../middleware/validate.middleware.js';
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

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../config/docs/method.swagger.js';
import {
  permissionSchemaSwagger,
  createPermissionSchemaSwagger,
  editPermissionSchemaSwagger,
  permissionIdSchemaSwagger,
} from './permission.validation.js';

const tag = 'Permission';
export const permissionPaths = {
  '/permissions': {
    get: makeGet(tag, 'Get all permissions', permissionSchemaSwagger, true),
    post: makePost(
      tag,
      'Create permission',
      createPermissionSchemaSwagger,
      permissionIdSchemaSwagger,
    ),
  },

  '/permissions/{id}': {
    get: makeGet(tag, 'Get permission', permissionSchemaSwagger),
    put: makePut(tag, 'Update permission', editPermissionSchemaSwagger, permissionIdSchemaSwagger),
    delete: makeDelete(tag, 'Delete permission', permissionIdSchemaSwagger),
  },

  '/permissions/hard/{id}': {
    delete: makeDelete(tag, 'Delete permission permanently', permissionIdSchemaSwagger),
  },
};
