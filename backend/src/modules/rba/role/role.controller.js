import { asyncHandler } from '../../middleware/async.middlleware.js';
import { success } from '../../util/responses.js';
import { roleService } from './role.service.js';

const getRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.getAll();
  return success(res, 'Roles retrieved successfully', roles, 200);
});

const getRole = asyncHandler(async (req, res) => {
  const role = await roleService.getById(req.params.id);
  return success(res, 'Role retrieved successfully', role, 200);
});

const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.create(req.body);
  return success(res, 'Role created successfully', role, 201);
});

const updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.update(req.params.id, req.body);
  return success(res, 'Role updated successfully', role, 200);
});

const deleteRole = asyncHandler(async (req, res) => {
  const role = await roleService.softDelete(req.params.id);
  return success(res, 'Role deleted successfully', role, 200);
});

const getRolesWithDeleted = asyncHandler(async (req, res) => {
  const roles = await roleService.getAllWithDeleted();
  return success(res, 'Roles retrieved successfully', roles, 200);
});

const getRoleDelete = asyncHandler(async (req, res) => {
  const role = await roleService.getByIdWithDeleted(req.params.id);
  return success(res, 'Role retrieved successfully', role, 200);
});

const hardDeleteRole = asyncHandler(async (req, res) => {
  const role = await roleService.hardDelete(req.params.id);
  return success(res, 'Role permanently deleted', role, 200);
});

export {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  hardDeleteRole,
  getRoleDelete,
  getRolesWithDeleted,
};
