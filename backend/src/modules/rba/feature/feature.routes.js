import { Router } from 'express';
import {
  createFeature,
  deleteFeature,
  getFeature,
  getFeatureDelete,
  getFeatures,
  hardDeleteFeature,
  updateFeature,
  getFeaturesWithDeleted,
} from './feature.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createFeatureSchema, editFeatureSchema } from './feature.validation.js';

const router = Router();

router.get('/', getFeatures);
router.post('/', validate(createFeatureSchema), createFeature);

router.get('/hard', getFeaturesWithDeleted);
router.delete('/hard/:id', hardDeleteFeature);
router.get('/hard/:id', getFeatureDelete);

router.get('/:id', getFeature);
router.put('/:id', validate(editFeatureSchema), updateFeature);
router.delete('/:id', deleteFeature);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../config/docs/method.swagger.js';
import {
  featureSchemaSwagger,
  createFeatureSchemaSwagger,
  editFeatureSchemaSwagger,
  featureIdSchemaSwagger,
} from './feature.validation.js';

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
