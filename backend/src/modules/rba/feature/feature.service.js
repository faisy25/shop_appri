import dbHelper from '../../util/database/dbHelper.js';
import ApiError from '../../util/error/api.error.js';
import { ServiceError } from '../../util/error/service.error.js';

export const featureService = {
  async getAll() {
    try {
      const features = await dbHelper.getAll({
        table: 'feature',
        orderBy: [
          { key: 'sort_order', value: 'ASC' },
          { key: 'created_at', value: 'DESC' },
        ],
        deletedColumn: 'is_deleted',
      });
      return features;
    } catch (err) {
      ServiceError(err, 'Failed to load features');
    }
  },

  async getById(id) {
    try {
      const feature = await dbHelper.getOne({
        table: 'feature',
        where: { feature_id: id },
        deletedColumn: 'is_deleted',
      });

      if (!feature) {
        throw new ApiError(404, 'Feature not found');
      }
      return feature;
    } catch (err) {
      ServiceError(err, 'Failed to get feature');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // Validate parent_id exists if provided
      if (data.parent_id) {
        const parent = await dbHelper.getOne({
          table: 'feature',
          where: { feature_id: data.parent_id },
          deletedColumn: 'is_deleted',
        });
        if (!parent) {
          throw new ApiError(404, 'Parent feature not found');
        }
      }

      const result = await dbHelper.createOne(
        'feature',
        {
          name: data.name,
          description: data.description,
          fk_id: data.fk_id || 0,
          parent_id: data.parent_id || null,
          sort_order: data.sort_order || 0,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create feature');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { feature_id: result.insertId };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create feature');
    }
  },

  async update(id, data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      // Validate parent_id exists if provided
      if (data.parent_id) {
        if (data.parent_id === parseInt(id)) {
          throw new ApiError(400, 'Feature cannot be its own parent');
        }
        const parent = await dbHelper.getOne({
          table: 'feature',
          where: { feature_id: data.parent_id },
          deletedColumn: 'is_deleted',
        });
        if (!parent) {
          throw new ApiError(404, 'Parent feature not found');
        }
      }

      const updateData = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.fk_id !== undefined) updateData.fk_id = data.fk_id;
      if (data.parent_id !== undefined) updateData.parent_id = data.parent_id;
      if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;

      const result = await dbHelper.updateOne(
        'feature',
        updateData,
        { feature_id: id },
        connection,
      );

      if (!result) {
        throw new ApiError(404, 'Feature not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { feature_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update feature');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const result = await dbHelper.softDeleteOne('feature', { feature_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Feature not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { feature_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete feature');
    }
  },

  async getAllWithDeleted() {
    try {
      const features = await dbHelper.getAllWithDeleted({
        table: 'feature',
        orderBy: [
          { key: 'sort_order', value: 'ASC' },
          { key: 'created_at', value: 'DESC' },
        ],
      });
      return features;
    } catch (err) {
      ServiceError(err, 'Failed to load features with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const feature = await dbHelper.getOneWithDeleted({
        table: 'feature',
        where: { feature_id: id },
        primaryKey: 'feature_id',
      });

      if (!feature) {
        throw new ApiError(404, 'Feature not found');
      }
      return feature;
    } catch (err) {
      ServiceError(err, 'Failed to get feature with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      const result = await dbHelper.deleteOne('feature', { feature_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Feature not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { feature_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete feature');
    }
  },
};
