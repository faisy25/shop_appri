import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseOrganizationDepartmentDesignationSchema = Joi.object({
  organization_id: Joi.number().integer(),
  department_id: Joi.string(),
  designation_id: Joi.string(),
});

const organizationDepartmentDesignationSchema =
  baseOrganizationDepartmentDesignationSchema.concat(auditSchema);

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

export const { swagger: organizationDepartmentDesignationSchemaSwagger } = j2s(
  organizationDepartmentDesignationSchema,
);
export const { swagger: organizationDepartmentDesignationIdSchemaSwagger } = j2s(
  organizationDepartmentDesignationIdSchema,
);
export const { swagger: createOrganizationDepartmentDesignationSchemaSwagger } = j2s(
  createOrganizationDepartmentDesignationSchema,
);
export const { swagger: editOrganizationDepartmentDesignationSchemaSwagger } = j2s(
  editOrganizationDepartmentDesignationSchema,
);
