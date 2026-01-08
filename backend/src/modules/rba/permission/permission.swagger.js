import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  createPermissionSchema,
  editPermissionSchema,
  permissionIdSchema,
  permissionSchema,
} from './permission.validation.js';

// Swagger schema exports
export const { swagger: permissionSchemaSwagger } = j2s(permissionSchema);
export const { swagger: permissionIdSchemaSwagger } = j2s(permissionIdSchema);
export const { swagger: createPermissionSchemaSwagger } = j2s(createPermissionSchema);
export const { swagger: editPermissionSchemaSwagger } = j2s(editPermissionSchema);

// For redoc documentation
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

