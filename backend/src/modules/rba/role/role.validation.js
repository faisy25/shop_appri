import Joi from 'joi';
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

// Export roleSchema for swagger file
export const roleSchema = baseRoleSchema.concat(auditSchema);
