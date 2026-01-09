import { asyncHandler } from '../../../middleware/async.middlleware.js';
import { success } from '../../../util/responses.js';
import { featureService } from './feature.service.js';

const getFeatures = asyncHandler(async (req, res) => {
  const features = await featureService.getAll(req.query);
  return success(res, 'Features retrieved successfully', features, 200);
});

const getFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.getById(req.params.id);
  return success(res, 'Feature retrieved successfully', feature, 200);
});

const createFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.create(req.body);
  return success(res, 'Feature created successfully', feature, 201);
});

const updateFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.update(req.params.id, req.body);
  return success(res, 'Feature updated successfully', feature, 200);
});

const deleteFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.softDelete(req.params.id);
  return success(res, 'Feature deleted successfully', feature, 200);
});

const getFeaturesWithDeleted = asyncHandler(async (req, res) => {
  const features = await featureService.getAllWithDeleted();
  return success(res, 'Features retrieved successfully', features, 200);
});

const getFeatureDelete = asyncHandler(async (req, res) => {
  const feature = await featureService.getByIdWithDeleted(req.params.id);
  return success(res, 'Feature retrieved successfully', feature, 200);
});

const hardDeleteFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.hardDelete(req.params.id);
  return success(res, 'Feature permanently deleted', feature, 200);
});

export {
  getFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
  hardDeleteFeature,
  getFeatureDelete,
  getFeaturesWithDeleted,
};
