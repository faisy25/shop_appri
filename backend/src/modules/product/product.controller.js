import { asyncHandler } from '../../middleware/async.middlleware.js';
import ApiError from '../../util/error/api.error.js';
import { success } from '../../util/responses.js';
import { productService } from './product.service.js';

const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAll();
  return success(res, 'Products retrieved successfully', products, 200);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  return success(res, 'Product retrieved successfully', product, 200);
});

const createProduct = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'At least one file is required');
  }
  const data = { ...req.body, files: req.files };
  const product = await productService.create(data);
  return success(res, 'Product created successfully', product, 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body, files: req.files };
  const product = await productService.update(req.params.id, data);
  return success(res, 'Product updated successfully', product, 200);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.softDelete(req.params.id);
  return success(res, 'Product deleted successfully', product, 200);
});

// For Hard Delete
const getProductsWithDeleted = asyncHandler(async (req, res) => {
  const products = await productService.getAllWithDeleted();
  return success(res, 'Products retrieved successfully', products, 200);
});
const getProductDelete = asyncHandler(async (req, res) => {
  const product = await productService.getByIdWithDeleted(req.params.id);
  return success(res, 'Product retrieved successfully', product, 200);
});
const hardDeleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.hardDelete(req.params.id);
  return success(res, 'Product permanently deleted', product, 200);
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  getProductDelete,
  getProductsWithDeleted,
};
