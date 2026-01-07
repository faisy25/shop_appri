import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const userDetailService = {
  async getAll() {
    try {
      const userDetails = await dbHelper.getAll({
        table: 'user_detail',
        selectColumns: [
          'user_detail.user_detail_id',
          'user_detail.user_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
          'user_detail.created_at',
          'user_detail.updated_at',
          'user.name as user_name',
          'user.email as user_email',
        ],
        joinArray: [
          {
            table: 'user',
            condition: 'user_detail.user_id = user.user_id',
            join_type: 'INNER',
          },
        ],
        orderBy: [{ key: 'user_detail.created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return userDetails;
    } catch (err) {
      ServiceError(err, 'Failed to load user details');
    }
  },

  async getById(id) {
    try {
      const userDetail = await dbHelper.getOne({
        table: 'user_detail',
        selectColumns: [
          'user_detail.user_detail_id',
          'user_detail.user_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
          'user_detail.created_at',
          'user_detail.updated_at',
          'user.name as user_name',
          'user.email as user_email',
        ],
        where: { user_detail_id: id },
        joinArray: [
          {
            table: 'user',
            condition: 'user_detail.user_id = user.user_id',
            join_type: 'INNER',
          },
        ],
        deletedColumn: 'is_deleted',
      });

      if (!userDetail) {
        throw new ApiError(404, 'User detail not found');
      }
      return userDetail;
    } catch (err) {
      ServiceError(err, 'Failed to get user detail');
    }
  },

  async getByUserId(userId) {
    try {
      const userDetail = await dbHelper.getOne({
        table: 'user_detail',
        selectColumns: [
          'user_detail.user_detail_id',
          'user_detail.user_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
          'user_detail.created_at',
          'user_detail.updated_at',
          'user.name as user_name',
          'user.email as user_email',
        ],
        where: { 'user_detail.user_id': userId },
        joinArray: [
          {
            table: 'user',
            condition: 'user_detail.user_id = user.user_id',
            join_type: 'INNER',
          },
        ],
        deletedColumn: 'is_deleted',
      });

      return userDetail;
    } catch (err) {
      ServiceError(err, 'Failed to get user detail by user id');
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

      // Check if user detail already exists
      const existing = await dbHelper.getOneWithDeleted(
        {
          table: 'user_detail',
          where: { user_id: data.user_id },
        },
        connection,
      );

      if (existing && existing.is_deleted === 0) {
        throw new ApiError(400, 'User detail already exists for this user');
      }

      if (existing && existing.is_deleted === 1) {
        // Restore soft deleted record
        const result = await dbHelper.updateOne(
          'user_detail',
          {
            phone: data.phone || null,
            alternate_phone: data.alternate_phone || null,
            country: data.country || null,
            date_of_birth: data.date_of_birth || null,
            gender: data.gender || null,
            profile_picture_url: data.profile_picture_url || null,
            bio: data.bio || null,
            is_deleted: 0,
          },
          { user_detail_id: existing.user_detail_id },
          connection,
        );
        if (!result) {
          throw new ApiError(500, 'Failed to restore user detail');
        }
      } else {
        // Create new record
        const result = await dbHelper.createOne(
          'user_detail',
          {
            user_id: data.user_id,
            phone: data.phone || null,
            alternate_phone: data.alternate_phone || null,
            country: data.country || null,
            date_of_birth: data.date_of_birth || null,
            gender: data.gender || null,
            profile_picture_url: data.profile_picture_url || null,
            bio: data.bio || null,
          },
          connection,
        );

        if (!result || result === false) {
          throw new ApiError(500, 'Failed to create user detail');
        }
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { user_id: data.user_id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create user detail');
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
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.alternate_phone !== undefined) updateData.alternate_phone = data.alternate_phone;
      if (data.country !== undefined) updateData.country = data.country;
      if (data.date_of_birth !== undefined) updateData.date_of_birth = data.date_of_birth;
      if (data.gender !== undefined) updateData.gender = data.gender;
      if (data.profile_picture_url !== undefined)
        updateData.profile_picture_url = data.profile_picture_url;
      if (data.bio !== undefined) updateData.bio = data.bio;

      const result = await dbHelper.updateOne(
        'user_detail',
        updateData,
        { user_detail_id: id },
        connection,
      );

      if (!result) {
        throw new ApiError(404, 'User detail not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { user_detail_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update user detail');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const result = await dbHelper.softDeleteOne('user_detail', { user_detail_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User detail not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { user_detail_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete user detail');
    }
  },

  async getAllWithDeleted() {
    try {
      const userDetails = await dbHelper.getAllWithDeleted({
        table: 'user_detail',
        selectColumns: [
          'user_detail.user_detail_id',
          'user_detail.user_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
          'user_detail.is_deleted',
          'user_detail.created_at',
          'user_detail.updated_at',
          'user.name as user_name',
          'user.email as user_email',
        ],
        joinArray: [
          {
            table: 'user',
            condition: 'user_detail.user_id = user.user_id',
            join_type: 'LEFT',
          },
        ],
        orderBy: [{ key: 'user_detail.created_at', value: 'DESC' }],
      });
      return userDetails;
    } catch (err) {
      ServiceError(err, 'Failed to load user details with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const userDetail = await dbHelper.getOneWithDeleted({
        table: 'user_detail',
        selectColumns: [
          'user_detail.user_detail_id',
          'user_detail.user_id',
          'user_detail.phone',
          'user_detail.alternate_phone',
          'user_detail.country',
          'user_detail.date_of_birth',
          'user_detail.gender',
          'user_detail.profile_picture_url',
          'user_detail.bio',
          'user_detail.is_deleted',
          'user_detail.created_at',
          'user_detail.updated_at',
          'user.name as user_name',
          'user.email as user_email',
        ],
        where: { user_detail_id: id },
        joinArray: [
          {
            table: 'user',
            condition: 'user_detail.user_id = user.user_id',
            join_type: 'LEFT',
          },
        ],
        primaryKey: 'user_detail_id',
      });

      if (!userDetail) {
        throw new ApiError(404, 'User detail not found');
      }
      return userDetail;
    } catch (err) {
      ServiceError(err, 'Failed to get user detail with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      const result = await dbHelper.deleteOne('user_detail', { user_detail_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User detail not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { user_detail_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete user detail');
    }
  },
};

