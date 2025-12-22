import Joi from 'joi';

export const auditSchema = Joi.object({
  created_at: Joi.string().isoDate(),
  updated_at: Joi.string().isoDate(),
  is_deleted: Joi.boolean(),
});
