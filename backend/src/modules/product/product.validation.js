import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../config/docs/auditResponses.swagger.js';

export const baseProductSchema = Joi.object({
  product_id: Joi.number().integer(),
  name: Joi.string(),
  description: Joi.string(),
  qty: Joi.number(),
  price: Joi.number(),
});
const productSchema = baseProductSchema.concat(auditSchema);

export const productIdSchema = Joi.object({
  product_id: Joi.number().integer(),
});

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow(''),
  qty: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),

  // Files will not be validated by Joi because they do NOT come in req.body
  files: Joi.any().optional(),
});

export const editProductSchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().allow(''),
  qty: Joi.number().integer().min(0),
  price: Joi.number().min(0),

  // Files will not be validated by Joi because they do NOT come in req.body
  files: Joi.any().optional(),
});

export const { swagger: productSchemaSwagger } = j2s(productSchema);
export const { swagger: productIdSchemaSwagger } = j2s(productIdSchema);
export const { swagger: createProductSchemaSwagger } = j2s(createProductSchema);
export const { swagger: editProductSchemaSwagger } = j2s(createProductSchema);
