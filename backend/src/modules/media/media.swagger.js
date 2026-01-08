import j2s from 'joi-to-swagger';
import { makeGet, makePut, makeDelete } from '../../config/docs/method.swagger.js';
import { mediaIdSchema, mediaSchema, updateMediaSchema } from './media.validation.js';

// Swagger schema exports
export const { swagger: mediaSchemaSwagger } = j2s(mediaSchema);
export const { swagger: updateMediaSchemaSwagger } = j2s(updateMediaSchema);
export const { swagger: mediaIdSchemaSwagger } = j2s(mediaIdSchema);

// For redoc documentation
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

