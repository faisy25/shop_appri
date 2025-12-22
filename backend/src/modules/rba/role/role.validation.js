import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../config/docs/auditResponses.swagger.js';

export const baseRoleSchema = Joi.object({
  role_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
});
const roleSchema = baseRoleSchema.concat(auditSchema);

export const roleIdSchema = Joi.object({
  role_id: Joi.string(),
});

export const createRoleSchema = Joi.object({
  role_id: Joi.string().max(100).required(),
  name: Joi.string().min(2).max(25).required(),
  description: Joi.string().max(100).allow(''),
});

export const editRoleSchema = Joi.object({
  name: Joi.string().min(2).max(25),
  description: Joi.string().max(100).allow(''),
});

export const { swagger: roleSchemaSwagger } = j2s(roleSchema);
export const { swagger: roleIdSchemaSwagger } = j2s(roleIdSchema);
export const { swagger: createRoleSchemaSwagger } = j2s(createRoleSchema);
export const { swagger: editRoleSchemaSwagger } = j2s(editRoleSchema);
