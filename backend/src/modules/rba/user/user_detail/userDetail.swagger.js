import j2s from 'joi-to-swagger';
import {
  createUserDetailSchema,
  editUserDetailSchema,
  userDetailIdSchema,
  userDetailSchema,
} from './userDetail.validation.js';

// Swagger schema exports
export const { swagger: userDetailSchemaSwagger } = j2s(userDetailSchema);
export const { swagger: userDetailIdSchemaSwagger } = j2s(userDetailIdSchema);
export const { swagger: createUserDetailSchemaSwagger } = j2s(createUserDetailSchema);
export const { swagger: editUserDetailSchemaSwagger } = j2s(editUserDetailSchema);

