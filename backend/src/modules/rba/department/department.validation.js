import Joi from 'joi';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseDepartmentSchema = Joi.object({
  department_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
});

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

// Export departmentSchema for swagger file
export const departmentSchema = baseDepartmentSchema.concat(auditSchema);
