import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getUserDelete,
  getUsers,
  hardDeleteUser,
  updateUser,
  getUsersWithDeleted,
} from './user.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createUserSchema, editUserSchema } from './user.validation.js';

const router = Router();

router.get('/', getUsers);
router.post('/', validate(createUserSchema), createUser);

router.get('/hard', getUsersWithDeleted);
router.delete('/hard/:id', hardDeleteUser);
router.get('/hard/:id', getUserDelete);

router.get('/:id', getUser);
router.put('/:id', validate(editUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;

// Export paths from swagger file
export { userPaths } from './user.swagger.js';
