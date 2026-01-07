import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseUserRoleSchema = Joi.object({
  user_id: Joi.number().integer(),
  role_id: Joi.string(),
});

const userRoleSchema = baseUserRoleSchema.concat(auditSchema);

export const userRoleIdSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  role_id: Joi.string().max(100).required(),
});

export const createUserRoleSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  role_id: Joi.string().max(100).required(),
});

export const { swagger: userRoleSchemaSwagger } = j2s(userRoleSchema);
export const { swagger: userRoleIdSchemaSwagger } = j2s(userRoleIdSchema);
export const { swagger: createUserRoleSchemaSwagger } = j2s(createUserRoleSchema);

