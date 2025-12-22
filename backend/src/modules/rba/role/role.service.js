import dbHelper from '../../util/database/dbHelper.js';
import ApiError from '../../util/error/api.error.js';
import { ServiceError } from '../../util/error/service.error.js';

export const roleService = {
  async getAll() {
    try {
      const roles = await dbHelper.getAll({
        table: 'role',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return roles;
    } catch (err) {
      ServiceError(err, 'Failed to load roles');
    }
  },

  async getById(id) {
    try {
      const role = await dbHelper.getOne({
        table: 'role',
        where: { role_id: id },
        deletedColumn: 'is_deleted',
      });

      if (!role) {
        throw new ApiError(404, 'Role not found');
      }
      return role;
    } catch (err) {
      ServiceError(err, 'Failed to get role');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      const result = await dbHelper.createOne(
        'role',
        {
          role_id: data.role_id,
          name: data.name,
          description: data.description,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create role');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { role_id: data.role_id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create role');
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
        'role',
        {
          name: data.name,
          description: data.description,
        },
        { role_id: id },
        connection,
      );

      if (!result) {
        throw new ApiError(404, 'Role not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { role_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update role');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const result = await dbHelper.softDeleteOne('role', { role_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Role not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { role_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete role');
    }
  },

  async getAllWithDeleted() {
    try {
      const roles = await dbHelper.getAllWithDeleted({
        table: 'role',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
      });
      return roles;
    } catch (err) {
      ServiceError(err, 'Failed to load roles with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const role = await dbHelper.getOneWithDeleted({
        table: 'role',
        where: { role_id: id },
        primaryKey: 'role_id',
      });

      if (!role) {
        throw new ApiError(404, 'Role not found');
      }
      return role;
    } catch (err) {
      ServiceError(err, 'Failed to get role with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      const result = await dbHelper.deleteOne('role', { role_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Role not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { role_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete role');
    }
  },
};
