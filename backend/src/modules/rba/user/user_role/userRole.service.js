import dbHelper from '../../../../util/database/dbHelper.js';
import ApiError from '../../../../util/error/api.error.js';
import { ServiceError } from '../../../../util/error/service.error.js';
import { validateRoleIds, validateUpdateRoleIds } from './userRole.validation.js';

export const userRoleService = {
  async getByUserId(userId, connection = null) {
    try {
      const userRoles = await dbHelper.getAll(
        {
          table: 'user_role',
          selectColumns: [
            'user_role.user_id',
            'user_role.role_id',
            'role.name as role_name',
            'role.description as role_description',
            'organization_department_designation.organization_id',
            'organization_department_designation.department_id',
            'organization_department_designation.designation_id',
            'organization.name as organization_name',
            'department.name as department_name',
            'designation.name as designation_name',
          ],
          where: { 'user_role.user_id': userId },
          joinArray: [
            {
              table: 'role',
              condition: 'user_role.role_id = role.role_id',
              join_type: 'INNER',
            },
            {
              table: 'organization_department_designation',
              condition:
                'role.role_id = CONCAT(organization_department_designation.organization_id, organization_department_designation.department_id, organization_department_designation.designation_id)',
              join_type: 'LEFT',
            },
            {
              table: 'organization',
              condition:
                'organization_department_designation.organization_id = organization.organization_id',
              join_type: 'LEFT',
            },
            {
              table: 'department',
              condition:
                'organization_department_designation.department_id = department.department_id',
              join_type: 'LEFT',
            },
            {
              table: 'designation',
              condition:
                'organization_department_designation.designation_id = designation.designation_id',
              join_type: 'LEFT',
            },
          ],
          orderBy: [{ key: 'user_role.created_at', value: 'DESC' }],
          deletedColumn: 'is_deleted',
        },
        connection,
      );

      return userRoles;
    } catch (err) {
      ServiceError(err, 'Failed to get user roles');
    }
  },

  async assignRoles(userId, roleIds, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      // Validate role_ids using Joi schema
      const validatedRoleIds = validateRoleIds(roleIds);

      const assignedRoles = [];

      for (const roleId of validatedRoleIds) {
        // Verify role exists
        const role = await dbHelper.getOne(
          {
            table: 'role',
            where: { role_id: roleId },
            deletedColumn: 'is_deleted',
          },
          connection,
        );

        if (!role) {
          throw new ApiError(404, `Role with id ${roleId} not found`);
        }

        const result = await dbHelper.createOne(
          'user_role',
          {
            user_id: userId,
            role_id: roleId,
          },
          connection,
        );

        if (result && result.insertId) {
          assignedRoles.push({ user_id: userId, role_id: roleId });
        }
      }

      return assignedRoles;
    } catch (err) {
      // If validation error, throw ApiError with proper message
      if (err.isJoi) {
        throw new ApiError(400, err.details[0].message);
      }
      ServiceError(err, 'Failed to assign roles');
    }
  },

  async updateRoles(userId, roleIds, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      // Validate role_ids using Joi schema (allows null/undefined/empty array)
      const validatedRoleIds = validateUpdateRoleIds(roleIds);

      // Soft delete all existing roles
      await dbHelper.softDeleteOne('user_role', { user_id: userId }, connection);

      // Create new role assignments if provided
      if (Array.isArray(validatedRoleIds) && validatedRoleIds.length > 0) {
        return await this.assignRoles(userId, validatedRoleIds, connection);
      }

      return [];
    } catch (err) {
      // If validation error, throw ApiError with proper message
      if (err.isJoi) {
        throw new ApiError(400, err.details[0].message);
      }
      ServiceError(err, 'Failed to update user roles');
    }
  },

  async softDeleteByUserId(userId, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      const result = await dbHelper.softDeleteOne('user_role', { user_id: userId }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User roles not found or already deleted');
      }

      return { user_id: userId };
    } catch (err) {
      ServiceError(err, 'Failed to delete user roles');
    }
  },

  async hardDeleteByUserId(userId, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      const result = await dbHelper.deleteOne('user_role', { user_id: userId }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User roles not found');
      }

      return { user_id: userId };
    } catch (err) {
      ServiceError(err, 'Failed to permanently delete user roles');
    }
  },
};
