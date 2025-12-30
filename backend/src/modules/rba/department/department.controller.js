import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { departmentService } from './department.service.js';

const getDepartments = asyncHandler(async (req, res) => {
  const departments = await departmentService.getAll();
  return success(res, 'Departments retrieved successfully', departments, 200);
});

const getDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.getById(req.params.id);
  return success(res, 'Department retrieved successfully', department, 200);
});

const createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.create(req.body);
  return success(res, 'Department created successfully', department, 201);
});

const updateDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.update(req.params.id, req.body);
  return success(res, 'Department updated successfully', department, 200);
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.softDelete(req.params.id);
  return success(res, 'Department deleted successfully', department, 200);
});

const getDepartmentsWithDeleted = asyncHandler(async (req, res) => {
  const departments = await departmentService.getAllWithDeleted();
  return success(res, 'Departments retrieved successfully', departments, 200);
});

const getDepartmentDelete = asyncHandler(async (req, res) => {
  const department = await departmentService.getByIdWithDeleted(req.params.id);
  return success(res, 'Department retrieved successfully', department, 200);
});

const hardDeleteDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.hardDelete(req.params.id);
  return success(res, 'Department permanently deleted', department, 200);
});

export {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  hardDeleteDepartment,
  getDepartmentDelete,
  getDepartmentsWithDeleted,
};
