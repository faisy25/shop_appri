import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { roleFeaturePermissionService } from './roleFeaturePermission.service.js';

const bulkAssignPermissions = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const result = await roleFeaturePermissionService.bulkAssignPermissions(
    roleId,
    req.body.permissions,
  );
  return success(res, 'Permissions assigned successfully', result, 200);
});

const bulkRemovePermissions = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const result = await roleFeaturePermissionService.bulkRemovePermissions(
    roleId,
    req.body.permissions,
  );
  return success(res, 'Permissions removed successfully', result, 200);
});

const getPermissionsByRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const permissions = await roleFeaturePermissionService.getPermissionsByRole(roleId);
  return success(res, 'Permissions retrieved successfully', permissions, 200);
});

export { bulkAssignPermissions, bulkRemovePermissions, getPermissionsByRole };
