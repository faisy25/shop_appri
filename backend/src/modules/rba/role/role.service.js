import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';
import { organizationDepartmentDesignationService } from '../organizationDepartmentDesignation/organizationDepartmentDesignation.service.js';
import { roleFeaturePermissionService } from '../roleFeaturePermission/roleFeaturePermission.service.js';
import { formatRoleResponse } from './role.validation.js';

/**
 * Helper function to generate role_id from organization_id, department_id, and designation_id
 * Concatenates without separators: orgId + deptId + desigId
 */
const generateRoleId = (organizationId, departmentId, designationId) => {
  return `${organizationId}${departmentId}${designationId}`;
};

// Common select columns and joins for role queries
const roleSelectColumns = [
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
];

const roleJoinArray = [
  {
    table: 'organization_department_designation',
    condition:
      'role.role_id = CONCAT(organization_department_designation.organization_id, organization_department_designation.department_id, organization_department_designation.designation_id)',
    join_type: 'LEFT',
  },
  {
    table: 'organization',
    condition: 'organization_department_designation.organization_id = organization.organization_id',
    join_type: 'LEFT',
  },
  {
    table: 'department',
    condition: 'organization_department_designation.department_id = department.department_id',
    join_type: 'LEFT',
  },
  {
    table: 'designation',
    condition: 'organization_department_designation.designation_id = designation.designation_id',
    join_type: 'LEFT',
  },
];

