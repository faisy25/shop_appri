import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  createUserSchema,
  editUserSchema,
  userIdSchema,
  userSchema,
} from './user.validation.js';

// Swagger schema exports
export const { swagger: userSchemaSwagger } = j2s(userSchema);
export const { swagger: userIdSchemaSwagger } = j2s(userIdSchema);
export const { swagger: createUserSchemaSwagger } = j2s(createUserSchema);
export const { swagger: editUserSchemaSwagger } = j2s(editUserSchema);

// For redoc documentation
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
    delete: makeDelete(tag, 'Delete user permanently', userIdSchemaSwagger),
  },
};
