import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductDelete,
  getProducts,
  hardDeleteProduct,
  updateProduct,
  getProductsWithDeleted,
} from './product.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createProductSchema, editProductSchema } from './product.validation.js';

const router = Router();

router.get('/', getProducts);

router.post('/', multerUploader.array('files'), validate(createProductSchema), createProduct);

router.get('/hard', getProductsWithDeleted);
router.delete('/hard/:id', hardDeleteProduct);
router.get('/hard/:id', getProductDelete);

router.get('/:id', getProduct);
router.put('/:id', multerUploader.array('files'), validate(editProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../config/docs/method.swagger.js';
import {
  productSchemaSwagger,
  createProductSchemaSwagger,
  editProductSchemaSwagger,
  productIdSchemaSwagger,
} from './product.validation.js';
import { multerUploader } from '../../util/fileUpload/multerUploader.js';

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
