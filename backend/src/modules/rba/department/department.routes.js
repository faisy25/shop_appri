import { Router } from 'express';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentDelete,
  getDepartments,
  hardDeleteDepartment,
  updateDepartment,
  getDepartmentsWithDeleted,
} from './department.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createDepartmentSchema, editDepartmentSchema } from './department.validation.js';

const router = Router();

router.get('/', getDepartments);
router.post('/', validate(createDepartmentSchema), createDepartment);

router.get('/hard', getDepartmentsWithDeleted);
router.delete('/hard/:id', hardDeleteDepartment);
router.get('/hard/:id', getDepartmentDelete);

router.get('/:id', getDepartment);
router.put('/:id', validate(editDepartmentSchema), updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  departmentSchemaSwagger,
  createDepartmentSchemaSwagger,
  editDepartmentSchemaSwagger,
  departmentIdSchemaSwagger,
} from './department.validation.js';

const tag = 'Department';
export const departmentPaths = {
  '/departments': {
    get: makeGet(tag, 'Get all departments', departmentSchemaSwagger, true),
    post: makePost(
      tag,
      'Create department',
      createDepartmentSchemaSwagger,
      departmentIdSchemaSwagger,
    ),
  },

  '/departments/{id}': {
    get: makeGet(tag, 'Get department', departmentSchemaSwagger),
    put: makePut(tag, 'Update department', editDepartmentSchemaSwagger, departmentIdSchemaSwagger),
    delete: makeDelete(tag, 'Delete department', departmentIdSchemaSwagger),
  },

  '/departments/hard/{id}': {
    delete: makeDelete(tag, 'Delete department permanently', departmentIdSchemaSwagger),
  },
};
