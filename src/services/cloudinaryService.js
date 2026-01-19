import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} imageBuffer - The image buffer to upload
 * @param {number} articleId - The article ID for naming
 * @returns {Promise<Object>} Upload result with URL
 */
export async function uploadToCloudinary(imageBuffer, articleId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'dailyfeed',
        public_id: `news_${articleId}`,
        resource_type: 'image',
        format: 'jpg',
        overwrite: true,
        invalidate: true, // Invalidate CDN cache on update
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log(`☁️  Uploaded to Cloudinary: ${result.secure_url}`);
          resolve(result);
        }
      }
    );

    // Write buffer to the stream
    uploadStream.end(imageBuffer);
  });
}

/**
 * Check if an image exists in Cloudinary
 * @param {number} articleId - The article ID
 * @returns {Promise<Object|null>} Resource details if exists, null otherwise
 */
export async function checkCloudinaryImage(articleId) {
  try {
    const result = await cloudinary.api.resource(`dailyfeed/news_${articleId}`, {
      resource_type: 'image'
    });
    return result;
  } catch (error) {
    if (error.error && error.error.http_code === 404) {
      return null; // Image doesn't exist
    }
    throw error;
  }
}

/**
 * Delete an image from Cloudinary
 * @param {number} articleId - The article ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteFromCloudinary(articleId) {
  try {
    const result = await cloudinary.uploader.destroy(`dailyfeed/news_${articleId}`, {
      resource_type: 'image',
      invalidate: true
    });
    console.log(`🗑️  Deleted from Cloudinary: news_${articleId}`);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error);
    throw error;
  }
}

/**
 * Get Cloudinary URL for an image
 * @param {number} articleId - The article ID
 * @returns {string} The Cloudinary URL
 */
export function getCloudinaryUrl(articleId) {
  return cloudinary.url(`dailyfeed/news_${articleId}`, {
    secure: true,
    format: 'jpg',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
}

export default cloudinary;
