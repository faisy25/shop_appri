import Joi from 'joi';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const basePermissionSchema = Joi.object({
  permission_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
});

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

// Export permissionSchema for swagger file
export const permissionSchema = basePermissionSchema.concat(auditSchema);
