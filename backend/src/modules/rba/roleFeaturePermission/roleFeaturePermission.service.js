import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const roleFeaturePermissionService = {
  async getAll() {
    try {
      const roleFeaturePermissions = await dbHelper.getAll({
        table: 'role_feature_permission',
        selectColumns: [
          'role_feature_permission.role_id',
          'role_feature_permission.feature_id',
          'role_feature_permission.permission_id',
          'role_feature_permission.created_at',
          'role_feature_permission.updated_at',
          'role.name as role_name',
          'feature.name as feature_name',
          'permission.name as permission_name',
        ],
        joinArray: [
          {
            table: 'role',
            condition: 'role_feature_permission.role_id = role.role_id',
            join_type: 'INNER',
          },
          {
            table: 'feature',
            condition: 'role_feature_permission.feature_id = feature.feature_id',
            join_type: 'INNER',
          },
          {
            table: 'permission',
            condition: 'role_feature_permission.permission_id = permission.permission_id',
            join_type: 'INNER',
          },
        ],
        orderBy: [{ key: 'role_feature_permission.created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return roleFeaturePermissions;
    } catch (err) {
      ServiceError(err, 'Failed to load role feature permissions');
    }
  },

  async getById(roleId, featureId, permissionId) {
    try {
      const roleFeaturePermission = await dbHelper.getOne({
        table: 'role_feature_permission',
        selectColumns: [
          'role_feature_permission.role_id',
          'role_feature_permission.feature_id',
          'role_feature_permission.permission_id',
          'role_feature_permission.created_at',
          'role_feature_permission.updated_at',
          'role.name as role_name',
          'feature.name as feature_name',
          'permission.name as permission_name',
        ],
        where: {
          'role_feature_permission.role_id': roleId,
          'role_feature_permission.feature_id': featureId,
          'role_feature_permission.permission_id': permissionId,
        },
        joinArray: [
          {
            table: 'role',
            condition: 'role_feature_permission.role_id = role.role_id',
            join_type: 'INNER',
          },
          {
            table: 'feature',
            condition: 'role_feature_permission.feature_id = feature.feature_id',
            join_type: 'INNER',
          },
          {
            table: 'permission',
            condition: 'role_feature_permission.permission_id = permission.permission_id',
            join_type: 'INNER',
          },
        ],
        deletedColumn: 'is_deleted',
      });

      if (!roleFeaturePermission) {
        throw new ApiError(404, 'Role feature permission not found');
      }
      return roleFeaturePermission;
    } catch (err) {
      ServiceError(err, 'Failed to get role feature permission');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // Verify role exists
      const role = await dbHelper.getOne(
        {
          table: 'role',
          where: { role_id: data.role_id },
          deletedColumn: 'is_deleted',
        },
        connection,
      );
      if (!role) {
        throw new ApiError(404, 'Role not found');
      }

      // Verify feature exists
      const feature = await dbHelper.getOne(
        {
          table: 'feature',
          where: { feature_id: data.feature_id },
          deletedColumn: 'is_deleted',
        },
        connection,
      );
      if (!feature) {
        throw new ApiError(404, 'Feature not found');
      }

      // Verify permission exists
      const permission = await dbHelper.getOne(
        {
          table: 'permission',
          where: { permission_id: data.permission_id },
          deletedColumn: 'is_deleted',
        },
        connection,
      );
      if (!permission) {
        throw new ApiError(404, 'Permission not found');
      }

      // Check if already exists (including soft deleted)
      const existing = await dbHelper.getOneWithDeleted(
        {
          table: 'role_feature_permission',
          where: {
            role_id: data.role_id,
            feature_id: data.feature_id,
            permission_id: data.permission_id,
          },
        },
        connection,
      );

      if (existing) {
        if (existing.is_deleted === 0) {
          throw new ApiError(400, 'Role feature permission already exists');
        } else {
          // Restore soft deleted record
          const result = await dbHelper.updateOne(
            'role_feature_permission',
            { is_deleted: 0 },
            {
              role_id: data.role_id,
              feature_id: data.feature_id,
              permission_id: data.permission_id,
            },
            connection,
          );
          if (!result) {
            throw new ApiError(500, 'Failed to restore role feature permission');
          }
        }
      } else {
        // Create new record
        const result = await dbHelper.createOne(
          'role_feature_permission',
          {
            role_id: data.role_id,
            feature_id: data.feature_id,
            permission_id: data.permission_id,
          },
          connection,
        );

        if (!result || result === false) {
          throw new ApiError(500, 'Failed to create role feature permission');
        }
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        role_id: data.role_id,
        feature_id: data.feature_id,
        permission_id: data.permission_id,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create role feature permission');
    }
  },

  async update(roleId, featureId, permissionId, data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(roleId, featureId, permissionId);

      // If updating to new values, verify they exist
      if (data.role_id && data.role_id !== roleId) {
        const role = await dbHelper.getOne(
          {
            table: 'role',
            where: { role_id: data.role_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!role) {
          throw new ApiError(404, 'New role not found');
        }
      }

      if (data.feature_id && data.feature_id !== featureId) {
        const feature = await dbHelper.getOne(
          {
            table: 'feature',
            where: { feature_id: data.feature_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!feature) {
          throw new ApiError(404, 'New feature not found');
        }
      }

      if (data.permission_id && data.permission_id !== permissionId) {
        const permission = await dbHelper.getOne(
          {
            table: 'permission',
            where: { permission_id: data.permission_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!permission) {
          throw new ApiError(404, 'New permission not found');
        }
      }

      // For composite key tables, update means delete old and create new
      // First soft delete the old record
      const deleteResult = await dbHelper.softDeleteOne(
        'role_feature_permission',
        {
          role_id: roleId,
          feature_id: featureId,
          permission_id: permissionId,
        },
        connection,
      );

      if (!deleteResult || !deleteResult.success) {
        throw new ApiError(500, 'Failed to update role feature permission');
      }

      // Create new record with updated values
      const newRoleId = data.role_id || roleId;
      const newFeatureId = data.feature_id || featureId;
      const newPermissionId = data.permission_id || permissionId;

      const createResult = await dbHelper.createOne(
        'role_feature_permission',
        {
          role_id: newRoleId,
          feature_id: newFeatureId,
          permission_id: newPermissionId,
        },
        connection,
      );

      if (!createResult || createResult === false) {
        throw new ApiError(500, 'Failed to create updated role feature permission');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        role_id: newRoleId,
        feature_id: newFeatureId,
        permission_id: newPermissionId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update role feature permission');
    }
  },

  async softDelete(roleId, featureId, permissionId) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(roleId, featureId, permissionId);

      const result = await dbHelper.softDeleteOne(
        'role_feature_permission',
        {
          role_id: roleId,
          feature_id: featureId,
          permission_id: permissionId,
        },
        connection,
      );

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Role feature permission not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        role_id: roleId,
        feature_id: featureId,
        permission_id: permissionId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete role feature permission');
    }
  },

  async getAllWithDeleted() {
    try {
      const roleFeaturePermissions = await dbHelper.getAllWithDeleted({
        table: 'role_feature_permission',
        selectColumns: [
          'role_feature_permission.role_id',
          'role_feature_permission.feature_id',
          'role_feature_permission.permission_id',
          'role_feature_permission.is_deleted',
          'role_feature_permission.created_at',
          'role_feature_permission.updated_at',
          'role.name as role_name',
          'feature.name as feature_name',
          'permission.name as permission_name',
        ],
        joinArray: [
          {
            table: 'role',
            condition: 'role_feature_permission.role_id = role.role_id',
            join_type: 'LEFT',
          },
          {
            table: 'feature',
            condition: 'role_feature_permission.feature_id = feature.feature_id',
            join_type: 'LEFT',
          },
          {
            table: 'permission',
            condition: 'role_feature_permission.permission_id = permission.permission_id',
            join_type: 'LEFT',
          },
        ],
        orderBy: [{ key: 'role_feature_permission.created_at', value: 'DESC' }],
      });
      return roleFeaturePermissions;
    } catch (err) {
      ServiceError(err, 'Failed to load role feature permissions with deleted');
    }
  },

  async getByIdWithDeleted(roleId, featureId, permissionId) {
    try {
      const roleFeaturePermission = await dbHelper.getOneWithDeleted({
        table: 'role_feature_permission',
        selectColumns: [
          'role_feature_permission.role_id',
          'role_feature_permission.feature_id',
          'role_feature_permission.permission_id',
          'role_feature_permission.is_deleted',
          'role_feature_permission.created_at',
          'role_feature_permission.updated_at',
          'role.name as role_name',
          'feature.name as feature_name',
          'permission.name as permission_name',
        ],
        where: {
          'role_feature_permission.role_id': roleId,
          'role_feature_permission.feature_id': featureId,
          'role_feature_permission.permission_id': permissionId,
        },
        joinArray: [
          {
            table: 'role',
            condition: 'role_feature_permission.role_id = role.role_id',
            join_type: 'LEFT',
          },
          {
            table: 'feature',
            condition: 'role_feature_permission.feature_id = feature.feature_id',
            join_type: 'LEFT',
          },
          {
            table: 'permission',
            condition: 'role_feature_permission.permission_id = permission.permission_id',
            join_type: 'LEFT',
          },
        ],
      });

      if (!roleFeaturePermission) {
        throw new ApiError(404, 'Role feature permission not found');
      }
      return roleFeaturePermission;
    } catch (err) {
      ServiceError(err, 'Failed to get role feature permission with deleted records');
    }
  },

  async hardDelete(roleId, featureId, permissionId) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(roleId, featureId, permissionId);

      const sql = `
        DELETE FROM role_feature_permission
        WHERE role_id = ? 
          AND feature_id = ? 
          AND permission_id = ?
      `;
      const [result] = await connection.query(sql, [roleId, featureId, permissionId]);

      if (result.affectedRows === 0) {
        throw new ApiError(404, 'Role feature permission not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        role_id: roleId,
        feature_id: featureId,
        permission_id: permissionId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete role feature permission');
    }
  },
};
