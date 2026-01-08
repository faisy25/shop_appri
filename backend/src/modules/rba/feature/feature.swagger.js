import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  createFeatureSchema,
  editFeatureSchema,
  featureIdSchema,
  featureSchema,
} from './feature.validation.js';

// Swagger schema exports
export const { swagger: featureSchemaSwagger } = j2s(featureSchema);
export const { swagger: featureIdSchemaSwagger } = j2s(featureIdSchema);
export const { swagger: createFeatureSchemaSwagger } = j2s(createFeatureSchema);
export const { swagger: editFeatureSchemaSwagger } = j2s(editFeatureSchema);

// For redoc documentation
const tag = 'Feature';
export const featurePaths = {
  '/features': {
    get: makeGet(tag, 'Get all features', featureSchemaSwagger, true),
    post: makePost(tag, 'Create feature', createFeatureSchemaSwagger, featureIdSchemaSwagger),
  },

  '/features/{id}': {
    get: makeGet(tag, 'Get feature', featureSchemaSwagger),
    put: makePut(tag, 'Update feature', editFeatureSchemaSwagger, featureIdSchemaSwagger),
    delete: makeDelete(tag, 'Delete feature', featureIdSchemaSwagger),
  },

  '/features/hard/{id}': {
    delete: makeDelete(tag, 'Delete feature permanently', featureIdSchemaSwagger),
  },
};

