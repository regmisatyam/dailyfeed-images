import express from 'express';
import { generateNewsImage } from '../services/imageGenerator.js';
import { getArticleById } from '../services/articleFetcher.js';
import { checkImageExists, getImageUrl } from '../utils/fileUtils.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: 'Missing required parameter: id'
      });
    }

    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return res.status(400).json({
        error: 'Invalid article id: must be a number'
      });
    }

    // Check if image already exists (caching)
    const existingImage = await checkImageExists(articleId);
    if (existingImage) {
      console.log(`✅ Cache hit for article ${articleId}`);
      return res.json({
        id: articleId,
        url: getImageUrl(articleId)
      });
    }

    // Fetch article data
    const article = await getArticleById(articleId);
    if (!article) {
      return res.status(404).json({
        error: `Article with id ${articleId} not found`
      });
    }

    // Generate image
    console.log(`🎨 Generating image for article ${articleId}: "${article.title}"`);
    await generateNewsImage(article);

    // Return response
    res.json({
      id: articleId,
      url: getImageUrl(articleId)
    });

  } catch (error) {
    next(error);
  }
});

export default router;

