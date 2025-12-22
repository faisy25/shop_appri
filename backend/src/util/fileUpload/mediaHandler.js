import fs from 'fs/promises';
import { bulkUploadToCloudinary, bulkDeleteFromCloudinary } from './cloudinary.js';
import ApiError from '../error/api.error.js';

/**
 * Upload files to cloudinary and return structured media objects
 * Handles both single and multiple files efficiently
 */
export const mediaUpload = async (files, media_type, model_type, model_id) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, 'No files provided for upload');
  }

  try {
    // Always treat as array for consistent processing
    const fileArray = Array.isArray(files) ? files : [files];

    // Bulk upload all files at once
    const uploadResults = await bulkUploadToCloudinary(fileArray, model_type, model_id);

    // Delete all local temp files in parallel
    await Promise.all(
      fileArray.map((file) =>
        fs
          .unlink(file.path)
          .catch((err) => console.error(`Failed to delete temp file ${file.path}:`, err)),
      ),
    );

    // Map upload results to structured media objects
    const mediaList = uploadResults.map((upload, index) => ({
      model_type,
      model_id,
      media_type: upload.mediaType || media_type,
      media_url: upload.secure_url,
      public_id: upload.public_id,
      folder_path: upload.asset_folder,
      is_primary: index === 0 ? 1 : 0,
      sort_order: index + 1,
      is_deleted: 0,
    }));

    return mediaList;
  } catch (err) {
    // Attempt cleanup of temp files even if upload fails
    if (files) {
      const fileArray = Array.isArray(files) ? files : [files];
      await Promise.allSettled(fileArray.map((file) => fs.unlink(file.path)));
    }

    throw new ApiError(500, `Failed to upload media: ${err.message || 'Unknown error'}`);
  }
};

/**
 * Delete media from cloudinary
 * Handles both single and multiple media items efficiently
 */
export const mediaDelete = async (mediaItems) => {
  if (!mediaItems || (Array.isArray(mediaItems) && mediaItems.length === 0)) {
    throw new ApiError(400, 'No media items provided for deletion');
  }

  try {
    // Always treat as array for consistent processing
    const itemsArray = Array.isArray(mediaItems) ? mediaItems : [mediaItems];

    // Validate that items have required fields
    const validItems = itemsArray.filter((item) => item?.public_id);

    if (validItems.length === 0) {
      throw new ApiError(400, 'No valid media items with public_id found');
    }

    // Bulk delete all items at once
    const deleteResults = await bulkDeleteFromCloudinary(validItems);

    return {
      success: true,
      deleted_count: validItems.length,
      results: deleteResults,
    };
  } catch (err) {
    throw new ApiError(500, `Failed to delete media: ${err.message || 'Unknown error'}`);
  }
};
