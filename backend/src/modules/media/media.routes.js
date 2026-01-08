import { Router } from 'express';
import multer from 'multer';
import {
  // getAllMedia, getAllDeletedMedia, updateMedia,
  deleteMedia,
} from './media.controller.js';
// import { validate } from '../../middleware/validate.middleware.js';
import {
  // mediaSchemaSwagger,  updateMediaSchemaSwagger,  updateMediaSchema,
  mediaIdSchemaSwagger,
} from './media.swagger.js';

const router = Router();

// router.get('/', getAllMedia);
// router.get('/deleted', getAllDeletedMedia);
// router.put('/:id', validate(updateMediaSchema), updateMedia);
router.delete('/:id', deleteMedia);

export default router;

// Export paths from swagger file
export { mediaPaths } from './media.swagger.js';
