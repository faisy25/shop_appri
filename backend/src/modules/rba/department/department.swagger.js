import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  createDepartmentSchema,
  departmentIdSchema,
  departmentSchema,
  editDepartmentSchema,
} from './department.validation.js';

// Swagger schema exports
export const { swagger: departmentSchemaSwagger } = j2s(departmentSchema);
export const { swagger: departmentIdSchemaSwagger } = j2s(departmentIdSchema);
export const { swagger: createDepartmentSchemaSwagger } = j2s(createDepartmentSchema);
export const { swagger: editDepartmentSchemaSwagger } = j2s(editDepartmentSchema);

// For redoc documentation
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

