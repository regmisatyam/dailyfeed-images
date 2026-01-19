# Usage Examples

## Basic Usage

### Example 1: Simple Article

**Request:**
```bash
curl "http://localhost:3000/news-image?id=393"
```

**Response:**
```json
{
  "id": 393,
  "url": "http://localhost:3000/generated/news_393.jpg"
}
```

**What happens:**
1. Service fetches article 393 from the news API
2. Extracts keywords from the title
3. Searches Unsplash for relevant real photos
4. Composes a 1920×1080 news-style image
5. Saves it to `public/generated/news_393.jpg`
6. Returns the URL

### Example 2: Cached Image

**Request:**
```bash
# First request (generates image)
curl "http://localhost:3000/news-image?id=393"

# Second request (returns cached)
curl "http://localhost:3000/news-image?id=393"
```

**Result:** Second request is much faster (< 50ms) because the image is already generated.

## Keyword Extraction Examples

### Example 1: Person-Focused Article

**Title:** "Trump Announces New Trade Policy"

**Extracted Keywords:**
```javascript
{
  people: ["Trump"],
  objects: ["Trade", "Policy"],
  locations: [],
  general: ["Announces", "Trade", "Policy"]
}
```

**Search Strategy:**
- Main Subject: Trump (person photo)
- Secondary Subject: Trade (business/commerce photo)
- Background: Policy/government (official building or setting)

**Result:** Composite image with Trump photo on left, trade-related imagery on right, government building background.

### Example 2: Event-Focused Article

**Title:** "Oil Prices Surge Amid Global Tensions"

**Extracted Keywords:**
```javascript
{
  people: [],
  objects: ["Oil", "Prices", "Tensions"],
  locations: [],
  general: ["Surge", "Global", "Tensions"]
}
```

**Search Strategy:**
- Main Subject: Oil (oil barrels, pump jacks)
- Secondary Subject: Prices (stock market, charts)
- Background: Global (world map, industrial setting)

**Result:** Composite image focused on oil industry with economic context.

### Example 3: Location-Focused Article

**Title:** "Earthquake Strikes California Coast"

**Extracted Keywords:**
```javascript
{
  people: [],
  objects: ["Earthquake", "Coast"],
  locations: ["California"],
  general: ["Earthquake", "Strikes", "California", "Coast"]
}
```

**Search Strategy:**
- Main Subject: Earthquake (damaged buildings, cracks)
- Secondary Subject: Coast (coastal imagery)
- Background: California (California landscape)

**Result:** Composite image showing earthquake damage with California coastal context.

## Image Composition Layouts

### Layout 1: Full Composition (3 Photos)

When all three photo types are found:

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────┐        BACKGROUND            │
│  │          │     (Darkened 70%)           │
│  │   MAIN   │                              │
│  │ SUBJECT  │          ┌──────────┐        │
│  │  (45%)   │          │SECONDARY │        │
│  │          │          │ SUBJECT  │        │
│  └──────────┘          │  (45%)   │        │
│                        └──────────┘        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ ▓ Article Title Here           ▓ │   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Layout 2: Two-Layer Composition (2 Photos)

When main subject and background are found:

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────┐                              │
│  │          │        BACKGROUND            │
│  │   MAIN   │      (Darkened 75%)          │
│  │ SUBJECT  │                              │
│  │  (50%)   │                              │
│  │          │                              │
│  └──────────┘                              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ ▓ Article Title Here           ▓ │   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Layout 3: Single Image (1 Photo)

When only background is found:

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│            BACKGROUND IMAGE                 │
│          (Darkened 80%)                     │
│                                             │
│                                             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ ▓ Article Title Here           ▓ │   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## API Integration Examples

### JavaScript (Node.js)

```javascript
import axios from 'axios';

async function getNewsImage(articleId) {
  try {
    const response = await axios.get(
      `http://localhost:3000/news-image?id=${articleId}`
    );
    
    console.log('Image URL:', response.data.url);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
getNewsImage(393);
```

### Python

```python
import requests

def get_news_image(article_id):
    try:
        response = requests.get(
            f'http://localhost:3000/news-image',
            params={'id': article_id}
        )
        response.raise_for_status()
        
        data = response.json()
        print(f"Image URL: {data['url']}")
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

# Usage
get_news_image(393)
```

### cURL

```bash
# Basic request
curl "http://localhost:3000/news-image?id=393"

# With formatted JSON output
curl -s "http://localhost:3000/news-image?id=393" | jq .

# Download the image directly
curl -s "http://localhost:3000/news-image?id=393" | \
  jq -r '.url' | \
  xargs curl -o news_image.jpg

