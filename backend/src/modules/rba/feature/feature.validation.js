import Joi from 'joi';
import j2s from 'joi-to-swagger';
import { auditSchema } from '../../../config/docs/auditResponses.swagger.js';

export const baseFeatureSchema = Joi.object({
  feature_id: Joi.number().integer(),
  name: Joi.string(),
  element_type: Joi.string().valid('menu', 'group', 'page', 'button', 'link'),
  icon: Joi.string().max(50).allow('', null),
  description: Joi.string(),
  fk_id: Joi.number().integer(),
  parent_id: Joi.number().integer(),
  sort_order: Joi.number().integer(),
});
const featureSchema = baseFeatureSchema.concat(auditSchema);

export const featureIdSchema = Joi.object({
  feature_id: Joi.number().integer(),
});

export const createFeatureSchema = Joi.object({
  name: Joi.string().min(2).max(25).required(),
  element_type: Joi.string().valid('menu', 'group', 'page', 'button', 'link').default('menu'),
  icon: Joi.string().max(50).allow('', null).default(null),
  description: Joi.string().max(100).allow(''),
  fk_id: Joi.number().integer().default(0),
  parent_id: Joi.number().integer().allow(null),
  sort_order: Joi.number().integer().default(0),
});

export const editFeatureSchema = Joi.object({
  name: Joi.string().min(2).max(25),
  element_type: Joi.string().valid('menu', 'group', 'page', 'button', 'link'),
  icon: Joi.string().max(50).allow('', null),
  description: Joi.string().max(100).allow(''),
  fk_id: Joi.number().integer(),
  parent_id: Joi.number().integer().allow(null),
  sort_order: Joi.number().integer(),
});

export const { swagger: featureSchemaSwagger } = j2s(featureSchema);
export const { swagger: featureIdSchemaSwagger } = j2s(featureIdSchema);
export const { swagger: createFeatureSchemaSwagger } = j2s(createFeatureSchema);
export const { swagger: editFeatureSchemaSwagger } = j2s(editFeatureSchema);
