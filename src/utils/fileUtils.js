import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_DIR = path.join(__dirname, '../../public/generated');

/**
 * Ensure the generated images directory exists
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
  const imagePath = path.join(GENERATED_DIR, `news_${articleId}.jpg`);
  
  try {
    await fs.access(imagePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save generated image to disk
 */
export async function saveImage(imageBuffer, articleId) {
  await ensureGeneratedDir();
  
  const imagePath = path.join(GENERATED_DIR, `news_${articleId}.jpg`);
  await fs.writeFile(imagePath, imageBuffer);
  
  console.log(`💾 Saved image to: ${imagePath}`);
  return imagePath;
}

/**
 * Delete an image
 */
export async function deleteImage(articleId) {
  const imagePath = path.join(GENERATED_DIR, `news_${articleId}.jpg`);
  
  try {
    await fs.unlink(imagePath);
    console.log(`🗑️  Deleted image: ${imagePath}`);
    return true;
  } catch {
    return false;
  }
}

