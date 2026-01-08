import { Router } from 'express';
import {
  createRole,
  deleteRole,
  getRole,
  getRoleDelete,
  getRoles,
  hardDeleteRole,
  updateRole,
  getRolesWithDeleted,
} from './role.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createRoleSchema, editRoleSchema } from './role.validation.js';

const router = Router();

router.get('/', getRoles);
router.post('/', validate(createRoleSchema), createRole);

router.get('/hard', getRolesWithDeleted);
router.delete('/hard/:id', hardDeleteRole);
router.get('/hard/:id', getRoleDelete);

router.get('/:id', getRole);
router.put('/:id', validate(editRoleSchema), updateRole);
router.delete('/:id', deleteRole);

export default router;

// Export paths from swagger file
export { rolePaths } from './role.swagger.js';
