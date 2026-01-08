import dbHelper from '../../../../util/database/dbHelper.js';
import ApiError from '../../../../util/error/api.error.js';
import { ServiceError } from '../../../../util/error/service.error.js';

/**
 * Format date to MySQL DATE format (YYYY-MM-DD)
 * Handles ISO datetime strings, Date objects, and null values
 */
const formatDateForDB = (date) => {
  if (!date || date === '' || date === null) {
    return null;
  }

  try {
    // If it's already in YYYY-MM-DD format, return as is
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Parse the date (handles ISO strings, Date objects, etc.)
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    // Format to YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (err) {
    return null;
  }
};

export const userDetailService = {
  async getByUserId(userId, connection = null) {
    try {
      const userDetail = await dbHelper.getOne(
        {
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
          ],
          where: { user_id: userId },
          deletedColumn: 'is_deleted',
        },
        connection,
      );

      return userDetail;
    } catch (err) {
      ServiceError(err, 'Failed to get user detail');
    }
  },

  async create(userId, data, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      const result = await dbHelper.createOne(
        'user_detail',
        {
          user_id: userId,
          phone: data.phone || null,
          alternate_phone: data.alternate_phone || null,
          country: data.country || null,
          date_of_birth: formatDateForDB(data.date_of_birth),
          gender: data.gender || null,
          profile_picture_url: data.profile_picture_url || null,
          bio: data.bio || null,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create user detail');
      }

      return { user_detail_id: result.insertId };
    } catch (err) {
      ServiceError(err, 'Failed to create user detail');
    }
  },

  async update(userId, data, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      const existingDetail = await dbHelper.getOne(
        {
          table: 'user_detail',
          where: { user_id: userId },
          deletedColumn: 'is_deleted',
        },
        connection,
      );

      const detailData = {};
      if (data.phone !== undefined) detailData.phone = data.phone;
      if (data.alternate_phone !== undefined) detailData.alternate_phone = data.alternate_phone;
      if (data.country !== undefined) detailData.country = data.country;
      if (data.date_of_birth !== undefined) detailData.date_of_birth = formatDateForDB(data.date_of_birth);
      if (data.gender !== undefined) detailData.gender = data.gender;
      if (data.profile_picture_url !== undefined)
        detailData.profile_picture_url = data.profile_picture_url;
      if (data.bio !== undefined) detailData.bio = data.bio;

      if (Object.keys(detailData).length > 0) {
        if (existingDetail) {
          const result = await dbHelper.updateOne(
            'user_detail',
            detailData,
            { user_detail_id: existingDetail.user_detail_id },
            connection,
          );

          if (!result) {
            throw new ApiError(404, 'User detail not found');
          }
        } else {
          await dbHelper.createOne(
            'user_detail',
            {
              user_id: userId,
              ...detailData,
            },
            connection,
          );
        }
      }

      return { user_id: userId };
    } catch (err) {
      ServiceError(err, 'Failed to update user detail');
    }
  },

  async softDelete(userId, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      const result = await dbHelper.softDeleteOne('user_detail', { user_id: userId }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User detail not found or already deleted');
      }

      return { user_id: userId };
    } catch (err) {
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
        ],
        orderBy: [{ key: 'user_detail.created_at', value: 'DESC' }],
      });
      return userDetails;
    } catch (err) {
      ServiceError(err, 'Failed to load user details with deleted');
    }
  },

  async getByIdWithDeleted(userDetailId) {
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
        ],
        where: { user_detail_id: userDetailId },
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

  async hardDelete(userId, connection) {
    try {
      if (!connection) {
        throw new ApiError(500, 'Transaction connection required');
      }

      const result = await dbHelper.deleteOne('user_detail', { user_id: userId }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'User detail not found');
      }

      return { user_id: userId };
    } catch (err) {
      ServiceError(err, 'Failed to permanently delete user detail');
    }
  },
};

