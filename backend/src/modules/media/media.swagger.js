import j2s from 'joi-to-swagger';
import { mediaIdSchema, mediaSchema, updateMediaSchema } from './media.validation.js';

// Swagger schema exports
export const { swagger: mediaSchemaSwagger } = j2s(mediaSchema);
export const { swagger: updateMediaSchemaSwagger } = j2s(updateMediaSchema);
export const { swagger: mediaIdSchemaSwagger } = j2s(mediaIdSchema);

