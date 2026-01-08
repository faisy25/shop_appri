import j2s from 'joi-to-swagger';
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

