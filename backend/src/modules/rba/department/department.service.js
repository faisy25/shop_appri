import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const departmentService = {
  async getAll() {
    try {
      const departments = await dbHelper.getAll({
        table: 'department',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return departments;
    } catch (err) {
      ServiceError(err, 'Failed to load departments');
    }
  },

  async getById(id) {
    try {
      const department = await dbHelper.getOne({
        table: 'department',
        where: { department_id: id },
        deletedColumn: 'is_deleted',
      });

      if (!department) {
        throw new ApiError(404, 'Department not found');
      }
      return department;
    } catch (err) {
      ServiceError(err, 'Failed to get department');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      const result = await dbHelper.createOne(
        'department',
        {
          department_id: data.department_id,
          name: data.name,
          description: data.description,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create department');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { department_id: data.department_id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create department');
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
        'department',
        {
          name: data.name,
          description: data.description,
        },
        { department_id: id },
        connection,
      );

      if (!result) {
        throw new ApiError(404, 'Department not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { department_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update department');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const result = await dbHelper.softDeleteOne('department', { department_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Department not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { department_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete department');
    }
  },

  async getAllWithDeleted() {
    try {
      const departments = await dbHelper.getAllWithDeleted({
        table: 'department',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
      });
      return departments;
    } catch (err) {
      ServiceError(err, 'Failed to load departments with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const department = await dbHelper.getOneWithDeleted({
        table: 'department',
        where: { department_id: id },
        primaryKey: 'department_id',
      });

      if (!department) {
        throw new ApiError(404, 'Department not found');
      }
      return department;
    } catch (err) {
      ServiceError(err, 'Failed to get department with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      const result = await dbHelper.deleteOne('department', { department_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Department not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { department_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete department');
    }
  },
};
