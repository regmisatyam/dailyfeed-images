import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  uploadToCloudinary, 
  checkCloudinaryImage, 
  deleteFromCloudinary,
  getCloudinaryUrl 
} from '../services/cloudinaryService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_DIR = path.join(__dirname, '../../public/generated');
const USE_CLOUDINARY = process.env.USE_CLOUDINARY === 'true';

/**
 * Ensure the generated images directory exists (for local storage fallback)
 */
async function ensureGeneratedDir() {
  try {
    await fs.access(GENERATED_DIR);
  } catch {
    await fs.mkdir(GENERATED_DIR, { recursive: true });
    console.log('📁 Created generated images directory');
  }
}

/**
 * Check if an image already exists for an article
 */
export async function checkImageExists(articleId) {
  if (USE_CLOUDINARY) {
    const result = await checkCloudinaryImage(articleId);
    return result !== null;
  }
  
  // Local storage fallback
  const imagePath = path.join(GENERATED_DIR, `news_${articleId}.jpg`);
  
  try {
    await fs.access(imagePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save generated image (to Cloudinary or local disk)
 */
export async function saveImage(imageBuffer, articleId) {
  if (USE_CLOUDINARY) {
    const result = await uploadToCloudinary(imageBuffer, articleId);
    console.log(`💾 Saved image to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  }
  
  // Local storage fallback
  await ensureGeneratedDir();
  
  const imagePath = path.join(GENERATED_DIR, `news_${articleId}.jpg`);
  await fs.writeFile(imagePath, imageBuffer);
  
  console.log(`💾 Saved image to local disk: ${imagePath}`);
  return imagePath;
}

/**
 * Get the URL for an image
 */
export function getImageUrl(articleId) {
  if (USE_CLOUDINARY) {
    return getCloudinaryUrl(articleId);
  }
  
  // Local storage URL
  return `${process.env.PUBLIC_BASE_URL}/generated/news_${articleId}.jpg`;
}

/**
 * Delete an image
 */
export async function deleteImage(articleId) {
  if (USE_CLOUDINARY) {
    try {
      await deleteFromCloudinary(articleId);
      return true;
    } catch {
      return false;
    }
  }
  
  // Local storage fallback
  const imagePath = path.join(GENERATED_DIR, `news_${articleId}.jpg`);
  
  try {
    await fs.unlink(imagePath);
    console.log(`🗑️  Deleted image: ${imagePath}`);
    return true;
  } catch {
    return false;
  }
}

