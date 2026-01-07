import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const userRoleService = {
  async getAll() {
    try {
      const userRoles = await dbHelper.getAll({
        table: 'user_role',
        selectColumns: [
          'user_role.user_id',
          'user_role.role_id',
          'user.name as user_name',
          'user.email as user_email',
          'role.name as role_name',
          'role.description as role_description',
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        joinArray: [
          {
            table: 'user',
            condition: 'user_role.user_id = user.user_id',
            join_type: 'INNER',
          },
          {
            table: 'role',
            condition: 'user_role.role_id = role.role_id',
            join_type: 'INNER',
          },
          {
            table: 'organization_department_designation',
            condition:
              'CONCAT(organization_department_designation.organization_id, "-", organization_department_designation.department_id, "-", organization_department_designation.designation_id) = role.role_id',
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
        orderBy: [{ key: 'user_role.user_id', value: 'ASC' }],
        deletedColumn: 'is_deleted',
      });
      return userRoles;
    } catch (err) {
      ServiceError(err, 'Failed to load user roles');
    }
  },

  async getById(userId, roleId) {
    try {
      const userRole = await dbHelper.getOne({
        table: 'user_role',
        selectColumns: [
          'user_role.user_id',
          'user_role.role_id',
          'user.name as user_name',
          'user.email as user_email',
          'role.name as role_name',
          'role.description as role_description',
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        where: {
          'user_role.user_id': userId,
          'user_role.role_id': roleId,
        },
        joinArray: [
          {
            table: 'user',
            condition: 'user_role.user_id = user.user_id',
            join_type: 'INNER',
          },
          {
            table: 'role',
            condition: 'user_role.role_id = role.role_id',
            join_type: 'INNER',
          },
          {
            table: 'organization_department_designation',
            condition:
              'CONCAT(organization_department_designation.organization_id, "-", organization_department_designation.department_id, "-", organization_department_designation.designation_id) = role.role_id',
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
        deletedColumn: 'is_deleted',
      });

      if (!userRole) {
        throw new ApiError(404, 'User role not found');
      }
      return userRole;
    } catch (err) {
      ServiceError(err, 'Failed to get user role');
    }
  },

  async getByUserId(userId) {
    try {
      const userRoles = await dbHelper.getAll({
        table: 'user_role',
        selectColumns: [
          'user_role.user_id',
          'user_role.role_id',
          'user.name as user_name',
          'user.email as user_email',
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
            table: 'user',
            condition: 'user_role.user_id = user.user_id',
            join_type: 'INNER',
          },
          {
            table: 'role',
            condition: 'user_role.role_id = role.role_id',
            join_type: 'INNER',
          },
          {
            table: 'organization_department_designation',
            condition:
              'CONCAT(organization_department_designation.organization_id, "-", organization_department_designation.department_id, "-", organization_department_designation.designation_id) = role.role_id',
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
        deletedColumn: 'is_deleted',
      });
      return userRoles;
    } catch (err) {
      ServiceError(err, 'Failed to get user roles by user id');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // Verify user exists
      const user = await dbHelper.getOne(
        {
          table: 'user',
          where: { user_id: data.user_id },
          deletedColumn: 'is_deleted',
        },
        connection,
      );
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Verify role exists
      const role = await dbHelper.getOne(
        {
          table: 'role',
          where: { role_id: data.role_id },
          deletedColumn: 'is_deleted',
        },
        connection,
      );
      if (!role) {
        throw new ApiError(404, 'Role not found');
      }

      // Check if user already has 5 roles
      const existingRoles = await dbHelper.getAll(
        {
          table: 'user_role',
          where: { user_id: data.user_id },
          deletedColumn: 'is_deleted',
        },
        connection,
      );

      if (existingRoles.length >= 5) {
        throw new ApiError(400, 'User can have maximum 5 roles');
      }

      // Check if already exists (including soft deleted)
      const existing = await dbHelper.getOneWithDeleted(
        {
          table: 'user_role',
          where: {
            user_id: data.user_id,
            role_id: data.role_id,
          },
        },
        connection,
      );

      if (existing) {
        if (existing.is_deleted === 0) {
          throw new ApiError(400, 'User role already exists');
        } else {
          // Restore soft deleted record
          const result = await dbHelper.updateOne(
            'user_role',
            { is_deleted: 0 },
            {
              user_id: data.user_id,
              role_id: data.role_id,
            },
            connection,
          );
          if (!result) {
            throw new ApiError(500, 'Failed to restore user role');
          }
        }
      } else {
        // Create new record
        const result = await dbHelper.createOne(
          'user_role',
          {
            user_id: data.user_id,
            role_id: data.role_id,
          },
          connection,
        );

        if (!result || result === false) {
          throw new ApiError(500, 'Failed to create user role');
        }
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        user_id: data.user_id,
        role_id: data.role_id,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create user role');
    }
  },

  async softDelete(userId, roleId) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(userId, roleId);

      const result = await dbHelper.softDeleteOne(
        'user_role',
        {
          user_id: userId,
          role_id: roleId,
        },
        connection,
      );

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User role not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        user_id: userId,
        role_id: roleId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete user role');
    }
  },

  async getAllWithDeleted() {
    try {
      const userRoles = await dbHelper.getAllWithDeleted({
        table: 'user_role',
        selectColumns: [
          'user_role.user_id',
          'user_role.role_id',
          'user_role.is_deleted',
          'user.name as user_name',
          'user.email as user_email',
          'role.name as role_name',
          'role.description as role_description',
        ],
        joinArray: [
          {
            table: 'user',
            condition: 'user_role.user_id = user.user_id',
            join_type: 'LEFT',
          },
          {
            table: 'role',
            condition: 'user_role.role_id = role.role_id',
            join_type: 'LEFT',
          },
        ],
        orderBy: [{ key: 'user_role.user_id', value: 'ASC' }],
      });
      return userRoles;
    } catch (err) {
      ServiceError(err, 'Failed to load user roles with deleted');
    }
  },

  async getByIdWithDeleted(userId, roleId) {
    try {
      const userRole = await dbHelper.getOneWithDeleted({
        table: 'user_role',
        selectColumns: [
          'user_role.user_id',
          'user_role.role_id',
          'user_role.is_deleted',
          'user.name as user_name',
          'user.email as user_email',
          'role.name as role_name',
          'role.description as role_description',
        ],
        where: {
          'user_role.user_id': userId,
          'user_role.role_id': roleId,
        },
        joinArray: [
          {
            table: 'user',
            condition: 'user_role.user_id = user.user_id',
            join_type: 'LEFT',
          },
          {
            table: 'role',
            condition: 'user_role.role_id = role.role_id',
            join_type: 'LEFT',
          },
        ],
      });

      if (!userRole) {
        throw new ApiError(404, 'User role not found');
      }
      return userRole;
    } catch (err) {
      ServiceError(err, 'Failed to get user role with deleted records');
    }
  },

  async hardDelete(userId, roleId) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(userId, roleId);

      const sql = `
        DELETE FROM user_role
        WHERE user_id = ? 
          AND role_id = ?
      `;
      const [result] = await connection.query(sql, [userId, roleId]);

      if (result.affectedRows === 0) {
        throw new ApiError(404, 'User role not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        user_id: userId,
        role_id: roleId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete user role');
    }
  },
};

