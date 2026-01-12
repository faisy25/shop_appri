import Joi from 'joi';

export const permissionResponseSchema = Joi.object({
  role_id: Joi.string(),
  feature_id: Joi.number().integer(),
  permission_id: Joi.string(),
  role_name: Joi.string(),
  feature_name: Joi.string(),
  feature_route: Joi.string().allow(null),
  permission_name: Joi.string(),
});

export const bulkAssignPermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(
      Joi.object({
        feature_id: Joi.number().integer().required(),
        permission_id: Joi.string().required(),
      }),
    )
    .required(),
});

export const bulkRemovePermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(
      Joi.object({
        feature_id: Joi.number().integer().required(),
        permission_id: Joi.string().required(),
      }),
    )
    .required(),
});
