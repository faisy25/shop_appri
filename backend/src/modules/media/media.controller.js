import { asyncHandler } from '../../middleware/async.middlleware.js';
import { success } from '../../util/responses.js';
import { mediaService } from './media.service.js';

// export const getAllMedia = asyncHandler(async (req, res) => {
//   const images = await mediaService.getAll(req.query);
//   return success(res, 'Media retrieved', images, 200);
// });

// export const getAllDeletedMedia = asyncHandler(async (req, res) => {
//   const images = await mediaService.getAllDeleted(req.query);
//   return success(res, 'Deleted media retrieved', images, 200);
// });

// export const updateMedia = asyncHandler(async (req, res) => {
//   const id = await mediaService.updateOne(req.params.id, req.body);
//   return success(res, 'Updated successfully', { id }, 200);
// });

export const deleteMedia = asyncHandler(async (req, res) => {
  const id = await mediaService.softDeleteWithId(req.params.id);
  return success(res, 'Soft deleted successfully', id, 200);
});
