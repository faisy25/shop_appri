import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const roleFeaturePermissionService = {
  async bulkAssignPermissions(roleId, permissions) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // Verify role exists
      const role = await dbHelper.getOne(
        {
          table: 'role',
          where: { role_id: roleId },
          deletedColumn: 'is_deleted',
        },
        connection,
      );
      if (!role) {
        throw new ApiError(404, 'Role not found');
      }

      const results = [];
      const errors = [];

      for (const perm of permissions) {
        try {
          // Verify feature exists
          const feature = await dbHelper.getOne(
            {
              table: 'feature',
              where: { feature_id: perm.feature_id },
              deletedColumn: 'is_deleted',
            },
            connection,
          );
          if (!feature) {
            errors.push({
              feature_id: perm.feature_id,
              permission_id: perm.permission_id,
              error: 'Feature not found',
            });
            continue;
          }

          // Verify permission exists
          const permission = await dbHelper.getOne(
            {
              table: 'permission',
              where: { permission_id: perm.permission_id },
              deletedColumn: 'is_deleted',
            },
            connection,
          );
          if (!permission) {
            errors.push({
              feature_id: perm.feature_id,
              permission_id: perm.permission_id,
              error: 'Permission not found',
            });
            continue;
          }

          // Check if already exists
          const existing = await dbHelper.getOneWithDeleted(
            {
              table: 'role_feature_permission',
              where: {
                role_id: roleId,
                feature_id: perm.feature_id,
                permission_id: perm.permission_id,
              },
            },
            connection,
          );

          if (existing) {
            if (existing.is_deleted === 0) {
              results.push({
                role_id: roleId,
                feature_id: perm.feature_id,
                permission_id: perm.permission_id,
                status: 'already_exists',
              });
            } else {
              // Restore soft deleted record
              await dbHelper.updateOne(
                'role_feature_permission',
                { is_deleted: 0 },
                {
                  role_id: roleId,
                  feature_id: perm.feature_id,
                  permission_id: perm.permission_id,
                },
                connection,
              );
              results.push({
                role_id: roleId,
                feature_id: perm.feature_id,
                permission_id: perm.permission_id,
                status: 'restored',
              });
            }
          } else {
            // Create new record
            await dbHelper.createOne(
              'role_feature_permission',
              {
                role_id: roleId,
                feature_id: perm.feature_id,
                permission_id: perm.permission_id,
              },
              connection,
            );
            results.push({
              role_id: roleId,
              feature_id: perm.feature_id,
              permission_id: perm.permission_id,
              status: 'created',
            });
          }
        } catch (err) {
          errors.push({
            feature_id: perm.feature_id,
            permission_id: perm.permission_id,
            error: err.message,
          });
        }
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        success: errors.length === 0,
        results,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to bulk assign permissions');
    }
  },

  async bulkRemovePermissions(roleId, permissions) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      const results = [];
      const errors = [];

      for (const perm of permissions) {
        try {
          const existing = await dbHelper.getOneWithDeleted(
            {
              table: 'role_feature_permission',
              where: {
                role_id: roleId,
                feature_id: perm.feature_id,
                permission_id: perm.permission_id,
              },
            },
            connection,
          );

          if (!existing) {
            errors.push({
              feature_id: perm.feature_id,
              permission_id: perm.permission_id,
              error: 'Permission not found',
            });
            continue;
          }

          // Hard delete the permission
          const sql = `
            DELETE FROM role_feature_permission
            WHERE role_id = ? 
              AND feature_id = ? 
              AND permission_id = ?
          `;
          const [result] = await connection.query(sql, [
            roleId,
            perm.feature_id,
            perm.permission_id,
          ]);

          if (result.affectedRows > 0) {
            results.push({
              role_id: roleId,
              feature_id: perm.feature_id,
              permission_id: perm.permission_id,
              status: 'deleted',
            });
          } else {
            errors.push({
              feature_id: perm.feature_id,
              permission_id: perm.permission_id,
              error: 'Failed to delete',
            });
          }
        } catch (err) {
          errors.push({
            feature_id: perm.feature_id,
            permission_id: perm.permission_id,
            error: err.message,
          });
        }
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        success: errors.length === 0,
        results,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to bulk remove permissions');
    }
  },

  async getPermissionsByRole(roleId) {
    try {
      const permissions = await dbHelper.getAll({
        table: 'role_feature_permission',
        selectColumns: [
          'role_feature_permission.role_id',
          'role_feature_permission.feature_id',
          'role_feature_permission.permission_id',
          'role.name as role_name',
          'feature.name as feature_name',
          'feature.route as feature_route',
          'permission.name as permission_name',
        ],
        where: { 'role_feature_permission.role_id': roleId },
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
        deletedColumn: 'role_feature_permission.is_deleted',
      });
      // Handle case where getAll returns false (error) or null
      return Array.isArray(permissions) ? permissions : [];
    } catch (err) {
      ServiceError(err, 'Failed to get permissions by role');
    }
  },

  /**
   * Get all permissions for a user across all their roles
   * Returns unique permissions (deduplicated by feature_id + permission_id)
   * @param {number} userId - User ID
   * @returns {Array} Array of unique permissions
   */
  async getPermissionsByUser(userId) {
    try {
      const permissions = await dbHelper.getAll({
        table: 'role_feature_permission',
        selectColumns: [
          'role_feature_permission.feature_id',
          'role_feature_permission.permission_id',
          'feature.name as feature_name',
          'feature.route as feature_route',
          'permission.name as permission_name',
        ],
        where: {
          'user_role.user_id': userId,
          'user_role.is_deleted': 0,
        },
        joinArray: [
          {
            table: 'user_role',
            condition: 'role_feature_permission.role_id = user_role.role_id',
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
        groupBy: [
          'role_feature_permission.feature_id',
          'role_feature_permission.permission_id',
          'feature.name',
          'feature.route',
          'permission.name',
        ],
        deletedColumn: 'user_role.is_deleted', // Check is_deleted on user_role
      });
      return permissions;
    } catch (err) {
      ServiceError(err, 'Failed to get permissions by user');
    }
  },
};
