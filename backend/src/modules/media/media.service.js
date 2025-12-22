import dbHelper from '../../util/database/dbHelper.js';
import ApiError from '../../util/error/api.error.js';
import { ServiceError } from '../../util/error/service.error.js';
import { mediaUpload, mediaDelete } from '../../util/fileUpload/mediaHandler.js';

export const mediaService = {
  // Insert multiple image, files, videos.
  async create({ model_type, model_id, files }, connection = null) {
    try {
      if (!files || files.length === 0) {
        return { inserted_count: 0 };
      }

      // Upload (single or multi)
      const mediaObjects = await mediaUpload(files, null, model_type, model_id);

      // Insert records
      const result = await dbHelper.createMany('media', mediaObjects, connection);

      return {
        inserted_count: mediaObjects.length,
        media_records: mediaObjects,
        db_result: result,
      };
    } catch (err) {
      ServiceError(err, 'Media service failed to create records');
    }
  },

  // This should be deleted from direclty using the system.
  // Soft delete multiple media records
  async softDelete(mediaConditions, connection = null) {
    try {
      // mediaConditions should be like: { model_type: 'product', model_id: 123 }
      const result = await dbHelper.softDeleteMany('media', mediaConditions, connection);

      if (!result || !result.success) {
        throw new ApiError(500, 'Failed to soft delete media');
      }

      return {
        affectedRows: result.affectedRows,
      };
    } catch (error) {
      ServiceError(error, 'Media delete failed');
    }
  },

  // This should be deleted from direclty using the system.
  // Hard delete multiple media records and remove from Cloudinary
  async hardDelete(mediaConditions, mediaItems = [], connection = null) {
    try {
      // Step 1: Delete from Cloudinary if media items provided
      if (mediaItems && mediaItems.length > 0) {
        const cloudinaryResult = await mediaDelete(mediaItems);

        if (!cloudinaryResult || !cloudinaryResult.success) {
          throw new ApiError(500, 'Failed to delete media from Cloudinary');
        }
      }

      // Step 2: Delete from database
      const result = await dbHelper.deleteMany('media', mediaConditions, connection);

      if (!result || !result.success) {
        throw new ApiError(500, 'Failed to delete media from database');
      }

      return {
        affectedRows: result.affectedRows,
        cloudinary_deleted: mediaItems.length,
      };
    } catch (error) {
      ServiceError(error, 'Media hard delete failed');
    }
  },

  // Api methods directly for the media.

  async softDeleteWithId(id, connection = null) {
    try {
      const media = await this.getOne(id);

      if (!media) {
        throw new ApiError(404, 'Media not found');
      }
      // mediaConditions should be like: { model_type: 'product', model_id: 123 }
      const result = await dbHelper.softDeleteMany(
        'media',
        { media_id: id },
        connection,
        'is_deleted',
      );

      return {
        affectedRows: result.affectedRows,
      };
    } catch (error) {
      ServiceError(error, 'Media delete failed');
    }
  },

  // async getAll(filters = {}) {
  //   try {
  //     return dbHelper.getAll({
  //       table: 'media',
  //       where: { ...filters, is_deleted: 0 },
  //       orderBy: [{ key: 'sort_order', value: 'ASC' }],
  //     });
  //   } catch (error) {
  //     ServiceError(err, 'Failed to load media');
  //   }
  // },

  // Get one media
  async getOne(id) {
    try {
      const result = await dbHelper.getOne({
        table: 'media',
        where: { media_id: id },
      });
      return result;
    } catch (error) {
      ServiceError(err, 'Media update failed');
    }
  },

  // // For update is_primary and sort order.
  // async updateOne(id, data) {
  //   try {
  //     const result = await dbHelper.updateOne('media', data, { media_id: id });
  //     return id;
  //   } catch (error) {
  //     ServiceError(err, 'Media update failed');
  //   }
  // },
};
