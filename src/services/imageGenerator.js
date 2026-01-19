import { extractKeywords, getSearchStrategy } from './keywordExtractor.js';
import { getCompositePhotos } from './unsplashService.js';
import { composeNewsImage } from './imageComposer.js';
import { saveImage } from '../utils/fileUtils.js';

/**
 * Main function to generate news image for an article
 */
export async function generateNewsImage(article) {
  try {
    console.log(`\n🎬 Starting image generation for article ${article.id}`);
    console.log(`📰 Title: "${article.title}"`);

    // Step 1: Extract keywords from title
    const keywords = extractKeywords(article.title);

    // Step 2: Determine search strategy
    const strategy = getSearchStrategy(keywords);

    // Step 3: Fetch photos from Unsplash
    const photos = await getCompositePhotos(strategy);

    // Validate we have at least one photo
    if (!photos.background && !photos.main) {
      throw new Error('Could not find any suitable photos for this article');
    }

    // Step 4: Compose the final image
    const composedImage = await composeNewsImage(photos, article.title);

    // Step 5: Save the image
    await saveImage(composedImage, article.id);

    console.log(`✅ Successfully generated image for article ${article.id}\n`);
    return true;

  } catch (error) {
    console.error(`❌ Failed to generate image for article ${article.id}:`, error.message);
    throw error;
  }
}

