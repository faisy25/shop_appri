import j2s from 'joi-to-swagger';
import {
  assignRoleSchema,
  assignRolesSchema,
  roleIdParamSchema,
  updateRolesSchema,
  userIdParamSchema,
} from './userRole.validation.js';

// Swagger schema exports
export const { swagger: assignRolesSchemaSwagger } = j2s(assignRolesSchema);
export const { swagger: updateRolesSchemaSwagger } = j2s(updateRolesSchema);
export const { swagger: assignRoleSchemaSwagger } = j2s(assignRoleSchema);
export const { swagger: userIdParamSchemaSwagger } = j2s(userIdParamSchema);
export const { swagger: roleIdParamSchemaSwagger } = j2s(roleIdParamSchema);

