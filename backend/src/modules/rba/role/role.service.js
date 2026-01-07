import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const roleService = {
  async getAll() {
    try {
      const roles = await dbHelper.getAll({
        table: 'role',
        selectColumns: [
          'role.role_id',
          'role.name',
          'role.description',
          'role.created_at',
          'role.updated_at',
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        joinArray: [
          {
            table: 'organization_department_designation',
            condition:
              'CONCAT(organization_department_designation.organization_id, "-", organization_department_designation.department_id, "-", organization_department_designation.designation_id) = role.role_id',
            join_type: 'LEFT',
          },
          {
            table: 'organization',
            condition:
              'organization_department_designation.organization_id = organization.organization_id',
            join_type: 'LEFT',
          },
          {
            table: 'department',
            condition:
              'organization_department_designation.department_id = department.department_id',
            join_type: 'LEFT',
          },
          {
            table: 'designation',
            condition:
              'organization_department_designation.designation_id = designation.designation_id',
            join_type: 'LEFT',
          },
        ],
        orderBy: [{ key: 'role.created_at', value: 'DESC' }],
        // deletedColumn: 'is_deleted',
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
        selectColumns: [
          'role.role_id',
          'role.name',
          'role.description',
          'role.created_at',
          'role.updated_at',
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        where: { role_id: id },
        joinArray: [
          {
            table: 'organization_department_designation',
            condition:
              'CONCAT(organization_department_designation.organization_id, "-", organization_department_designation.department_id, "-", organization_department_designation.designation_id) = role.role_id',
            join_type: 'LEFT',
          },
          {
            table: 'organization',
            condition:
              'organization_department_designation.organization_id = organization.organization_id',
            join_type: 'LEFT',
          },
          {
            table: 'department',
            condition:
              'organization_department_designation.department_id = department.department_id',
            join_type: 'LEFT',
          },
          {
            table: 'designation',
            condition:
              'organization_department_designation.designation_id = designation.designation_id',
            join_type: 'LEFT',
          },
        ],
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
      // Verify organization, department, and designation exist
      if (data.organization_id && data.department_id && data.designation_id) {
        const organization = await dbHelper.getOne(
          {
            table: 'organization',
            where: { organization_id: data.organization_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!organization) {
          throw new ApiError(404, 'Organization not found');
        }

        const department = await dbHelper.getOne(
          {
            table: 'department',
            where: { department_id: data.department_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!department) {
          throw new ApiError(404, 'Department not found');
        }

        const designation = await dbHelper.getOne(
          {
            table: 'designation',
            where: { designation_id: data.designation_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!designation) {
          throw new ApiError(404, 'Designation not found');
        }

        // Generate role_id from organization_id + department_id + designation_id
        const roleId = `${data.organization_id}-${data.department_id}-${data.designation_id}`;

        // Check if role already exists
        const existingRole = await dbHelper.getOneWithDeleted(
          {
            table: 'role',
            where: { role_id: roleId },
          },
          connection,
        );

        if (existingRole && existingRole.is_deleted === 0) {
          throw new ApiError(
            400,
            'Role already exists for this organization, department, and designation combination',
          );
        }

        // Create or restore role
        if (existingRole && existingRole.is_deleted === 1) {
          await dbHelper.updateOne(
            'role',
            {
              name: data.name,
              description: data.description,
              is_deleted: 0,
            },
            { role_id: roleId },
            connection,
          );
        } else {
          const result = await dbHelper.createOne(
            'role',
            {
              role_id: roleId,
              name: data.name,
              description: data.description,
            },
            connection,
          );

          if (!result || result === false) {
            throw new ApiError(500, 'Failed to create role');
          }
        }

        // Create or restore organization_department_designation entry
        const existingODD = await dbHelper.getOneWithDeleted(
          {
            table: 'organization_department_designation',
            where: {
              organization_id: data.organization_id,
              department_id: data.department_id,
              designation_id: data.designation_id,
            },
          },
          connection,
        );

        if (existingODD && existingODD.is_deleted === 1) {
          await dbHelper.updateOne(
            'organization_department_designation',
            { is_deleted: 0 },
            {
              organization_id: data.organization_id,
              department_id: data.department_id,
              designation_id: data.designation_id,
            },
            connection,
          );
        } else if (!existingODD) {
          const oddResult = await dbHelper.createOne(
            'organization_department_designation',
            {
              organization_id: data.organization_id,
              department_id: data.department_id,
              designation_id: data.designation_id,
            },
            connection,
          );

          if (!oddResult || oddResult === false) {
            throw new ApiError(500, 'Failed to create organization department designation');
          }
        }

        const committed = await dbHelper.commitTransaction(connection);
        if (!committed) {
          throw new ApiError(500, 'Failed to commit transaction');
        }

        return { role_id: roleId };
      } else {
        // If role_id is provided directly (for backward compatibility)
        if (!data.role_id) {
          throw new ApiError(
            400,
            'Either role_id or organization_id+department_id+designation_id must be provided',
          );
        }

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
      }
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
