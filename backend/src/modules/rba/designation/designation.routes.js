import { Router } from 'express';
import {
  createDesignation,
  deleteDesignation,
  getDesignation,
  getDesignationDelete,
  getDesignations,
  hardDeleteDesignation,
  updateDesignation,
  getDesignationsWithDeleted,
} from './designation.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { createDesignationSchema, editDesignationSchema } from './designation.validation.js';

const router = Router();

router.get('/', getDesignations);
router.post('/', validate(createDesignationSchema), createDesignation);

router.get('/hard', getDesignationsWithDeleted);
router.delete('/hard/:id', hardDeleteDesignation);
router.get('/hard/:id', getDesignationDelete);

router.get('/:id', getDesignation);
router.put('/:id', validate(editDesignationSchema), updateDesignation);
router.delete('/:id', deleteDesignation);

export default router;

// Export paths from swagger file
export { designationPaths } from './designation.swagger.js';
