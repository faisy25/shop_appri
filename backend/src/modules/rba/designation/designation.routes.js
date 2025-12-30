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

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  designationSchemaSwagger,
  createDesignationSchemaSwagger,
  editDesignationSchemaSwagger,
  designationIdSchemaSwagger,
} from './designation.validation.js';

const tag = 'Designation';
export const designationPaths = {
  '/designations': {
    get: makeGet(tag, 'Get all designations', designationSchemaSwagger, true),
    post: makePost(
      tag,
      'Create designation',
      createDesignationSchemaSwagger,
      designationIdSchemaSwagger,
    ),
  },

  '/designations/{id}': {
    get: makeGet(tag, 'Get designation', designationSchemaSwagger),
    put: makePut(
      tag,
      'Update designation',
      editDesignationSchemaSwagger,
      designationIdSchemaSwagger,
    ),
    delete: makeDelete(tag, 'Delete designation', designationIdSchemaSwagger),
  },

  '/designations/hard/{id}': {
    delete: makeDelete(tag, 'Delete designation permanently', designationIdSchemaSwagger),
  },
};
