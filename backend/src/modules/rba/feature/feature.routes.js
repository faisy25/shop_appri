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
import { validate } from '../../../middleware/validate.middleware.js';
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

// Export paths from swagger file
export { featurePaths } from './feature.swagger.js';
