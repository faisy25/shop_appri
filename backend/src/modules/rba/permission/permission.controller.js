import { asyncHandler } from '../../middleware/async.middlleware.js';
import { success } from '../../util/responses.js';
import { permissionService } from './permission.service.js';

const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await permissionService.getAll();
  return success(res, 'Permissions retrieved successfully', permissions, 200);
});

const getPermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.getById(req.params.id);
  return success(res, 'Permission retrieved successfully', permission, 200);
});

const createPermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.create(req.body);
  return success(res, 'Permission created successfully', permission, 201);
});

const updatePermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.update(req.params.id, req.body);
  return success(res, 'Permission updated successfully', permission, 200);
});

const deletePermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.softDelete(req.params.id);
  return success(res, 'Permission deleted successfully', permission, 200);
});

const getPermissionsWithDeleted = asyncHandler(async (req, res) => {
  const permissions = await permissionService.getAllWithDeleted();
  return success(res, 'Permissions retrieved successfully', permissions, 200);
});

const getPermissionDelete = asyncHandler(async (req, res) => {
  const permission = await permissionService.getByIdWithDeleted(req.params.id);
  return success(res, 'Permission retrieved successfully', permission, 200);
});

const hardDeletePermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.hardDelete(req.params.id);
  return success(res, 'Permission permanently deleted', permission, 200);
});

export {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
  hardDeletePermission,
  getPermissionDelete,
  getPermissionsWithDeleted,
};
