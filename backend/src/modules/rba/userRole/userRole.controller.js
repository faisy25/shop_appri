import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { userRoleService } from './userRole.service.js';

const getUserRoles = asyncHandler(async (req, res) => {
  const userRoles = await userRoleService.getAll();
  return success(res, 'User roles retrieved successfully', userRoles, 200);
});

const getUserRole = asyncHandler(async (req, res) => {
  const { userId, roleId } = req.params;
  const userRole = await userRoleService.getById(parseInt(userId), roleId);
  return success(res, 'User role retrieved successfully', userRole, 200);
});

const getUserRolesByUserId = asyncHandler(async (req, res) => {
  const userRoles = await userRoleService.getByUserId(parseInt(req.params.userId));
  return success(res, 'User roles retrieved successfully', userRoles, 200);
});

const createUserRole = asyncHandler(async (req, res) => {
  const userRole = await userRoleService.create(req.body);
  return success(res, 'User role created successfully', userRole, 201);
});

const deleteUserRole = asyncHandler(async (req, res) => {
  const { userId, roleId } = req.params;
  const userRole = await userRoleService.softDelete(parseInt(userId), roleId);
  return success(res, 'User role deleted successfully', userRole, 200);
});

const getUserRolesWithDeleted = asyncHandler(async (req, res) => {
  const userRoles = await userRoleService.getAllWithDeleted();
  return success(res, 'User roles retrieved successfully', userRoles, 200);
});

const getUserRoleDelete = asyncHandler(async (req, res) => {
  const { userId, roleId } = req.params;
  const userRole = await userRoleService.getByIdWithDeleted(parseInt(userId), roleId);
  return success(res, 'User role retrieved successfully', userRole, 200);
});

const hardDeleteUserRole = asyncHandler(async (req, res) => {
  const { userId, roleId } = req.params;
  const userRole = await userRoleService.hardDelete(parseInt(userId), roleId);
  return success(res, 'User role permanently deleted', userRole, 200);
});

export {
  getUserRoles,
  getUserRole,
  getUserRolesByUserId,
  createUserRole,
  deleteUserRole,
  hardDeleteUserRole,
  getUserRoleDelete,
  getUserRolesWithDeleted,
};

