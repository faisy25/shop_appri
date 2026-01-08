import Joi from 'joi';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseOrganizationDepartmentDesignationSchema = Joi.object({
  organization_id: Joi.number().integer(),
  department_id: Joi.string(),
  designation_id: Joi.string(),
});

export const organizationDepartmentDesignationIdSchema = Joi.object({
  organization_id: Joi.number().integer().required(),
  department_id: Joi.string().required(),
  designation_id: Joi.string().required(),
});

export const createOrganizationDepartmentDesignationSchema = Joi.object({
  organization_id: Joi.number().integer().required(),
  department_id: Joi.string().max(10).required(),
  designation_id: Joi.string().max(10).required(),
});

export const editOrganizationDepartmentDesignationSchema = Joi.object({
  organization_id: Joi.number().integer(),
  department_id: Joi.string().max(10),
  designation_id: Joi.string().max(10),
});

// Export organizationDepartmentDesignationSchema for swagger file
export const organizationDepartmentDesignationSchema =
  baseOrganizationDepartmentDesignationSchema.concat(auditSchema);
