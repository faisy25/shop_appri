import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { organizationService } from './organization.service.js';

const getOrganizations = asyncHandler(async (req, res) => {
  const organizations = await organizationService.getAll();
  return success(res, 'Organizations retrieved successfully', organizations, 200);
});

const getOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationService.getById(req.params.id);
  return success(res, 'Organization retrieved successfully', organization, 200);
});

const createOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationService.create(req.body);
  return success(res, 'Organization created successfully', organization, 201);
});

const updateOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationService.update(req.params.id, req.body);
  return success(res, 'Organization updated successfully', organization, 200);
});

const deleteOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationService.softDelete(req.params.id);
  return success(res, 'Organization deleted successfully', organization, 200);
});

const getOrganizationsWithDeleted = asyncHandler(async (req, res) => {
  const organizations = await organizationService.getAllWithDeleted();
  return success(res, 'Organizations retrieved successfully', organizations, 200);
});

const getOrganizationDelete = asyncHandler(async (req, res) => {
  const organization = await organizationService.getByIdWithDeleted(req.params.id);
  return success(res, 'Organization retrieved successfully', organization, 200);
});

const hardDeleteOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationService.hardDelete(req.params.id);
  return success(res, 'Organization permanently deleted', organization, 200);
});

export {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  hardDeleteOrganization,
  getOrganizationDelete,
  getOrganizationsWithDeleted,
};
