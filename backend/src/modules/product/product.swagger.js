import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../config/docs/method.swagger.js';
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

// For redoc documentation
const tag = 'Product';
export const productPaths = {
  '/products': {
    get: makeGet(tag, 'Get all products', productSchemaSwagger, true),
    post: makePost(tag, 'Create product', createProductSchemaSwagger, productIdSchemaSwagger),
  },

  '/products/{id}': {
    get: makeGet(tag, 'Get product', productSchemaSwagger),
    put: makePut(tag, 'Update product', editProductSchemaSwagger, productIdSchemaSwagger),
    delete: makeDelete(tag, 'Delete product', productIdSchemaSwagger),
  },

  '/products/hard/{id}': {
    delete: makeDelete(tag, 'Delete product', productIdSchemaSwagger),
  },
};

