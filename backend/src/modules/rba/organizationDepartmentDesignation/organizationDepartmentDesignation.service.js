import dbHelper from '../../../util/database/dbHelper.js';
import ApiError from '../../../util/error/api.error.js';
import { ServiceError } from '../../../util/error/service.error.js';

export const organizationDepartmentDesignationService = {
  async getAll() {
    try {
      const organizationDepartmentDesignations = await dbHelper.getAll({
        table: 'organization_department_designation',
        selectColumns: [
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization_department_designation.created_at',
          'organization_department_designation.updated_at',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        joinArray: [
          {
            table: 'organization',
            condition:
              'organization_department_designation.organization_id = organization.organization_id',
            join_type: 'INNER',
          },
          {
            table: 'department',
            condition:
              'organization_department_designation.department_id = department.department_id',
            join_type: 'INNER',
          },
          {
            table: 'designation',
            condition:
              'organization_department_designation.designation_id = designation.designation_id',
            join_type: 'INNER',
          },
        ],
        orderBy: [{ key: 'organization_department_designation.created_at', value: 'DESC' }],
        deletedColumn: 'is_deleted',
      });
      return organizationDepartmentDesignations;
    } catch (err) {
      ServiceError(err, 'Failed to load organization department designations');
    }
  },

  async getById(organizationId, departmentId, designationId) {
    try {
      const organizationDepartmentDesignation = await dbHelper.getOne({
        table: 'organization_department_designation',
        selectColumns: [
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization_department_designation.created_at',
          'organization_department_designation.updated_at',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        where: {
          'organization_department_designation.organization_id': organizationId,
          'organization_department_designation.department_id': departmentId,
          'organization_department_designation.designation_id': designationId,
        },
        joinArray: [
          {
            table: 'organization',
            condition:
              'organization_department_designation.organization_id = organization.organization_id',
            join_type: 'INNER',
          },
          {
            table: 'department',
            condition:
              'organization_department_designation.department_id = department.department_id',
            join_type: 'INNER',
          },
          {
            table: 'designation',
            condition:
              'organization_department_designation.designation_id = designation.designation_id',
            join_type: 'INNER',
          },
        ],
        deletedColumn: 'is_deleted',
      });

      if (!organizationDepartmentDesignation) {
        throw new ApiError(404, 'Organization department designation not found');
      }
      return organizationDepartmentDesignation;
    } catch (err) {
      ServiceError(err, 'Failed to get organization department designation');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // Verify organization exists
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

      // Verify department exists
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

      // Verify designation exists
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

      // Check if already exists (including soft deleted)
      const existing = await dbHelper.getOneWithDeleted(
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

      if (existing) {
        if (existing.is_deleted === 0) {
          throw new ApiError(400, 'Organization department designation already exists');
        } else {
          // Restore soft deleted record
          const result = await dbHelper.updateOne(
            'organization_department_designation',
            { is_deleted: 0 },
            {
              organization_id: data.organization_id,
              department_id: data.department_id,
              designation_id: data.designation_id,
            },
            connection,
          );
          if (!result) {
            throw new ApiError(500, 'Failed to restore organization department designation');
          }
        }
      } else {
        // Create new record
        const result = await dbHelper.createOne(
          'organization_department_designation',
          {
            organization_id: data.organization_id,
            department_id: data.department_id,
            designation_id: data.designation_id,
          },
          connection,
        );

        if (!result || result === false) {
          throw new ApiError(500, 'Failed to create organization department designation');
        }
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        organization_id: data.organization_id,
        department_id: data.department_id,
        designation_id: data.designation_id,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create organization department designation');
    }
  },

  async update(organizationId, departmentId, designationId, data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(organizationId, departmentId, designationId);

      // If updating to new values, verify they exist
      if (data.organization_id && data.organization_id !== organizationId) {
        const organization = await dbHelper.getOne(
          {
            table: 'organization',
            where: { organization_id: data.organization_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!organization) {
          throw new ApiError(404, 'New organization not found');
        }
      }

      if (data.department_id && data.department_id !== departmentId) {
        const department = await dbHelper.getOne(
          {
            table: 'department',
            where: { department_id: data.department_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!department) {
          throw new ApiError(404, 'New department not found');
        }
      }

      if (data.designation_id && data.designation_id !== designationId) {
        const designation = await dbHelper.getOne(
          {
            table: 'designation',
            where: { designation_id: data.designation_id },
            deletedColumn: 'is_deleted',
          },
          connection,
        );
        if (!designation) {
          throw new ApiError(404, 'New designation not found');
        }
      }

      // For composite key tables, update means delete old and create new
      // First soft delete the old record
      const deleteResult = await dbHelper.softDeleteOne(
        'organization_department_designation',
        {
          organization_id: organizationId,
          department_id: departmentId,
          designation_id: designationId,
        },
        connection,
      );

      if (!deleteResult || !deleteResult.success) {
        throw new ApiError(500, 'Failed to update organization department designation');
      }

      // Create new record with updated values
      const newOrganizationId = data.organization_id || organizationId;
      const newDepartmentId = data.department_id || departmentId;
      const newDesignationId = data.designation_id || designationId;

      const createResult = await dbHelper.createOne(
        'organization_department_designation',
        {
          organization_id: newOrganizationId,
          department_id: newDepartmentId,
          designation_id: newDesignationId,
        },
        connection,
      );

      if (!createResult || createResult === false) {
        throw new ApiError(500, 'Failed to create updated organization department designation');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        organization_id: newOrganizationId,
        department_id: newDepartmentId,
        designation_id: newDesignationId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update organization department designation');
    }
  },

  async softDelete(organizationId, departmentId, designationId) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getById(organizationId, departmentId, designationId);

      const result = await dbHelper.softDeleteOne(
        'organization_department_designation',
        {
          organization_id: organizationId,
          department_id: departmentId,
          designation_id: designationId,
        },
        connection,
      );

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Organization department designation not found or already deleted');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        organization_id: organizationId,
        department_id: departmentId,
        designation_id: designationId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete organization department designation');
    }
  },

  async getAllWithDeleted() {
    try {
      const organizationDepartmentDesignations = await dbHelper.getAllWithDeleted({
        table: 'organization_department_designation',
        selectColumns: [
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization_department_designation.is_deleted',
          'organization_department_designation.created_at',
          'organization_department_designation.updated_at',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        joinArray: [
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
        orderBy: [{ key: 'organization_department_designation.created_at', value: 'DESC' }],
      });
      return organizationDepartmentDesignations;
    } catch (err) {
      ServiceError(err, 'Failed to load organization department designations with deleted');
    }
  },

  async getByIdWithDeleted(organizationId, departmentId, designationId) {
    try {
      const organizationDepartmentDesignation = await dbHelper.getOneWithDeleted({
        table: 'organization_department_designation',
        selectColumns: [
          'organization_department_designation.organization_id',
          'organization_department_designation.department_id',
          'organization_department_designation.designation_id',
          'organization_department_designation.is_deleted',
          'organization_department_designation.created_at',
          'organization_department_designation.updated_at',
          'organization.name as organization_name',
          'department.name as department_name',
          'designation.name as designation_name',
        ],
        where: {
          'organization_department_designation.organization_id': organizationId,
          'organization_department_designation.department_id': departmentId,
          'organization_department_designation.designation_id': designationId,
        },
        joinArray: [
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
      });

      if (!organizationDepartmentDesignation) {
        throw new ApiError(404, 'Organization department designation not found');
      }
      return organizationDepartmentDesignation;
    } catch (err) {
      ServiceError(err, 'Failed to get organization department designation with deleted records');
    }
  },

  async hardDelete(organizationId, departmentId, designationId) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      await this.getByIdWithDeleted(organizationId, departmentId, designationId);

      const sql = `
        DELETE FROM organization_department_designation
        WHERE organization_id = ? 
          AND department_id = ? 
          AND designation_id = ?
      `;
      const [result] = await connection.query(sql, [organizationId, departmentId, designationId]);

      if (result.affectedRows === 0) {
        throw new ApiError(404, 'Organization department designation not found');
      }

      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        organization_id: organizationId,
        department_id: departmentId,
        designation_id: designationId,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete organization department designation');
    }
  },
};
