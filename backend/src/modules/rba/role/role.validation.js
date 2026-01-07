import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

// Nested object schemas for organization, department, designation
const organizationObjectSchema = Joi.object({
  organization_id: Joi.number().integer(),
  name: Joi.string(),
});

const departmentObjectSchema = Joi.object({
  department_id: Joi.string(),
  name: Joi.string(),
});

const designationObjectSchema = Joi.object({
  designation_id: Joi.string(),
  name: Joi.string(),
});

export const baseRoleSchema = Joi.object({
  role_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  organization: organizationObjectSchema.allow(null),
  department: departmentObjectSchema.allow(null),
  designation: designationObjectSchema.allow(null),
});
const roleSchema = baseRoleSchema.concat(auditSchema);

export const roleIdSchema = Joi.object({
  role_id: Joi.string(),
});

export const createRoleSchema = Joi.object({
  organization_id: Joi.number().integer().required(),
  department_id: Joi.string().max(10).required(),
  designation_id: Joi.string().max(10).required(),
  description: Joi.string().max(100).allow('').optional(),
  // name is auto-generated from designation + department, so it's not required
});

export const editRoleSchema = Joi.object({
  organization_id: Joi.number().integer().optional(),
  department_id: Joi.string().max(10).optional(),
  designation_id: Joi.string().max(10).optional(),
  description: Joi.string().max(100).allow('').optional(),
  // name is auto-generated from designation + department, so it's not in the schema
});

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
