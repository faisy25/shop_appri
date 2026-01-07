import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { roleFeaturePermissionService } from './roleFeaturePermission.service.js';

const getRoleFeaturePermissions = asyncHandler(async (req, res) => {
  const roleFeaturePermissions = await roleFeaturePermissionService.getAll();
  return success(
    res,
    'Role feature permissions retrieved successfully',
    roleFeaturePermissions,
    200,
  );
});

const getRoleFeaturePermission = asyncHandler(async (req, res) => {
  const { roleId, featureId, permissionId } = req.params;
  const roleFeaturePermission = await roleFeaturePermissionService.getById(
    roleId,
    featureId,
    permissionId,
  );
  return success(res, 'Role feature permission retrieved successfully', roleFeaturePermission, 200);
});

const createRoleFeaturePermission = asyncHandler(async (req, res) => {
  const roleFeaturePermission = await roleFeaturePermissionService.create(req.body);
  return success(res, 'Role feature permission created successfully', roleFeaturePermission, 201);
});

const updateRoleFeaturePermission = asyncHandler(async (req, res) => {
  const { roleId, featureId, permissionId } = req.params;
  const roleFeaturePermission = await roleFeaturePermissionService.update(
    roleId,
    featureId,
    permissionId,
    req.body,
  );
  return success(res, 'Role feature permission updated successfully', roleFeaturePermission, 200);
});

const deleteRoleFeaturePermission = asyncHandler(async (req, res) => {
  const { roleId, featureId, permissionId } = req.params;
  const roleFeaturePermission = await roleFeaturePermissionService.softDelete(
    roleId,
    featureId,
    permissionId,
  );
  return success(res, 'Role feature permission deleted successfully', roleFeaturePermission, 200);
});

const getRoleFeaturePermissionsWithDeleted = asyncHandler(async (req, res) => {
  const roleFeaturePermissions = await roleFeaturePermissionService.getAllWithDeleted();
  return success(
    res,
    'Role feature permissions retrieved successfully',
    roleFeaturePermissions,
    200,
  );
});

const getRoleFeaturePermissionDelete = asyncHandler(async (req, res) => {
  const { roleId, featureId, permissionId } = req.params;
  const roleFeaturePermission = await roleFeaturePermissionService.getByIdWithDeleted(
    roleId,
    featureId,
    permissionId,
  );
  return success(res, 'Role feature permission retrieved successfully', roleFeaturePermission, 200);
});

const hardDeleteRoleFeaturePermission = asyncHandler(async (req, res) => {
  const { roleId, featureId, permissionId } = req.params;
  const roleFeaturePermission = await roleFeaturePermissionService.hardDelete(
    roleId,
    featureId,
    permissionId,
  );
  return success(res, 'Role feature permission permanently deleted', roleFeaturePermission, 200);
});

const bulkAssignPermissions = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const result = await roleFeaturePermissionService.bulkAssignPermissions(roleId, req.body.permissions);
  return success(res, 'Permissions assigned successfully', result, 200);
});

const bulkRemovePermissions = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const result = await roleFeaturePermissionService.bulkRemovePermissions(roleId, req.body.permissions);
  return success(res, 'Permissions removed successfully', result, 200);
});

const getPermissionsByRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const permissions = await roleFeaturePermissionService.getPermissionsByRole(roleId);
  return success(res, 'Permissions retrieved successfully', permissions, 200);
});

export {
  getRoleFeaturePermissions,
  getRoleFeaturePermission,
  createRoleFeaturePermission,
  updateRoleFeaturePermission,
  deleteRoleFeaturePermission,
  hardDeleteRoleFeaturePermission,
  getRoleFeaturePermissionDelete,
  getRoleFeaturePermissionsWithDeleted,
  bulkAssignPermissions,
  bulkRemovePermissions,
  getPermissionsByRole,
};
