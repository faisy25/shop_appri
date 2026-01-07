import { Router } from 'express';
import {
  createUserDetail,
  deleteUserDetail,
  getUserDetail,
  getUserDetailByUserId,
  getUserDetailDelete,
  getUserDetails,
  hardDeleteUserDetail,
  updateUserDetail,
  getUserDetailsWithDeleted,
} from './userDetail.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createUserDetailSchema, editUserDetailSchema } from './userDetail.validation.js';

const router = Router();

router.get('/', getUserDetails);
router.post('/', validate(createUserDetailSchema), createUserDetail);

router.get('/user/:userId', getUserDetailByUserId);

router.get('/hard', getUserDetailsWithDeleted);
router.delete('/hard/:id', hardDeleteUserDetail);
router.get('/hard/:id', getUserDetailDelete);

router.get('/:id', getUserDetail);
router.put('/:id', validate(editUserDetailSchema), updateUserDetail);
router.delete('/:id', deleteUserDetail);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  userDetailSchemaSwagger,
  createUserDetailSchemaSwagger,
  editUserDetailSchemaSwagger,
  userDetailIdSchemaSwagger,
} from './userDetail.validation.js';

const tag = 'User Detail';
export const userDetailPaths = {
  '/user-details': {
    get: makeGet(tag, 'Get all user details', userDetailSchemaSwagger, true),
    post: makePost(tag, 'Create user detail', createUserDetailSchemaSwagger, userDetailIdSchemaSwagger),
  },

  '/user-details/{id}': {
    get: makeGet(tag, 'Get user detail', userDetailSchemaSwagger),
    put: makePut(tag, 'Update user detail', editUserDetailSchemaSwagger, userDetailIdSchemaSwagger),
    delete: makeDelete(tag, 'Delete user detail', userDetailIdSchemaSwagger),
  },

  '/user-details/hard/{id}': {
    delete: makeDelete(tag, 'Delete user detail permanently', userDetailIdSchemaSwagger),
  },
};

