import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseUserSchema = Joi.object({
  user_id: Joi.number().integer(),
  uuid: Joi.string(),
  name: Joi.string(),
  email: Joi.string(),
  login_type: Joi.string(),
  email_verified: Joi.number().integer(),
  email_verified_at: Joi.string().isoDate().allow(null),
  is_active: Joi.number().integer(),
});

const userSchema = baseUserSchema.concat(auditSchema);

export const userDetailSchema = Joi.object({
  phone: Joi.string().max(20).allow(null, ''),
  alternate_phone: Joi.string().max(20).allow(null, ''),
  country: Joi.string().max(100).allow(null, ''),
  date_of_birth: Joi.date().allow(null, ''),
  gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
  profile_picture_url: Joi.string().uri().max(500).allow(null, ''),
  bio: Joi.string().allow(null, ''),
});

export const createUserSchema = Joi.object({
  uuid: Joi.string().max(100).required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(150).required(),
  password: Joi.string().min(8).optional(),
  login_type: Joi.string().max(50).default('email'),
  email_verified: Joi.number().integer().valid(0, 1).default(0),
  is_active: Joi.number().integer().valid(0, 1).default(1),
  user_detail: userDetailSchema.optional(),
  role_ids: Joi.array().items(Joi.string().max(100)).max(5).optional(),
});

export const editUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email().max(150),
  login_type: Joi.string().max(50),
  email_verified: Joi.number().integer().valid(0, 1),
  email_verified_at: Joi.string().isoDate().allow(null),
  is_active: Joi.number().integer().valid(0, 1),
  user_detail: userDetailSchema.optional(),
  role_ids: Joi.array().items(Joi.string().max(100)).max(5).optional(),
});

export const userIdSchema = Joi.object({
  user_id: Joi.number().integer().required(),
});

export const { swagger: userSchemaSwagger } = j2s(userSchema);
export const { swagger: userIdSchemaSwagger } = j2s(userIdSchema);
export const { swagger: createUserSchemaSwagger } = j2s(createUserSchema);
export const { swagger: editUserSchemaSwagger } = j2s(editUserSchema);

