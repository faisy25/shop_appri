import Joi from 'joi';
import { auditSchema } from '../../config/docs/auditResponses.swagger.js';

// DB-level base schema (for GET responses)
export const baseMediaSchema = Joi.object({
  media_id: Joi.number().integer(),
  model_type: Joi.string().max(50),
  model_id: Joi.number().integer(),
  media_type: Joi.string().valid('image', 'video', 'file'),
  media_url: Joi.string(),
  public_id: Joi.string(),
  folder_path: Joi.string().allow(null),
  is_primary: Joi.number().valid(0, 1),
  sort_order: Joi.number().integer(),
});

export const updateMediaSchema = Joi.object({
  is_primary: Joi.number().integer().valid(0, 1),
  sort_order: Joi.number().integer(),
});

export const mediaIdSchema = Joi.object({
  media_id: Joi.number().integer(),
});

// Export mediaSchema for swagger file
export const mediaSchema = baseMediaSchema.concat(auditSchema);
