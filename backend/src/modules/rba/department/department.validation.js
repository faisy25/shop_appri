import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../config/docs/auditResponses.swagger.js';

export const baseDepartmentSchema = Joi.object({
  department_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
});
const departmentSchema = baseDepartmentSchema.concat(auditSchema);

export const departmentIdSchema = Joi.object({
  department_id: Joi.string(),
});

export const createDepartmentSchema = Joi.object({
  department_id: Joi.string().length(10).required(),
  name: Joi.string().min(2).max(25).required(),
  description: Joi.string().max(100).allow(''),
});

export const editDepartmentSchema = Joi.object({
  name: Joi.string().min(2).max(25),
  description: Joi.string().max(100).allow(''),
});

export const { swagger: departmentSchemaSwagger } = j2s(departmentSchema);
export const { swagger: departmentIdSchemaSwagger } = j2s(departmentIdSchema);
export const { swagger: createDepartmentSchemaSwagger } = j2s(createDepartmentSchema);
export const { swagger: editDepartmentSchemaSwagger } = j2s(editDepartmentSchema);
