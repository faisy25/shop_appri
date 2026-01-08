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
import { multerUploader } from '../../util/fileUpload/multerUploader.js';

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

// Export paths from swagger file
export { productPaths } from './product.swagger.js';
