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

// Export paths from swagger file
export { departmentPaths } from './department.swagger.js';
