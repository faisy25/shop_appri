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

// For Swagger
import { makeGet, makePut, makeDelete } from '../../config/docs/method.swagger.js';

const tag = 'Media';
export const mediaPaths = {
  // '/media': {
  //   get: makeGet(tag, 'Get all media', mediaSchemaSwagger, true),
  // },
  // '/media/deleted': {
  //   get: makeGet(tag, 'Get all media with deleted ones', mediaSchemaSwagger, true),
  // },

  '/media/{id}': {
    // put: makePut(tag, 'Update media info', updateMediaSchemaSwagger, mediaIdSchemaSwagger),
    delete: makeDelete(tag, 'Soft delete media', mediaIdSchemaSwagger),
  },
};
