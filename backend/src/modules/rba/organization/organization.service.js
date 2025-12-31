import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const organizationService = {
  async getAll() {
    try {
      const organizations = await dbHelper.getAll({
        table: 'organization',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return organizations;
    } catch (err) {
      ServiceError(err, 'Failed to load organizations');
    }
  },

  async getById(id) {
    try {
      const organization = await dbHelper.getOne({
        table: 'organization',
        where: { organization_id: id },
        deletedColumn: 'is_deleted',
      });

      if (!organization) {
        throw new ApiError(404, 'Organization not found');
      }
      return organization;
    } catch (err) {
      ServiceError(err, 'Failed to get organization');
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
          table: 'organization',
          where: { organization_id: data.parent_id },
          deletedColumn: 'is_deleted',
        });
        if (!parent) {
          throw new ApiError(404, 'Parent organization not found');
        }
      }

      const result = await dbHelper.createOne(
        'organization',
        {
          name: data.name,
          type: data.type,
          parent_id: data.parent_id || 0,
        },
        connection,
      );

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create organization');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { organization_id: result.insertId };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create organization');
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
        if (data.parent_id === parseInt(id)) {
          throw new ApiError(400, 'Organization cannot be its own parent');
        }
        const parent = await dbHelper.getOne({
          table: 'organization',
          where: { organization_id: data.parent_id },
          deletedColumn: 'is_deleted',
        });
        if (!parent) {
          throw new ApiError(404, 'Parent organization not found');
        }
      }

      const updateData = {
        name: data.name,
        type: data.type,
        parent_id: data.parent_id,
      };

      console.log(updateData);

      const result = await dbHelper.updateOne(
        'organization',
        updateData,
        { organization_id: id },
        connection,
      );

      console.log(result);

      if (!result) {
        throw new ApiError(404, 'Organization not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { organization_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update organization');
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
        'organization',
        { organization_id: id },
        connection,
      );

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Organization not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { organization_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete organization');
    }
  },

  async getAllWithDeleted() {
    try {
      const organizations = await dbHelper.getAllWithDeleted({
        table: 'organization',
        orderBy: [{ key: 'created_at', value: 'DESC' }],
      });
      return organizations;
    } catch (err) {
      ServiceError(err, 'Failed to load organizations with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const organization = await dbHelper.getOneWithDeleted({
        table: 'organization',
        where: { organization_id: id },
        primaryKey: 'organization_id',
      });

      if (!organization) {
        throw new ApiError(404, 'Organization not found');
      }
      return organization;
    } catch (err) {
      ServiceError(err, 'Failed to get organization with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(id);

      const result = await dbHelper.deleteOne('organization', { organization_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Organization not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return { organization_id: id };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete organization');
    }
  },
};
