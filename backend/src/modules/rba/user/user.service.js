import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';
import { generateUUID } from '../../../util/generateUUID.js';
import { hashPassword } from '../../../util/user/userHelpers.js';
import { formatUserResponse, formatRoleResponse } from './user.validation.js';
import { userDetailService } from './user_detail/userDetail.service.js';
import { userRoleService } from './user_role/userRole.service.js';

export const userService = {
  async getAll() {
    try {
      const users = await dbHelper.getAll({
        table: 'user',
        selectColumns: [
          'user.user_id',
          'user.uuid',
          'user.name',
          'user.email',
          'user.login_type',
          'user.email_verified',
          'user.email_verified_at',
          'user.is_active',
          'user.created_at',
          'user.updated_at',
          'user_detail.user_detail_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
        ],
        joinArray: [
          {
            table: 'user_detail',
            condition: 'user.user_id = user_detail.user_id',
            join_type: 'LEFT',
          },
        ],
        orderBy: [{ key: 'user.created_at', value: 'DESC' }],
        deletedColumn: 'user.is_deleted',
      });

      // Format users and fetch roles for each user
      const formattedUsers = await Promise.all(
        users.map(async (user) => {
          const formattedUser = formatUserResponse(user);
          // Fetch roles for this user
          const roles = await userRoleService.getByUserId(user.user_id);
          // Format roles with nested objects
          const formattedRoles = (roles || []).map(formatRoleResponse);
          return {
            ...formattedUser,
            roles: formattedRoles,
          };
        }),
      );

      return formattedUsers;
    } catch (err) {
      ServiceError(err, 'Failed to load users');
    }
  },

  async getById(id) {
    try {
      const user = await dbHelper.getOne({
        table: 'user',
        selectColumns: [
          'user.user_id',
          'user.uuid',
          'user.name',
          'user.email',
          'user.login_type',
          'user.email_verified',
          'user.email_verified_at',
          'user.is_active',
          'user.created_at',
          'user.updated_at',
          'user_detail.user_detail_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
        ],
        where: { 'user.user_id': id },
        joinArray: [
          {
            table: 'user_detail',
            condition: 'user.user_id = user_detail.user_id',
            join_type: 'LEFT',
          },
        ],
        deletedColumn: 'user.is_deleted',
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Format user and fetch roles
      const formattedUser = formatUserResponse(user);
      const roles = await userRoleService.getByUserId(id);
      // Format roles with nested objects
      const formattedRoles = (roles || []).map(formatRoleResponse);

      return {
        ...formattedUser,
        roles: formattedRoles,
      };
    } catch (err) {
      ServiceError(err, 'Failed to get user');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // Generate UUID if not provided
      const userUUID = generateUUID();

      // Check if email/uuid already exists
      const existingUser = await dbHelper.getOneWithDeleted(
        {
          table: 'user',
          where: { uuid: userUUID },
        },
        connection,
      );

      if (existingUser && existingUser.is_deleted === 0) {
        throw new ApiError(400, 'User with this email/uuid already exists');
      }

      // Also check if email already exists
      const existingEmail = await dbHelper.getOneWithDeleted(
        {
          table: 'user',
          where: { email: data.email },
        },
        connection,
      );

      if (existingEmail && existingEmail.is_deleted === 0) {
        throw new ApiError(400, 'User with this email already exists');
      }

      // Generate default password if not provided
      const defaultPassword = 'password';
      const hashedPassword = await hashPassword(defaultPassword);

      // Create user
      const result = await dbHelper.createOne(
        'user',
        {
          uuid: userUUID,
          name: data.name,
          email: data.email,
          password: hashedPassword,
          login_type: data.login_type || 'email',
          email_verified: data.email_verified || 0,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create user');
      }

      const userId = result.insertId;

      // Create user detail if provided
      if (data.user_detail) {
        await userDetailService.create(userId, data.user_detail, connection);
      }

      // Assign roles if provided
      if (data.role_ids && Array.isArray(data.role_ids) && data.role_ids.length > 0) {
        await userRoleService.assignRoles(userId, data.role_ids, connection);
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      // Return user without password
      const createdUser = await this.getById(userId);
      return {
        ...createdUser,
        default_password: defaultPassword, // Return default password only on creation
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create user');
    }
  },

  async update(id, data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const updateData = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;
      if (data.login_type) updateData.login_type = data.login_type;
      if (data.email_verified !== undefined) updateData.email_verified = data.email_verified;
      if (data.email_verified_at !== undefined)
        updateData.email_verified_at = data.email_verified_at;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;

      if (Object.keys(updateData).length > 0) {
        const result = await dbHelper.updateOne('user', updateData, { user_id: id }, connection);

        if (!result) {
          throw new ApiError(404, 'User not found');
        }
      }

      // Update user detail if provided
      if (data.user_detail) {
        await userDetailService.update(id, data.user_detail, connection);
      }

      // Update roles if provided
      if (data.role_ids !== undefined) {
        await userRoleService.updateRoles(id, data.role_ids, connection);
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      // Return the updated user with full details
      return await this.getById(id);
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update user');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      // Soft delete user
      const result = await dbHelper.softDeleteOne('user', { user_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User not found or already deleted');
      }

      // Soft delete user detail if exists
      try {
        await userDetailService.softDelete(id, connection);
      } catch (err) {
        // User detail might not exist, continue
      }

      // Soft delete user roles
      try {
        await userRoleService.softDeleteByUserId(id, connection);
      } catch (err) {
        // User roles might not exist, continue
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { user_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete user');
    }
  },

  async getAllWithDeleted() {
    try {
      const users = await dbHelper.getAllWithDeleted({
        table: 'user',
        selectColumns: [
          'user.user_id',
          'user.uuid',
          'user.name',
          'user.email',
          'user.login_type',
          'user.email_verified',
          'user.email_verified_at',
          'user.is_active',
          'user.is_deleted',
          'user.created_at',
          'user.updated_at',
          'user_detail.user_detail_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
        ],
        joinArray: [
          {
            table: 'user_detail',
            condition: 'user.user_id = user_detail.user_id',
            join_type: 'LEFT',
          },
        ],
        orderBy: [{ key: 'user.created_at', value: 'DESC' }],
      });

      // Format users and fetch roles for each user
      const formattedUsers = await Promise.all(
        users.map(async (user) => {
          const formattedUser = formatUserResponse(user);
          // Fetch roles for this user (including deleted)
          const roles = await userRoleService.getByUserId(user.user_id);
          // Format roles with nested objects
          const formattedRoles = (roles || []).map(formatRoleResponse);
          return {
            ...formattedUser,
            is_deleted: user.is_deleted,
            roles: formattedRoles,
          };
        }),
      );

      return formattedUsers;
    } catch (err) {
      ServiceError(err, 'Failed to load users with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const user = await dbHelper.getOneWithDeleted({
        table: 'user',
        selectColumns: [
          'user.user_id',
          'user.uuid',
          'user.name',
          'user.email',
          'user.login_type',
          'user.email_verified',
          'user.email_verified_at',
          'user.is_active',
          'user.is_deleted',
          'user.created_at',
          'user.updated_at',
          'user_detail.user_detail_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
        ],
        where: { 'user.user_id': id },
        primaryKey: 'user_id',
        joinArray: [
          {
            table: 'user_detail',
            condition: 'user.user_id = user_detail.user_id',
            join_type: 'LEFT',
          },
        ],
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Format user and fetch roles
      const formattedUser = formatUserResponse(user);
      const roles = await userRoleService.getByUserId(id);
      // Format roles with nested objects
      const formattedRoles = (roles || []).map(formatRoleResponse);

      return {
        ...formattedUser,
        is_deleted: user.is_deleted,
        roles: formattedRoles,
      };
    } catch (err) {
      ServiceError(err, 'Failed to get user with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      // Hard delete user roles first (foreign key constraint)
      try {
        await userRoleService.hardDeleteByUserId(id, connection);
      } catch (err) {
        // User roles might not exist, continue
      }

      // Hard delete user detail
      try {
        await userDetailService.hardDelete(id, connection);
      } catch (err) {
        // User detail might not exist, continue
      }

      // Hard delete user
      const result = await dbHelper.deleteOne('user', { user_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { user_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete user');
    }
  },
};
