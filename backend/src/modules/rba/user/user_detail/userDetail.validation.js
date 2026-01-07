import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../../config/docs/auditResponses.swagger.js';

export const baseUserDetailSchema = Joi.object({
  user_detail_id: Joi.number().integer(),
  user_id: Joi.number().integer(),
  phone: Joi.string().max(20).allow(null, ''),
  alternate_phone: Joi.string().max(20).allow(null, ''),
  country: Joi.string().max(100).allow(null, ''),
  date_of_birth: Joi.date().allow(null, ''),
  gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
  profile_picture_url: Joi.string().uri().max(500).allow(null, ''),
  bio: Joi.string().allow(null, ''),
});

const userDetailSchema = baseUserDetailSchema.concat(auditSchema);

export const createUserDetailSchema = Joi.object({
  phone: Joi.string().max(20).allow(null, ''),
  alternate_phone: Joi.string().max(20).allow(null, ''),
  country: Joi.string().max(100).allow(null, ''),
  date_of_birth: Joi.date().allow(null, ''),
  gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
  profile_picture_url: Joi.string().uri().max(500).allow(null, ''),
  bio: Joi.string().allow(null, ''),
});

export const editUserDetailSchema = Joi.object({
  phone: Joi.string().max(20).allow(null, ''),
  alternate_phone: Joi.string().max(20).allow(null, ''),
  country: Joi.string().max(100).allow(null, ''),
  date_of_birth: Joi.date().allow(null, ''),
  gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
  profile_picture_url: Joi.string().uri().max(500).allow(null, ''),
  bio: Joi.string().allow(null, ''),
});

export const userDetailIdSchema = Joi.object({
  user_detail_id: Joi.number().integer(),
});

export const { swagger: userDetailSchemaSwagger } = j2s(userDetailSchema);
export const { swagger: userDetailIdSchemaSwagger } = j2s(userDetailIdSchema);
export const { swagger: createUserDetailSchemaSwagger } = j2s(createUserDetailSchema);
export const { swagger: editUserDetailSchemaSwagger } = j2s(editUserDetailSchema);
