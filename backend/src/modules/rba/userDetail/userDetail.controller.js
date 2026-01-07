import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { userDetailService } from './userDetail.service.js';

const getUserDetails = asyncHandler(async (req, res) => {
  const userDetails = await userDetailService.getAll();
  return success(res, 'User details retrieved successfully', userDetails, 200);
});

const getUserDetail = asyncHandler(async (req, res) => {
  const userDetail = await userDetailService.getById(req.params.id);
  return success(res, 'User detail retrieved successfully', userDetail, 200);
});

const getUserDetailByUserId = asyncHandler(async (req, res) => {
  const userDetail = await userDetailService.getByUserId(req.params.userId);
  return success(res, 'User detail retrieved successfully', userDetail, 200);
});

const createUserDetail = asyncHandler(async (req, res) => {
  const userDetail = await userDetailService.create(req.body);
  return success(res, 'User detail created successfully', userDetail, 201);
});

const updateUserDetail = asyncHandler(async (req, res) => {
  const userDetail = await userDetailService.update(req.params.id, req.body);
  return success(res, 'User detail updated successfully', userDetail, 200);
});

const deleteUserDetail = asyncHandler(async (req, res) => {
  const userDetail = await userDetailService.softDelete(req.params.id);
  return success(res, 'User detail deleted successfully', userDetail, 200);
});

const getUserDetailsWithDeleted = asyncHandler(async (req, res) => {
  const userDetails = await userDetailService.getAllWithDeleted();
  return success(res, 'User details retrieved successfully', userDetails, 200);
});

const getUserDetailDelete = asyncHandler(async (req, res) => {
  const userDetail = await userDetailService.getByIdWithDeleted(req.params.id);
  return success(res, 'User detail retrieved successfully', userDetail, 200);
});

const hardDeleteUserDetail = asyncHandler(async (req, res) => {
  const userDetail = await userDetailService.hardDelete(req.params.id);
  return success(res, 'User detail permanently deleted', userDetail, 200);
});

export {
  getUserDetails,
  getUserDetail,
  getUserDetailByUserId,
  createUserDetail,
  updateUserDetail,
  deleteUserDetail,
  hardDeleteUserDetail,
  getUserDetailDelete,
  getUserDetailsWithDeleted,
};

