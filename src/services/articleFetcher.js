import axios from 'axios';
import NodeCache from 'node-cache';

// Cache articles for 5 minutes
const articlesCache = new NodeCache({ stdTTL: 300 });

/**
 * Fetch all articles from the external API
 */
export async function fetchArticles() {
  const cacheKey = 'all_articles';
  const cached = articlesCache.get(cacheKey);
  
  if (cached) {
    console.log('📦 Using cached articles');
    return cached;
  }

  try {
    const apiUrl = process.env.ARTICLES_API_URL || 'https://dailyfeed.teletechnepal.com/api/articles';
    console.log(`📡 Fetching articles from ${apiUrl}`);
    
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'DailyFeed-Images-Service/1.0'
      }
    });

    const articles = response.data.articles || response.data;
    articlesCache.set(cacheKey, articles);
    
    console.log(`✅ Fetched ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('❌ Error fetching articles:', error.message);
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }
}

/**
 * Get a specific article by ID
 */
export async function getArticleById(id) {
  const articles = await fetchArticles();
  const article = articles.find(a => a.id === id);
  
  if (!article) {
    console.log(`⚠️  Article ${id} not found`);
    return null;
  }

  return article;
}

