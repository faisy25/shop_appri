import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../config/docs/auditResponses.swagger.js';

export const baseOrganizationSchema = Joi.object({
  organization_id: Joi.number().integer(),
  name: Joi.string(),
  type: Joi.string().valid('internal', 'brand', 'outsourced'),
  parent_id: Joi.number().integer(),
});
const organizationSchema = baseOrganizationSchema.concat(auditSchema);

export const organizationIdSchema = Joi.object({
  organization_id: Joi.number().integer(),
});

export const createOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  type: Joi.string().valid('internal', 'brand', 'outsourced').required(),
  parent_id: Joi.number().integer().allow(null),
});

export const editOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  type: Joi.string().valid('internal', 'brand', 'outsourced'),
  parent_id: Joi.number().integer().allow(null),
});

export const { swagger: organizationSchemaSwagger } = j2s(organizationSchema);
export const { swagger: organizationIdSchemaSwagger } = j2s(organizationIdSchema);
export const { swagger: createOrganizationSchemaSwagger } = j2s(createOrganizationSchema);
export const { swagger: editOrganizationSchemaSwagger } = j2s(editOrganizationSchema);
