import j2s from 'joi-to-swagger';
import {
  baseUserSchema,
  createUserSchema,
  editUserSchema,
  userIdSchema,
  userSchema,
} from './user.validation.js';

// Swagger schema exports
export const { swagger: userSchemaSwagger } = j2s(userSchema);
export const { swagger: userIdSchemaSwagger } = j2s(userIdSchema);
export const { swagger: createUserSchemaSwagger } = j2s(createUserSchema);
export const { swagger: editUserSchemaSwagger } = j2s(editUserSchema);

/**
 * Helper function to format user response with nested user_detail
 * @param {Object} user - User object from database
 * @returns {Object|null} - Formatted user object
 */
export const formatUserResponse = (user) => {
  if (!user) return null;

  return {
    user_id: user.user_id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    login_type: user.login_type,
    email_verified: user.email_verified,
    email_verified_at: user.email_verified_at,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
    user_detail: user.user_detail_id
      ? {
          user_detail_id: user.user_detail_id,
          phone: user.phone,
          alternate_phone: user.alternate_phone,
          country: user.country,
          date_of_birth: user.date_of_birth,
          gender: user.gender,
          profile_picture_url: user.profile_picture_url,
          bio: user.bio,
        }
      : null,
  };
};

/**
 * Helper function to format role response with nested organization, department, designation
 * Note: This function expects role data from userRoleService.getByUserId() which returns:
 * - role_name (not role.role_name)
 * - role_description (not role.role_description)
 * @param {Object} role - Role object from database
 * @returns {Object|null} - Formatted role object
 */
export const formatRoleResponse = (role) => {
  if (!role) return null;

  return {
    role_id: role.role_id,
    name: role.role_name || role.name, // Support both formats
    description: role.role_description || role.description, // Support both formats
    organization: role.organization_id
      ? {
          organization_id: role.organization_id,
          name: role.organization_name,
        }
      : null,
    department: role.department_id
      ? {
          department_id: role.department_id,
          name: role.department_name,
        }
      : null,
    designation: role.designation_id
      ? {
          designation_id: role.designation_id,
          name: role.designation_name,
        }
      : null,
  };
};
