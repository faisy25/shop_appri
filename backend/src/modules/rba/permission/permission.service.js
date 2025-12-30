import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const permissionService = {
  async getAll() {
    try {
      const permissions = await dbHelper.getAll({
        table: 'permission',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return permissions;
    } catch (err) {
      ServiceError(err, 'Failed to load permissions');
    }
  },

  async getById(id) {
    try {
      const permission = await dbHelper.getOne({
        table: 'permission',
        where: { permission_id: id },
        deletedColumn: 'is_deleted',
      });

      if (!permission) {
        throw new ApiError(404, 'Permission not found');
      }
      return permission;
    } catch (err) {
      ServiceError(err, 'Failed to get permission');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      const result = await dbHelper.createOne(
        'permission',
        {
          permission_id: data.permission_id,
          name: data.name,
          description: data.description,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create permission');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { permission_id: data.permission_id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create permission');
    }
  },

  async update(id, data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const result = await dbHelper.updateOne(
        'permission',
        {
          name: data.name,
          description: data.description,
        },
        { permission_id: id },
        connection,
      );

      if (!result) {
        throw new ApiError(404, 'Permission not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { permission_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update permission');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const result = await dbHelper.softDeleteOne('permission', { permission_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Permission not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { permission_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete permission');
    }
  },

  async getAllWithDeleted() {
    try {
      const permissions = await dbHelper.getAllWithDeleted({
        table: 'permission',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
      });
      return permissions;
    } catch (err) {
      ServiceError(err, 'Failed to load permissions with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const permission = await dbHelper.getOneWithDeleted({
        table: 'permission',
        where: { permission_id: id },
        primaryKey: 'permission_id',
      });

      if (!permission) {
        throw new ApiError(404, 'Permission not found');
      }
      return permission;
    } catch (err) {
      ServiceError(err, 'Failed to get permission with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      const result = await dbHelper.deleteOne('permission', { permission_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Permission not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { permission_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete permission');
    }
  },
};
