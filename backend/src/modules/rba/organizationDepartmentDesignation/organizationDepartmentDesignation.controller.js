import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { organizationDepartmentDesignationService } from './organizationDepartmentDesignation.service.js';

const getOrganizationDepartmentDesignations = asyncHandler(async (req, res) => {
  const organizationDepartmentDesignations =
    await organizationDepartmentDesignationService.getAll();
  return success(
    res,
    'Organization department designations retrieved successfully',
    organizationDepartmentDesignations,
    200,
  );
});

const getOrganizationDepartmentDesignation = asyncHandler(async (req, res) => {
  const { organizationId, departmentId, designationId } = req.params;
  const organizationDepartmentDesignation = await organizationDepartmentDesignationService.getById(
    parseInt(organizationId),
    departmentId,
    designationId,
  );
  return success(
    res,
    'Organization department designation retrieved successfully',
    organizationDepartmentDesignation,
    200,
  );
});

const createOrganizationDepartmentDesignation = asyncHandler(async (req, res) => {
  const organizationDepartmentDesignation = await organizationDepartmentDesignationService.create(
    req.body,
  );
  return success(
    res,
    'Organization department designation created successfully',
    organizationDepartmentDesignation,
    201,
  );
});

const updateOrganizationDepartmentDesignation = asyncHandler(async (req, res) => {
  const { organizationId, departmentId, designationId } = req.params;
  const organizationDepartmentDesignation = await organizationDepartmentDesignationService.update(
    parseInt(organizationId),
    departmentId,
    designationId,
    req.body,
  );
  return success(
    res,
    'Organization department designation updated successfully',
    organizationDepartmentDesignation,
    200,
  );
});

const deleteOrganizationDepartmentDesignation = asyncHandler(async (req, res) => {
  const { organizationId, departmentId, designationId } = req.params;
  const organizationDepartmentDesignation =
    await organizationDepartmentDesignationService.softDelete(
      parseInt(organizationId),
      departmentId,
      designationId,
    );
  return success(
    res,
    'Organization department designation deleted successfully',
    organizationDepartmentDesignation,
    200,
  );
});

const getOrganizationDepartmentDesignationsWithDeleted = asyncHandler(async (req, res) => {
  const organizationDepartmentDesignations =
    await organizationDepartmentDesignationService.getAllWithDeleted();
  return success(
    res,
    'Organization department designations retrieved successfully',
    organizationDepartmentDesignations,
    200,
  );
});

const getOrganizationDepartmentDesignationDelete = asyncHandler(async (req, res) => {
  const { organizationId, departmentId, designationId } = req.params;
  const organizationDepartmentDesignation =
    await organizationDepartmentDesignationService.getByIdWithDeleted(
      parseInt(organizationId),
      departmentId,
      designationId,
    );
  return success(
    res,
    'Organization department designation retrieved successfully',
    organizationDepartmentDesignation,
    200,
  );
});

const hardDeleteOrganizationDepartmentDesignation = asyncHandler(async (req, res) => {
  const { organizationId, departmentId, designationId } = req.params;
  const organizationDepartmentDesignation =
    await organizationDepartmentDesignationService.hardDelete(
      parseInt(organizationId),
      departmentId,
      designationId,
    );
  return success(
    res,
    'Organization department designation permanently deleted',
    organizationDepartmentDesignation,
    200,
  );
});

export {
  getOrganizationDepartmentDesignations,
  getOrganizationDepartmentDesignation,
  createOrganizationDepartmentDesignation,
  updateOrganizationDepartmentDesignation,
  deleteOrganizationDepartmentDesignation,
  hardDeleteOrganizationDepartmentDesignation,
  getOrganizationDepartmentDesignationDelete,
  getOrganizationDepartmentDesignationsWithDeleted,
};
