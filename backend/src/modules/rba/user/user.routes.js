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

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  userSchemaSwagger,
  createUserSchemaSwagger,
  editUserSchemaSwagger,
  userIdSchemaSwagger,
} from './user.swagger.js';

const tag = 'User';
export const userPaths = {
  '/users': {
    get: makeGet(tag, 'Get all users', userSchemaSwagger, true),
    post: makePost(tag, 'Create user', createUserSchemaSwagger, userSchemaSwagger),
  },

  '/users/{id}': {
    get: makeGet(tag, 'Get user', userSchemaSwagger),
    put: makePut(tag, 'Update user', editUserSchemaSwagger, userSchemaSwagger),
    delete: makeDelete(tag, 'Delete user', userIdSchemaSwagger),
  },

  '/users/hard': {
    get: makeGet(tag, 'Get all users with deleted', userSchemaSwagger, true),
  },

  '/users/hard/{id}': {
    get: makeGet(tag, 'Get user with deleted', userSchemaSwagger),
  },

  '/users/hard/{id}': {
    delete: makeDelete(tag, 'Delete user permanently', userIdSchemaSwagger),
  },
};
