import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const featureService = {
  async getAll(filters = {}) {
    try {
      const where = {};

      // Filter by element_type if provided
      if (filters.element_type) {
        where['f.element_type'] = filters.element_type;
      }

      // Filter by parent_id if provided (including parent_id = 0 for root features)
      if (
        filters.parent_id !== undefined &&
        filters.parent_id !== null &&
        filters.parent_id !== ''
      ) {
        where['f.parent_id'] = parseInt(filters.parent_id);
      }

      const features = await dbHelper.getAll({
        table: 'feature f',
        selectColumns: ['f.*', 'parent.name AS parent_feature'],
        joinArray: [
          {
            table: 'feature AS parent',
            condition:
              'f.parent_id = parent.feature_id AND f.parent_id != 0 AND parent.is_deleted = 0',
            join_type: 'LEFT',
          },
        ],
        where: Object.keys(where).length > 0 ? where : undefined,
        orderBy: [
          { key: 'f.sort_order', value: 'ASC' },
          { key: 'f.created_at', value: 'DESC' },
        ],
        deletedColumn: 'f.is_deleted', // Qualified with table alias to avoid ambiguity
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
      if (data.parent_id !== 0 && data.parent_id !== null) {
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
          element_type: data.element_type || 'menu',
          icon: data.icon || null,
          description: data.description,
          route: data.route || null,
          fk_id: data.fk_id || 0,
          parent_id: data.parent_id || 0,
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
      if (data.parent_id !== 0 && data.parent_id !== null) {
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
      }

      const updateData = {
        name: data.name,
        element_type: data.element_type,
        icon: data.icon,
        description: data.description,
        route: data.route,
        fk_id: data.fk_id,
        parent_id: data.parent_id,
        sort_order: data.sort_order,
      };

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
        table: 'feature f',
        selectColumns: ['f.*', 'parent.name AS parent_feature'],
        joinArray: [
          {
            table: 'feature AS parent',
            condition:
              'f.parent_id = parent.feature_id AND f.parent_id != 0 AND parent.is_deleted = 0',
            join_type: 'LEFT',
          },
        ],
        orderBy: [
          { key: 'f.sort_order', value: 'ASC' },
          { key: 'f.created_at', value: 'DESC' },
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
