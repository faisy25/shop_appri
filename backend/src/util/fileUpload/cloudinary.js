import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Detect media type from file extension
const detectMediaType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext)) {
    return 'image';
  } else if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
    return 'video';
  } else {
    return 'file'; // PDF, DOCX, ZIP, etc
  }
};

// Optimized bulk upload using Promise.all
export const bulkUploadToCloudinary = async (files, model_type, model_id) => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const mediaType = detectMediaType(file.path);
      const folder = `${mediaType}s/${model_type}/${model_id}/`;

      const options = {
        folder,
      };

      if (mediaType === 'video') {
        options.resource_type = 'video';
      } else if (mediaType === 'file') {
        options.resource_type = 'raw';
      }

      return cloudinary.uploader.upload(file.path, options).then((result) => ({
        ...result,
        mediaType,
        originalIndex: index,
        localPath: file.path,
      }));
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Bulk upload failed: ${error.message}`);
  }
};

// Optimized bulk delete
export const bulkDeleteFromCloudinary = async (mediaItems) => {
  try {
    // Group by resource type
    const grouped = mediaItems.reduce((acc, item) => {
      const type = item.media_type || 'image';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item.public_id);
      return acc;
    }, {});

    const deletePromises = Object.entries(grouped).map(([type, publicIds]) => {
      if (type === 'image') {
        return cloudinary.api.delete_resources(publicIds, {
          resource_type: 'image',
        });
      } else {
        // For video and raw files, delete individually
        return Promise.all(
          publicIds.map((id) =>
            cloudinary.uploader.destroy(id, {
              resource_type: type === 'video' ? 'video' : 'raw',
            }),
          ),
        );
      }
    });

    return await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(`Bulk delete failed: ${error.message}`);
  }
};

// // Single upload (keep for backward compatibility)
// export const uploadMediaToCloudinary = async (filePath, model_type, model_id) => {
//   const mediaType = detectMediaType(filePath);
//   const folder = `${mediaType}s/${model_type}/${model_id}/`;

//   const options = {
//     folder,
//   };

//   if (mediaType === 'video') {
//     options.resource_type = 'video';
//   } else if (mediaType === 'file') {
//     options.resource_type = 'raw';
//   }

//   return cloudinary.uploader.upload(filePath, options);
// };

// // Single delete
// export const deleteFromCloudinary = async (publicId, type = 'image') => {
//   return cloudinary.uploader.destroy(publicId, { resource_type: type });
// };
