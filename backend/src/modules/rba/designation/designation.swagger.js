import j2s from 'joi-to-swagger';
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

