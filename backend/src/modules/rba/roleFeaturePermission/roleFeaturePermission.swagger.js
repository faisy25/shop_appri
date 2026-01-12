import j2s from 'joi-to-swagger';
import { makeGet, makePost } from '../../../config/docs/method.swagger.js';
import {
  bulkAssignPermissionsSchema,
  bulkRemovePermissionsSchema,
  permissionResponseSchema,
} from './roleFeaturePermission.validation.js';

// Swagger schema exports
export const { swagger: permissionResponseSchemaSwagger } = j2s(permissionResponseSchema);
export const { swagger: bulkAssignPermissionsSchemaSwagger } = j2s(bulkAssignPermissionsSchema);
export const { swagger: bulkRemovePermissionsSchemaSwagger } = j2s(bulkRemovePermissionsSchema);

// For redoc documentation
const tag = 'Role Feature Permission';
export const roleFeaturePermissionPaths = {
  '/role-feature-permission/role/{roleId}': {
    get: makeGet(tag, 'Get permissions by role', permissionResponseSchemaSwagger, true),
  },

  '/role-feature-permission/role/{roleId}/bulk-assign': {
    post: makePost(
      tag,
      'Bulk assign permissions to role',
      bulkAssignPermissionsSchemaSwagger,
      bulkAssignPermissionsSchemaSwagger,
    ),
  },

  '/role-feature-permission/role/{roleId}/bulk-remove': {
    post: makePost(
      tag,
      'Bulk remove permissions from role',
      bulkRemovePermissionsSchemaSwagger,
      bulkRemovePermissionsSchemaSwagger,
    ),
  },
};
