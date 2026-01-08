import Joi from 'joi';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseDesignationSchema = Joi.object({
  designation_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
});

export const designationIdSchema = Joi.object({
  designation_id: Joi.string(),
});

export const createDesignationSchema = Joi.object({
  designation_id: Joi.string().length(10).required(),
  name: Joi.string().min(2).max(25).required(),
  description: Joi.string().max(100).allow(''),
});

export const editDesignationSchema = Joi.object({
  name: Joi.string().min(2).max(25),
  description: Joi.string().max(100).allow(''),
});

// Export designationSchema for swagger file
export const designationSchema = baseDesignationSchema.concat(auditSchema);
