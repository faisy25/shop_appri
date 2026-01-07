import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

// Generate default password
const generateDefaultPassword = () => {
  return randomBytes(8).toString('hex'); // 16 character random password
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

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
        ],
        orderBy: [{ key: 'user.created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return users;
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
        ],
        where: { user_id: id },
        deletedColumn: 'is_deleted',
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      return user;
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
      // Check if email/uuid already exists
      const existingUser = await dbHelper.getOneWithDeleted(
        {
          table: 'user',
          where: { uuid: data.uuid },
        },
        connection,
      );

      if (existingUser && existingUser.is_deleted === 0) {
        throw new ApiError(400, 'User with this email/uuid already exists');
      }

      // Generate default password if not provided
      const defaultPassword = data.password || generateDefaultPassword();
      const hashedPassword = await hashPassword(defaultPassword);

      // Create user
      const result = await dbHelper.createOne(
        'user',
        {
          uuid: data.uuid,
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
        await dbHelper.createOne(
          'user_detail',
          {
            user_id: userId,
            phone: data.user_detail.phone || null,
            alternate_phone: data.user_detail.alternate_phone || null,
            country: data.user_detail.country || null,
            date_of_birth: data.user_detail.date_of_birth || null,
            gender: data.user_detail.gender || null,
            profile_picture_url: data.user_detail.profile_picture_url || null,
            bio: data.user_detail.bio || null,
          },
          connection,
        );
      }

      // Assign roles if provided
      if (data.role_ids && Array.isArray(data.role_ids) && data.role_ids.length > 0) {
        if (data.role_ids.length > 5) {
          throw new ApiError(400, 'User can have maximum 5 roles');
        }

        for (const roleId of data.role_ids) {
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

          await dbHelper.createOne(
            'user_role',
            {
              user_id: userId,
              role_id: roleId,
            },
            connection,
          );
        }
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
      if (data.email_verified_at !== undefined) updateData.email_verified_at = data.email_verified_at;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;

      if (Object.keys(updateData).length > 0) {
        const result = await dbHelper.updateOne('user', updateData, { user_id: id }, connection);

        if (!result) {
          throw new ApiError(404, 'User not found');
        }
      }

      // Update user detail if provided
      if (data.user_detail) {
        const existingDetail = await dbHelper.getOne(
          {
            table: 'user_detail',
            where: { user_id: id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );

        const detailData = {};
        if (data.user_detail.phone !== undefined) detailData.phone = data.user_detail.phone;
        if (data.user_detail.alternate_phone !== undefined)
          detailData.alternate_phone = data.user_detail.alternate_phone;
        if (data.user_detail.country !== undefined) detailData.country = data.user_detail.country;
        if (data.user_detail.date_of_birth !== undefined)
          detailData.date_of_birth = data.user_detail.date_of_birth;
        if (data.user_detail.gender !== undefined) detailData.gender = data.user_detail.gender;
        if (data.user_detail.profile_picture_url !== undefined)
          detailData.profile_picture_url = data.user_detail.profile_picture_url;
        if (data.user_detail.bio !== undefined) detailData.bio = data.user_detail.bio;

        if (Object.keys(detailData).length > 0) {
          if (existingDetail) {
            await dbHelper.updateOne(
              'user_detail',
              detailData,
              { user_detail_id: existingDetail.user_detail_id },
              connection,
            );
          } else {
            await dbHelper.createOne(
              'user_detail',
              {
                user_id: id,
                ...detailData,
              },
              connection,
            );
          }
        }
      }

      // Update roles if provided
      if (data.role_ids !== undefined) {
        if (Array.isArray(data.role_ids) && data.role_ids.length > 5) {
          throw new ApiError(400, 'User can have maximum 5 roles');
        }

        // Soft delete all existing roles
        await dbHelper.softDeleteOne('user_role', { user_id: id }, connection);

        // Create new role assignments
        if (Array.isArray(data.role_ids) && data.role_ids.length > 0) {
          for (const roleId of data.role_ids) {
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

            await dbHelper.createOne(
              'user_role',
              {
                user_id: id,
                role_id: roleId,
              },
              connection,
            );
          }
        }
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { user_id: id };
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

      const result = await dbHelper.softDeleteOne('user', { user_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User not found or already deleted');
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
        ],
        orderBy: [{ key: 'user.created_at', value: 'DESC' }],
      });
      return users;
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
        ],
        where: { user_id: id },
        primaryKey: 'user_id',
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      return user;
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

  async getUserWithRoles(id) {
    try {
      const user = await this.getById(id);

      // Get user roles with organization, department, designation details
      const userRoles = await dbHelper.getAll({
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
        where: { 'user_role.user_id': id },
        joinArray: [
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

      return {
        ...user,
        roles: userRoles,
      };
    } catch (err) {
      ServiceError(err, 'Failed to get user with roles');
    }
  },
};

