import Joi from 'joi';
import { auditSchema } from '../../config/docs/auditResponses.swagger.js';

export const baseProductSchema = Joi.object({
  product_id: Joi.number().integer(),
  name: Joi.string(),
  description: Joi.string(),
  qty: Joi.number(),
  price: Joi.number(),
});

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

// Export productSchema for swagger file
export const productSchema = baseProductSchema.concat(auditSchema);
