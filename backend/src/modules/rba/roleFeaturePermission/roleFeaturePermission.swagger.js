import j2s from 'joi-to-swagger';
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

