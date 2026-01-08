import j2s from 'joi-to-swagger';
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

