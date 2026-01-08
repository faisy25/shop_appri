import j2s from 'joi-to-swagger';
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

