import dbHelper from '../../util/database/dbHelper.js';
import ApiError from '../../util/error/api.error.js';
import { ServiceError } from '../../util/error/service.error.js';

export const designationService = {
  async getAll() {
    try {
      const designations = await dbHelper.getAll({
        table: 'designation',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return designations;
    } catch (err) {
      ServiceError(err, 'Failed to load designations');
    }
  },

  async getById(id) {
    try {
      const designation = await dbHelper.getOne({
        table: 'designation',
        where: { designation_id: id },
        deletedColumn: 'is_deleted',
      });

      if (!designation) {
        throw new ApiError(404, 'Designation not found');
      }
      return designation;
    } catch (err) {
      ServiceError(err, 'Failed to get designation');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      const result = await dbHelper.createOne(
        'designation',
        {
          designation_id: data.designation_id,
          name: data.name,
          description: data.description,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create designation');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { designation_id: data.designation_id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create designation');
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
        'designation',
        {
          name: data.name,
          description: data.description,
        },
        { designation_id: id },
        connection,
      );

      if (!result) {
        throw new ApiError(404, 'Designation not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { designation_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update designation');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(id);

      const result = await dbHelper.softDeleteOne(
        'designation',
        { designation_id: id },
        connection,
      );

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Designation not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { designation_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete designation');
    }
  },

  async getAllWithDeleted() {
    try {
      const designations = await dbHelper.getAllWithDeleted({
        table: 'designation',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
      });
      return designations;
    } catch (err) {
      ServiceError(err, 'Failed to load designations with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const designation = await dbHelper.getOneWithDeleted({
        table: 'designation',
        where: { designation_id: id },
        primaryKey: 'designation_id',
      });

      if (!designation) {
        throw new ApiError(404, 'Designation not found');
      }
      return designation;
    } catch (err) {
      ServiceError(err, 'Failed to get designation with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      const result = await dbHelper.deleteOne('designation', { designation_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Designation not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { designation_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete designation');
    }
  },
};