export const roleService = {
  /**
   * Get all roles with filters for organization, department, and designation
   * @param {Object} query - Query parameters from request (req.query)
   */
  async getAll(query = {}) {
    try {
      const whereConditions = {};

      // Extract and filter query parameters
      const filters = {};
      if (query.organization_id) {
        filters.organization_id = parseInt(query.organization_id);
      }
      if (query.department_id) {
        filters.department_id = query.department_id;
      }
      if (query.designation_id) {
        filters.designation_id = query.designation_id;
      }

      // Build WHERE conditions for filters
      // Filter on organization_department_designation fields only if filters are provided
      // Also add is_deleted checks for joined tables
      if (filters.organization_id) {
        whereConditions['organization_department_designation.organization_id'] =
          filters.organization_id;
        whereConditions['organization_department_designation.is_deleted'] = 0;
      }
      if (filters.department_id) {
        whereConditions['organization_department_designation.department_id'] =
          filters.department_id;
        if (!filters.organization_id) {
          whereConditions['organization_department_designation.is_deleted'] = 0;
        }
      }
      if (filters.designation_id) {
        whereConditions['organization_department_designation.designation_id'] =
          filters.designation_id;
        if (!filters.organization_id && !filters.department_id) {
          whereConditions['organization_department_designation.is_deleted'] = 0;
        }
      }

      // Build JOIN condition: Match role_id with concatenated IDs from organization_department_designation
      // Since role_id = CONCAT(org_id, dept_id, desig_id) without separators,
      // we JOIN on: role.role_id = CONCAT(odd.organization_id, odd.department_id, odd.designation_id)
      const roles = await dbHelper.getAll({
        table: 'role',
        selectColumns: roleSelectColumns,
        where: whereConditions,
        joinArray: roleJoinArray,
        orderBy: [{ key: 'role.created_at', value: 'DESC' }],
        deletedColumn: 'role.is_deleted',
      });

      // Handle case where dbHelper returns false on error
      if (roles === false) {
        throw new Error('Database query failed');
      }

      // Ensure roles is an array (handle empty results)
      if (!Array.isArray(roles)) {
        return [];
      }

      // Format response with nested objects
      return roles.map(formatRoleResponse);
    } catch (err) {
      console.error('Error in roleService.getAll:', err.message || err);
      ServiceError(err, 'Failed to load roles');
    }
  },

  async getById(id) {
    try {
      const role = await dbHelper.getOne({
        table: 'role',
        selectColumns: roleSelectColumns,
        where: { 'role.role_id': id },
        joinArray: roleJoinArray,
        deletedColumn: 'role.is_deleted',
      });

      if (!role) {
        throw new ApiError(404, 'Role not found');
      }

      const formattedRole = formatRoleResponse(role);

      // Get permissions for this role
      const permissions = await roleFeaturePermissionService.getPermissionsByRole(id);
      formattedRole.permissions = permissions || [];
      formattedRole.permission_count = permissions ? permissions.length : 0;

      return formattedRole;
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
      // Validate required fields
      if (!data.organization_id || !data.department_id || !data.designation_id) {
        throw new ApiError(400, 'organization_id, department_id, and designation_id are required');
      }

      // Verify organization, department, and designation exist
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

      // Generate role_id: concatenate without separators
      const roleId = generateRoleId(data.organization_id, data.department_id, data.designation_id);

      // Generate role name: designation_name - department_name (with hyphen separator)
      const roleName = `${designation.name}-${department.name}`;

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
            name: roleName,
            description: data.description || '',
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
            name: roleName,
            description: data.description || '',
          },
          connection,
        );

        if (!result || result === false) {
          throw new ApiError(500, 'Failed to create role');
        }
      }

      // Ensure organization_department_designation entry exists (create or restore if soft-deleted)
      await organizationDepartmentDesignationService.ensureExistsOrRestore(
        data.organization_id,
        data.department_id,
        data.designation_id,
        connection,
      );

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      // Return the created role with full details
      return await this.getById(roleId);
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
      // Get existing role with raw data for update operations
      const existingRoleRaw = await dbHelper.getOne({
        table: 'role',
        selectColumns: [
          'role.role_id',
          'role.name',
          'role.description',
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
        ],
        where: { 'role.role_id': id },
        joinArray: [
          {
            table: 'organization_department_designation',
            condition:
              'role.role_id = CONCAT(organization_department_designation.organization_id, organization_department_designation.department_id, organization_department_designation.designation_id)',
            join_type: 'LEFT',
          },
        ],
        deletedColumn: 'is_deleted',
      });

      if (!existingRoleRaw) {
        throw new ApiError(404, 'Role not found');
      }

      // If updating organization, department, or designation, need to create new role_id
      if (data.organization_id || data.department_id || data.designation_id) {
        // Get current values
        const currentOrgId = data.organization_id || existingRoleRaw.organization_id;
        const currentDeptId = data.department_id || existingRoleRaw.department_id;
        const currentDesigId = data.designation_id || existingRoleRaw.designation_id;

        if (!currentOrgId || !currentDeptId || !currentDesigId) {
          throw new ApiError(
            400,
            'Cannot update: organization, department, and designation must all be provided',
          );
        }

        // Verify new values exist
        if (data.organization_id) {
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
        }

        if (data.department_id) {
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
        }

        if (data.designation_id) {
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
        }

        // Get names for role name generation
        const finalOrgId = data.organization_id || currentOrgId;
        const finalDeptId = data.department_id || currentDeptId;
        const finalDesigId = data.designation_id || currentDesigId;

        const organization = await dbHelper.getOne(
          {
            table: 'organization',
            where: { organization_id: finalOrgId },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        const department = await dbHelper.getOne(
          {
            table: 'department',
            where: { department_id: finalDeptId },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        const designation = await dbHelper.getOne(
          {
            table: 'designation',
            where: { designation_id: finalDesigId },
            deletedColumn: 'is_deleted',
          },
          connection,
        );

        // Generate new role_id and role name
        const newRoleId = generateRoleId(finalOrgId, finalDeptId, finalDesigId);
        const roleName = `${designation.name}-${department.name}`;

        // If role_id changed, need to handle it as delete + create
        if (newRoleId !== id) {
          // Check if new role already exists
          const newRoleExists = await dbHelper.getOneWithDeleted(
            {
              table: 'role',
              where: { role_id: newRoleId },
            },
            connection,
          );

          if (newRoleExists && newRoleExists.is_deleted === 0) {
            throw new ApiError(
              400,
              'Role already exists for the new organization, department, and designation combination',
            );
          }

          // Soft delete old role
          await dbHelper.softDeleteOne('role', { role_id: id }, connection);

          // Create or restore new role
          if (newRoleExists && newRoleExists.is_deleted === 1) {
            await dbHelper.updateOne(
              'role',
              {
                name: roleName,
                description:
                  data.description !== undefined ? data.description : existingRoleRaw.description,
                is_deleted: 0,
              },
              { role_id: newRoleId },
              connection,
            );
          } else {
            await dbHelper.createOne(
              'role',
              {
                role_id: newRoleId,
                name: roleName,
                description:
                  data.description !== undefined ? data.description : existingRoleRaw.description,
              },
              connection,
            );
          }

          // Update organization_department_designation (soft delete old, ensure new exists)
          // Soft delete old record using service
          await organizationDepartmentDesignationService.softDelete(
            existingRoleRaw.organization_id,
            existingRoleRaw.department_id,
            existingRoleRaw.designation_id,
            connection,
          );

          // Ensure new organization_department_designation entry exists (create or restore if soft-deleted)
          await organizationDepartmentDesignationService.ensureExistsOrRestore(
            finalOrgId,
            finalDeptId,
            finalDesigId,
            connection,
          );

          const committed = await dbHelper.commitTransaction(connection);
          if (!committed) {
            throw new ApiError(500, 'Failed to commit transaction');
          }

          return await this.getById(newRoleId);
        } else {
          // Role_id unchanged, just update name and description
          // Recalculate role name in case designation or department names changed
          const result = await dbHelper.updateOne(
            'role',
            {
              name: roleName,
              description:
                data.description !== undefined ? data.description : existingRoleRaw.description,
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

          return await this.getById(id);
        }
      } else {
        // Only updating description, but still need to recalculate role name
        // in case organization/department/designation names changed
        if (
          !existingRoleRaw.organization_id ||
          !existingRoleRaw.department_id ||
          !existingRoleRaw.designation_id
        ) {
          throw new ApiError(
            400,
            'Role is missing organization, department, or designation information',
          );
        }

        const organization = await dbHelper.getOne(
          {
            table: 'organization',
            where: { organization_id: existingRoleRaw.organization_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        const department = await dbHelper.getOne(
          {
            table: 'department',
            where: { department_id: existingRoleRaw.department_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        const designation = await dbHelper.getOne(
          {
            table: 'designation',
            where: { designation_id: existingRoleRaw.designation_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );

        const roleName = `${designation.name}-${department.name}`;

        const result = await dbHelper.updateOne(
          'role',
          {
            name: roleName,
            description:
              data.description !== undefined ? data.description : existingRoleRaw.description,
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

        return await this.getById(id);
      }
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

      // Get the organization_department_designation info to soft delete it too
      const role = await dbHelper.getOne({
        table: 'role',
        selectColumns: [
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
        ],
        where: { 'role.role_id': id },
        joinArray: [
          {
            table: 'organization_department_designation',
            condition:
              'role.role_id = CONCAT(organization_department_designation.organization_id, organization_department_designation.department_id, organization_department_designation.designation_id)',
            join_type: 'LEFT',
          },
        ],
        deletedColumn: 'role.is_deleted',
      });

      // Soft delete role
      const result = await dbHelper.softDeleteOne('role', { role_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Role not found or already deleted');
      }

      // Soft delete organization_department_designation if it exists
      if (role && role.organization_id && role.department_id && role.designation_id) {
        await organizationDepartmentDesignationService.softDelete(
          role.organization_id,
          role.department_id,
          role.designation_id,
          connection,
        );
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
        selectColumns: [...roleSelectColumns, 'role.is_deleted'],
        joinArray: roleJoinArray,
        orderBy: [{ key: 'role.created_at', value: 'DESC' }],
      });

      return roles.map(formatRoleResponse);
    } catch (err) {
      ServiceError(err, 'Failed to load roles with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const role = await dbHelper.getOneWithDeleted({
        table: 'role',
        selectColumns: [...roleSelectColumns, 'role.is_deleted'],
        where: { 'role.role_id': id },
        joinArray: roleJoinArray,
      });

      if (!role) {
        throw new ApiError(404, 'Role not found');
      }

      return formatRoleResponse(role);
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

      // Get the organization_department_designation info to hard delete it too
      const role = await dbHelper.getOneWithDeleted({
        table: 'role',
        selectColumns: [
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
        ],
        where: { 'role.role_id': id },
        joinArray: [
          {
            table: 'organization_department_designation',
            condition:
              'role.role_id = CONCAT(organization_department_designation.organization_id, organization_department_designation.department_id, organization_department_designation.designation_id)',
            join_type: 'LEFT',
          },
        ],
      });

      // Hard delete role
      const result = await dbHelper.deleteOne('role', { role_id: id }, connection);

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Role not found');
      }

      // Hard delete organization_department_designation if it exists
      if (role && role.organization_id && role.department_id && role.designation_id) {
        await organizationDepartmentDesignationService.hardDelete(
          role.organization_id,
          role.department_id,
          role.designation_id,
          connection,
        );
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
