import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  createDesignationSchema,
  designationIdSchema,
  designationSchema,
  editDesignationSchema,
} from './designation.validation.js';

// Swagger schema exports
export const { swagger: designationSchemaSwagger } = j2s(designationSchema);
export const { swagger: designationIdSchemaSwagger } = j2s(designationIdSchema);
export const { swagger: createDesignationSchemaSwagger } = j2s(createDesignationSchema);
export const { swagger: editDesignationSchemaSwagger } = j2s(editDesignationSchema);

// For redoc documentation
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

