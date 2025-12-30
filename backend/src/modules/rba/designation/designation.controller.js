import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { designationService } from './designation.service.js';

const getDesignations = asyncHandler(async (req, res) => {
  const designations = await designationService.getAll();
  return success(res, 'Designations retrieved successfully', designations, 200);
});

const getDesignation = asyncHandler(async (req, res) => {
  const designation = await designationService.getById(req.params.id);
  return success(res, 'Designation retrieved successfully', designation, 200);
});

const createDesignation = asyncHandler(async (req, res) => {
  const designation = await designationService.create(req.body);
  return success(res, 'Designation created successfully', designation, 201);
});

const updateDesignation = asyncHandler(async (req, res) => {
  const designation = await designationService.update(req.params.id, req.body);
  return success(res, 'Designation updated successfully', designation, 200);
});

const deleteDesignation = asyncHandler(async (req, res) => {
  const designation = await designationService.softDelete(req.params.id);
  return success(res, 'Designation deleted successfully', designation, 200);
});

const getDesignationsWithDeleted = asyncHandler(async (req, res) => {
  const designations = await designationService.getAllWithDeleted();
  return success(res, 'Designations retrieved successfully', designations, 200);
});

const getDesignationDelete = asyncHandler(async (req, res) => {
  const designation = await designationService.getByIdWithDeleted(req.params.id);
  return success(res, 'Designation retrieved successfully', designation, 200);
});

const hardDeleteDesignation = asyncHandler(async (req, res) => {
  const designation = await designationService.hardDelete(req.params.id);
  return success(res, 'Designation permanently deleted', designation, 200);
});

export {
  getDesignations,
  getDesignation,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  hardDeleteDesignation,
  getDesignationDelete,
  getDesignationsWithDeleted,
};
