import j2s from 'joi-to-swagger';
import {
  baseRoleSchema,
  createRoleSchema,
  editRoleSchema,
  roleIdSchema,
  roleSchema,
} from './role.validation.js';

// Swagger schema exports
export const { swagger: roleSchemaSwagger } = j2s(roleSchema);
export const { swagger: roleIdSchemaSwagger } = j2s(roleIdSchema);
export const { swagger: createRoleSchemaSwagger } = j2s(createRoleSchema);
export const { swagger: editRoleSchemaSwagger } = j2s(editRoleSchema);

/**
 * Helper function to format role response with nested objects
 * @param {Object} role - Raw role data from database
 * @returns {Object|null} - Formatted role object with nested organization, department, designation
 */
export const formatRoleResponse = (role) => {
  if (!role) return null;

  return {
    role_id: role.role_id,
    name: role.name,
    description: role.description,
    created_at: role.created_at,
    updated_at: role.updated_at,
    organization: role.organization_id
      ? {
          organization_id: role.organization_id,
          name: role.organization_name,
        }
      : null,
    department: role.department_id
      ? {
          department_id: role.department_id,
          name: role.department_name,
        }
      : null,
    designation: role.designation_id
      ? {
          designation_id: role.designation_id,
          name: role.designation_name,
        }
      : null,
  };
};

