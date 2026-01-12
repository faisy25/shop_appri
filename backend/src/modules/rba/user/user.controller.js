import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { userService } from './user.service.js';

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  return success(res, 'Users retrieved successfully', users, 200);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  return success(res, 'User retrieved successfully', user, 200);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  return success(res, 'User created successfully', user, 201);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  return success(res, 'User updated successfully', user, 200);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.softDelete(req.params.id);
  return success(res, 'User deleted successfully', user, 200);
});

const getUsersWithDeleted = asyncHandler(async (req, res) => {
  const users = await userService.getAllWithDeleted();
  return success(res, 'Users retrieved successfully', users, 200);
});

const getUsersWithAccess = asyncHandler(async (req, res) => {
  const users = await userService.getAllWithAccess();
  return success(res, 'Users with access retrieved successfully', users, 200);
});

const getUserDelete = asyncHandler(async (req, res) => {
  const user = await userService.getByIdWithDeleted(req.params.id);
  return success(res, 'User retrieved successfully', user, 200);
});

const hardDeleteUser = asyncHandler(async (req, res) => {
  const user = await userService.hardDelete(req.params.id);
  return success(res, 'User permanently deleted', user, 200);
});

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  hardDeleteUser,
  getUserDelete,
  getUsersWithDeleted,
  getUsersWithAccess,
};
