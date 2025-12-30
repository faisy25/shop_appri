import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const basePermissionSchema = Joi.object({
  permission_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
});
const permissionSchema = basePermissionSchema.concat(auditSchema);

export const permissionIdSchema = Joi.object({
  permission_id: Joi.string(),
});

export const createPermissionSchema = Joi.object({
  permission_id: Joi.string().length(10).required(),
  name: Joi.string().min(2).max(25).required(),
  description: Joi.string().max(100).allow(''),
});

export const editPermissionSchema = Joi.object({
  name: Joi.string().min(2).max(25),
  description: Joi.string().max(100).allow(''),
});

export const { swagger: permissionSchemaSwagger } = j2s(permissionSchema);
export const { swagger: permissionIdSchemaSwagger } = j2s(permissionIdSchema);
export const { swagger: createPermissionSchemaSwagger } = j2s(createPermissionSchema);
export const { swagger: editPermissionSchemaSwagger } = j2s(editPermissionSchema);
