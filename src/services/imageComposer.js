import sharp from 'sharp';
import { downloadImage } from './unsplashService.js';

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

/**
 * Compose a news-style image from multiple photos
 */
export async function composeNewsImage(photos, title) {
  try {
    console.log('🎨 Starting image composition...');

    // Download all available photos
    const downloadedPhotos = await downloadPhotos(photos);

    // Create composition based on available photos
    let composedImage;

    if (downloadedPhotos.main && downloadedPhotos.secondary && downloadedPhotos.background) {
      // Full composition: background + main subject + secondary subject
      composedImage = await createFullComposition(downloadedPhotos, title);
    } else if (downloadedPhotos.main && downloadedPhotos.background) {
      // Two-layer composition: background + main subject
      composedImage = await createTwoLayerComposition(downloadedPhotos, title);
    } else if (downloadedPhotos.background) {
      // Single image with title overlay
      composedImage = await createSingleImageComposition(downloadedPhotos, title);
    } else {
      throw new Error('No photos available for composition');
    }

    console.log('✅ Image composition complete');
    return composedImage;

  } catch (error) {
    console.error('❌ Error composing image:', error);
    throw error;
  }
}

/**
 * Download all photos
 */
async function downloadPhotos(photos) {
  const downloaded = {};

  if (photos.main) {
    try {
      downloaded.main = await downloadImage(photos.main.downloadUrl);
      console.log('✅ Downloaded main photo');
    } catch (error) {
      console.log('⚠️  Failed to download main photo');
    }
  }

  if (photos.secondary) {
    try {
      downloaded.secondary = await downloadImage(photos.secondary.downloadUrl);
      console.log('✅ Downloaded secondary photo');
    } catch (error) {
      console.log('⚠️  Failed to download secondary photo');
    }
  }

  if (photos.background) {
    try {
      downloaded.background = await downloadImage(photos.background.downloadUrl);
      console.log('✅ Downloaded background photo');
    } catch (error) {
      console.log('⚠️  Failed to download background photo');
    }
  }

  return downloaded;
}

/**
 * Create full composition with 3 layers
 * Focus on main subject as the primary image
 */
async function createFullComposition(photos, title) {
  // Use main subject as background (more focus on main subject)
  const background = await sharp(photos.main)
    .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.6 }) // Darken for better text visibility
    .toBuffer();

  // Add title overlay
  return await addTitleOverlay(background, title);
}

/**
 * Create two-layer composition
 * Focus on main subject
 */
async function createTwoLayerComposition(photos, title) {
  // Use main subject as primary focus
  const background = await sharp(photos.main)
    .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.65 })
    .toBuffer();

  return await addTitleOverlay(background, title);
}

/**
 * Create single image composition with title
 * Focus on the main subject from background
 */
async function createSingleImageComposition(photos, title) {
  const background = await sharp(photos.background)
    .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.65 })
    .toBuffer();

  return await addTitleOverlay(background, title);
}

/**
 * Add title overlay to image
 * Full title displayed at bottom-center with word wrapping
 */
async function addTitleOverlay(imageBuffer, title) {
  // Calculate overlay height based on title length (allow for word wrapping)
  const charsPerLine = 60;
  const estimatedLines = Math.ceil(title.length / charsPerLine);
  const lineHeight = 60;
  const padding = 40;
  const overlayHeight = Math.max(200, estimatedLines * lineHeight + padding * 2);

  // Create a semi-transparent overlay at the bottom
  const overlay = await sharp({
    create: {
      width: CANVAS_WIDTH,
      height: overlayHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.75 }
    }
  })
    .png()
    .toBuffer();

  // Composite overlay onto image
  const withOverlay = await sharp(imageBuffer)
    .composite([
      {
        input: overlay,
        top: CANVAS_HEIGHT - overlayHeight,
        left: 0,
        blend: 'over'
      }
    ])
    .toBuffer();

  // Add text using SVG overlay (centered)
  const textSvg = createTextSvg(title, overlayHeight);
  
  return await sharp(withOverlay)
    .composite([
      {
        input: Buffer.from(textSvg),
        top: CANVAS_HEIGHT - overlayHeight,
        left: 0
      }
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Create SVG text overlay
 * Full title with word wrapping, centered at bottom
 */
function createTextSvg(title, overlayHeight) {
  // Escape XML special characters
  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Word wrap the title
  const maxCharsPerLine = 60;
  const words = escapedTitle.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  // Generate SVG with centered text
  const lineHeight = 60;
  const fontSize = 48;
  const startY = (overlayHeight - (lines.length * lineHeight)) / 2 + fontSize;

  const textElements = lines.map((line, index) => {
    const y = startY + (index * lineHeight);
    return `<text x="50%" y="${y}" class="title">${line}</text>`;
  }).join('\n      ');

  return `
    <svg width="${CANVAS_WIDTH}" height="${overlayHeight}">
      <style>
        .title { 
          fill: #ffffff; 
          font-size: ${fontSize}px; 
          font-family: Arial, sans-serif; 
          font-weight: bold;
          text-anchor: middle;
        }
      </style>
      ${textElements}
    </svg>
  `;
}

