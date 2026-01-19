import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Search for photos on Unsplash
 */
export async function searchPhotos(query, options = {}) {
  const {
    perPage = 10,
    orientation = 'landscape',
    contentFilter = 'high'
  } = options;

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY not configured');
  }

  try {
    console.log(`🔎 Searching Unsplash for: "${query}"`);
    
    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      params: {
        query,
        per_page: perPage,
        orientation,
        content_filter: contentFilter
      },
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      },
      timeout: 10000
    });

    const results = response.data.results || [];
    console.log(`✅ Found ${results.length} photos for "${query}"`);
    
    return results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      downloadUrl: photo.urls.full,
      width: photo.width,
      height: photo.height,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html
    }));
  } catch (error) {
    console.error(`❌ Error searching Unsplash for "${query}":`, error.message);
    return [];
  }
}

/**
 * Download image from URL
 */
export async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`❌ Error downloading image from ${url}:`, error.message);
    throw error;
  }
}

/**
 * Find best matching photo for a search query
 */
export async function findBestPhoto(query, preferredOrientation = 'landscape') {
  if (!query || query.trim() === '') {
    return null;
  }

  const photos = await searchPhotos(query, {
    perPage: 5,
    orientation: preferredOrientation
  });

  if (photos.length === 0) {
    return null;
  }

  // Return the first (most relevant) photo
  return photos[0];
}

/**
 * Get multiple photos for composite image
 */
export async function getCompositePhotos(strategy) {
  const photos = {
    main: null,
    secondary: null,
    background: null
  };

  // Search for main subject
  if (strategy.mainSubject) {
    photos.main = await findBestPhoto(strategy.mainSubject.query, 'portrait');
  }

  // Search for secondary subject
  if (strategy.secondarySubject) {
    photos.secondary = await findBestPhoto(strategy.secondarySubject.query, 'landscape');
  }

  // Search for background
  if (strategy.background) {
    photos.background = await findBestPhoto(strategy.background.query, 'landscape');
  }

  // Fallback: if no background, use main subject as background
  if (!photos.background && strategy.mainSubject) {
    photos.background = await findBestPhoto(strategy.mainSubject.query, 'landscape');
  }

  console.log('📸 Retrieved photos:', {
    main: photos.main ? photos.main.id : 'none',
    secondary: photos.secondary ? photos.secondary.id : 'none',
    background: photos.background ? photos.background.id : 'none'
  });

  return photos;
}

