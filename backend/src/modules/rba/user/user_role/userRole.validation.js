import Joi from 'joi';

/**
 * Base user role schema
 */
export const baseUserRoleSchema = Joi.object({
  user_id: Joi.number().integer(),
  role_id: Joi.string().max(100),
});

/**
 * Schema for assigning roles to a user
 * Validates role_ids array with proper constraints
 */
export const assignRolesSchema = Joi.object({
  role_ids: Joi.array()
    .items(
      Joi.string()
        .max(100)
        .required()
        .messages({
          'string.empty': 'Role ID cannot be empty',
          'string.max': 'Role ID must not exceed 100 characters',
          'any.required': 'Role ID is required',
        }),
    )
    .min(1)
    .max(5)
    .unique()
    .required()
    .messages({
      'array.min': 'At least one role ID is required',
      'array.max': 'User can have maximum 5 roles',
      'array.unique': 'Duplicate role IDs are not allowed',
      'any.required': 'role_ids array is required',
    }),
});

/**
 * Schema for updating roles for a user
 * Allows empty array to remove all roles
 */
export const updateRolesSchema = Joi.object({
  role_ids: Joi.array()
    .items(
      Joi.string()
        .max(100)
        .required()
        .messages({
          'string.empty': 'Role ID cannot be empty',
          'string.max': 'Role ID must not exceed 100 characters',
          'any.required': 'Role ID is required',
        }),
    )
    .max(5)
    .unique()
    .allow(null)
    .optional()
    .messages({
      'array.max': 'User can have maximum 5 roles',
      'array.unique': 'Duplicate role IDs are not allowed',
    }),
});

/**
 * Schema for validating a single role assignment
 */
export const assignRoleSchema = Joi.object({
  role_id: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Role ID cannot be empty',
      'string.max': 'Role ID must not exceed 100 characters',
      'any.required': 'Role ID is required',
    }),
});

/**
 * Schema for user_id parameter validation
 */
export const userIdParamSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    'number.base': 'User ID must be a number',
    'any.required': 'User ID is required',
  }),
});

/**
 * Schema for role_id parameter validation
 */
export const roleIdParamSchema = Joi.object({
  role_id: Joi.string().max(100).required().messages({
    'string.empty': 'Role ID cannot be empty',
    'string.max': 'Role ID must not exceed 100 characters',
    'any.required': 'Role ID is required',
  }),
});

/**
 * Custom validation function to check if role_ids array is valid
 * Can be used in middleware or service layer
 */
export const validateRoleIds = (roleIds) => {
  const { error, value } = assignRolesSchema.validate({ role_ids: roleIds });
  if (error) {
    throw error;
  }
  return value.role_ids;
};

/**
 * Custom validation function for update operations
 */
export const validateUpdateRoleIds = (roleIds) => {
  // Allow null or undefined (to remove all roles)
  if (roleIds === null || roleIds === undefined) {
    return [];
  }

  const { error, value } = updateRolesSchema.validate({ role_ids: roleIds });
  if (error) {
    throw error;
  }
  return value.role_ids || [];
};

