import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  bulkAssignPermissionsSchema,
  bulkRemovePermissionsSchema,
  createRoleFeaturePermissionSchema,
  editRoleFeaturePermissionSchema,
  roleFeaturePermissionIdSchema,
  roleFeaturePermissionSchema,
} from './roleFeaturePermission.validation.js';

// Swagger schema exports
export const { swagger: roleFeaturePermissionSchemaSwagger } = j2s(roleFeaturePermissionSchema);
export const { swagger: roleFeaturePermissionIdSchemaSwagger } = j2s(roleFeaturePermissionIdSchema);
export const { swagger: createRoleFeaturePermissionSchemaSwagger } = j2s(
  createRoleFeaturePermissionSchema,
);
export const { swagger: editRoleFeaturePermissionSchemaSwagger } = j2s(
  editRoleFeaturePermissionSchema,
);
export const { swagger: bulkAssignPermissionsSchemaSwagger } = j2s(bulkAssignPermissionsSchema);
export const { swagger: bulkRemovePermissionsSchemaSwagger } = j2s(bulkRemovePermissionsSchema);

// For redoc documentation
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

