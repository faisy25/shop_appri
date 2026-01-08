import Joi from 'joi';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseRoleFeaturePermissionSchema = Joi.object({
  role_id: Joi.string(),
  feature_id: Joi.number().integer(),
  permission_id: Joi.string(),
});

export const roleFeaturePermissionIdSchema = Joi.object({
  role_id: Joi.string().required(),
  feature_id: Joi.number().integer().required(),
  permission_id: Joi.string().required(),
});

export const createRoleFeaturePermissionSchema = Joi.object({
  role_id: Joi.string().max(100).required(),
  feature_id: Joi.number().integer().required(),
  permission_id: Joi.string().max(10).required(),
});

export const editRoleFeaturePermissionSchema = Joi.object({
  role_id: Joi.string().max(100),
  feature_id: Joi.number().integer(),
  permission_id: Joi.string().max(10),
});

export const bulkAssignPermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(
      Joi.object({
        feature_id: Joi.number().integer().required(),
        permission_id: Joi.string().max(10).required(),
      }),
    )
    .min(1)
    .required(),
});

export const bulkRemovePermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(
      Joi.object({
        feature_id: Joi.number().integer().required(),
        permission_id: Joi.string().max(10).required(),
      }),
    )
    .min(1)
    .required(),
});

// Export roleFeaturePermissionSchema for swagger file
export const roleFeaturePermissionSchema = baseRoleFeaturePermissionSchema.concat(auditSchema);
