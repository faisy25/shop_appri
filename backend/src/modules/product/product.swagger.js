import j2s from 'joi-to-swagger';
import {
  createProductSchema,
  editProductSchema,
  productIdSchema,
  productSchema,
} from './product.validation.js';

// Swagger schema exports
export const { swagger: productSchemaSwagger } = j2s(productSchema);
export const { swagger: productIdSchemaSwagger } = j2s(productIdSchema);
export const { swagger: createProductSchemaSwagger } = j2s(createProductSchema);
export const { swagger: editProductSchemaSwagger } = j2s(editProductSchema);