# Batch generate multiple images
for id in 393 394 395 396; do
  echo "Generating image for article $id..."
  curl -s "http://localhost:3000/news-image?id=$id"
  echo ""
done
```

### HTML/JavaScript (Frontend)

```html
<!DOCTYPE html>
<html>
<head>
    <title>News Image Generator</title>
</head>
<body>
    <h1>News Image Generator</h1>
    <input type="number" id="articleId" placeholder="Article ID">
    <button onclick="generateImage()">Generate</button>
    <div id="result"></div>
    
    <script>
        async function generateImage() {
            const articleId = document.getElementById('articleId').value;
            const resultDiv = document.getElementById('result');
            
            resultDiv.innerHTML = 'Generating...';
            
            try {
                const response = await fetch(
                    `http://localhost:3000/news-image?id=${articleId}`
                );
                const data = await response.json();
                
                if (data.url) {
                    resultDiv.innerHTML = `
                        <h2>Generated Image:</h2>
                        <img src="${data.url}" style="max-width: 100%;">
                        <p>URL: <a href="${data.url}">${data.url}</a></p>
                    `;
                } else {
                    resultDiv.innerHTML = `Error: ${data.error}`;
                }
            } catch (error) {
                resultDiv.innerHTML = `Error: ${error.message}`;
            }
        }
    </script>
</body>
</html>
```

## Performance Examples

### First Request (Generation)
```bash
$ time curl "http://localhost:3000/news-image?id=393"
{
  "id": 393,
  "url": "http://localhost:3000/generated/news_393.jpg"
}

real    0m3.245s  # ~3 seconds (fetching + composing)
user    0m0.012s
sys     0m0.008s
```

### Cached Request
```bash
$ time curl "http://localhost:3000/news-image?id=393"
{
  "id": 393,
  "url": "http://localhost:3000/generated/news_393.jpg"
}

real    0m0.042s  # ~40ms (cached)
user    0m0.010s
sys     0m0.006s
```

## Error Handling Examples

### Missing Parameter
```bash
$ curl "http://localhost:3000/news-image"
{
  "error": "Missing required parameter: id"
}
```

### Invalid ID Format
```bash
$ curl "http://localhost:3000/news-image?id=abc"
{
  "error": "Invalid article id: must be a number"
}
```

### Article Not Found
```bash
$ curl "http://localhost:3000/news-image?id=999999"
{
  "error": "Article with id 999999 not found"
}
```

### Unsplash API Key Missing
```bash
$ curl "http://localhost:3000/news-image?id=393"
{
  "error": "UNSPLASH_ACCESS_KEY not configured"
}
```

## Real-World Use Cases

### Use Case 1: News Website

Automatically generate featured images for articles that don't have photos:

```javascript
// When publishing an article
async function publishArticle(article) {
  if (!article.featuredImage) {
    // Generate image automatically
    const imageData = await getNewsImage(article.id);
    article.featuredImage = imageData.url;
  }
  
  await database.save(article);
}
```

### Use Case 2: Social Media Sharing

Generate Open Graph images for better social media previews:

```javascript
// Generate OG image for social sharing
async function getOGImage(articleId) {
  const imageData = await getNewsImage(articleId);
  
  return {
    'og:image': imageData.url,
    'og:image:width': '1920',
    'og:image:height': '1080',
    'twitter:card': 'summary_large_image',
    'twitter:image': imageData.url
  };
}
```

### Use Case 3: Email Newsletters

Include generated images in email campaigns:

```javascript
// Generate newsletter with images
async function generateNewsletter(articles) {
  const articlesWithImages = await Promise.all(
    articles.map(async (article) => {
      const image = await getNewsImage(article.id);
      return { ...article, imageUrl: image.url };
    })
  );
  
  return renderNewsletterTemplate(articlesWithImages);
}
```

## Tips & Best Practices

1. **Cache Awareness**: Images are cached permanently. To regenerate, delete the file first:
   ```bash
   rm public/generated/news_393.jpg
   curl "http://localhost:3000/news-image?id=393"
   ```

2. **Rate Limiting**: Unsplash free tier allows 50 requests/hour. Cache aggressively!

3. **Title Quality**: Better titles = better images. Specific titles work best:
   - ✅ "Trump Announces Oil Trade Deal"
   - ❌ "Important Announcement Made"

4. **Batch Processing**: Generate images during off-peak hours to avoid rate limits

5. **Error Handling**: Always handle errors gracefully in production:
   ```javascript
   try {
     const image = await getNewsImage(articleId);
   } catch (error) {
     // Fallback to default image
     const image = { url: '/default-news-image.jpg' };
   }
   ```

