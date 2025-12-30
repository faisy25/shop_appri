import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseDesignationSchema = Joi.object({
  designation_id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
});
const designationSchema = baseDesignationSchema.concat(auditSchema);

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

export const { swagger: designationSchemaSwagger } = j2s(designationSchema);
export const { swagger: designationIdSchemaSwagger } = j2s(designationIdSchema);
export const { swagger: createDesignationSchemaSwagger } = j2s(createDesignationSchema);
export const { swagger: editDesignationSchemaSwagger } = j2s(editDesignationSchema);
