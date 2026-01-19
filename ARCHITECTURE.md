# System Architecture

## Overview

DailyFeed Images is a microservice that generates news-style composite images using real photographs. The system follows a modular, service-oriented architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│              (Browser, API Consumer, etc.)                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP GET /news-image?id=X
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                            │
│                    (src/server.js)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   ROUTE HANDLER                              │
│              (src/routes/newsImage.js)                       │
│  • Validate request parameters                               │
│  • Check cache (file system)                                 │
│  • Orchestrate generation pipeline                           │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌────────────────┐ ┌──────────┐ ┌──────────────┐
│ Article        │ │ Keyword  │ │ Unsplash     │
│ Fetcher        │ │ Extractor│ │ Service      │
│ (External API) │ │ (NLP)    │ │ (Real Photos)│
└────────┬───────┘ └────┬─────┘ └──────┬───────┘
         │              │               │
         └──────────────┼───────────────┘
                        ▼
              ┌──────────────────┐
              │ Image Composer   │
              │ (Sharp Library)  │
              └─────────┬────────┘
                        │
                        ▼
              ┌──────────────────┐
              │ File System      │
              │ (Cache Storage)  │
              └──────────────────┘
```

## Component Breakdown

### 1. Server Layer (`src/server.js`)

**Responsibility:** HTTP server setup and middleware configuration

**Key Features:**
- Express.js application setup
- Static file serving for generated images
- Error handling middleware
- Health check endpoint

**Dependencies:**
- express
- dotenv

**Endpoints:**
- `GET /news-image?id=X` - Main image generation endpoint
- `GET /health` - Health check
- `GET /generated/:filename` - Static image serving

### 2. Route Handler (`src/routes/newsImage.js`)

**Responsibility:** Request validation and orchestration

**Flow:**
1. Validate query parameters
2. Check if image exists (cache hit)
3. Fetch article data
4. Trigger image generation
5. Return response

**Error Handling:**
- 400: Missing or invalid parameters
- 404: Article not found
- 500: Generation errors

### 3. Article Fetcher (`src/services/articleFetcher.js`)

**Responsibility:** Fetch and cache article data from external API

**Features:**
- HTTP client for external news API
- In-memory caching (5-minute TTL)
- Error handling and retry logic

**Cache Strategy:**
- Cache key: `all_articles`
- TTL: 300 seconds (5 minutes)
- Reduces external API calls

**API Contract:**
```javascript
{
  articles: [
    {
      id: number,
      title: string
    }
  ]
}
```

### 4. Keyword Extractor (`src/services/keywordExtractor.js`)

**Responsibility:** NLP-based entity extraction from article titles

**Technology:** Compromise.js (lightweight NLP library)

**Extraction Categories:**
- **People**: Named individuals (e.g., "Trump", "Biden")
- **Objects**: Nouns and concepts (e.g., "oil", "economy")
- **Locations**: Places (e.g., "California", "Washington")
- **General**: Important terms for fallback

**Output:**
```javascript
{
  people: string[],
  objects: string[],
  locations: string[],
  general: string[]
}
```

**Search Strategy:**
Priority order for image search:
1. People (portrait orientation)
2. Objects (landscape orientation)
3. Locations (landscape orientation)
4. General keywords (fallback)

### 5. Unsplash Service (`src/services/unsplashService.js`)

**Responsibility:** Search and download real photographs from Unsplash

**API Integration:**
- Endpoint: `https://api.unsplash.com/search/photos`
- Authentication: Client-ID (Access Key)
- Rate Limit: 50 requests/hour (free tier)

**Search Parameters:**
- `query`: Keyword to search
- `per_page`: Number of results (default: 10)
- `orientation`: landscape/portrait
- `content_filter`: high (editorial-safe content)

**Photo Selection:**
- Returns top 5 most relevant photos
- Selects first result (highest relevance)
- Fallback: Try alternative keywords

**Downloaded Photo Format:**
```javascript
{
  id: string,
  url: string,
  downloadUrl: string,
  width: number,
  height: number,
  description: string,
  photographer: string,
  photographerUrl: string
}
```

### 6. Image Composer (`src/services/imageComposer.js`)

**Responsibility:** Composite image creation using Sharp library

**Technology:** Sharp (high-performance Node.js image processing)

**Canvas Specifications:**
- Dimensions: 1920×1080 (16:9 aspect ratio)
- Format: JPEG
- Quality: 90%

**Composition Strategies:**

#### Strategy 1: Full Composition (3 photos)
```javascript
{
  background: {
    size: 1920×1080,
    brightness: 0.7 (darkened 30%)
  },
  mainSubject: {
    size: 864×1080 (45% width),
    position: { left: 50, top: 0 }
  },
  secondarySubject: {
    size: 864×648 (45% width, 60% height),
    position: { right: 50, top: 216 }
  }
}
```

#### Strategy 2: Two-Layer (2 photos)
```javascript
{
  background: {
    size: 1920×1080,
    brightness: 0.75
  },
  mainSubject: {
    size: 960×1080 (50% width),
    position: { left: 50, top: 0 }
  }
}
```

#### Strategy 3: Single Image (1 photo)
```javascript
{
  background: {
    size: 1920×1080,
    brightness: 0.8
  }
}
```

**Title Overlay:**
- Position: Bottom 200px
- Background: Black with 70% opacity
- Text: White, 48px, bold, Arial
- Padding: 60px left, 40px top
- Max length: 100 characters (truncated with "...")

**SVG Text Rendering:**
Uses SVG for high-quality text rendering with proper anti-aliasing.

### 7. Image Generator (`src/services/imageGenerator.js`)

**Responsibility:** Orchestrate the entire image generation pipeline

**Pipeline Steps:**
1. Extract keywords from article title
2. Determine search strategy
3. Fetch photos from Unsplash
4. Compose final image
5. Save to file system

**Error Handling:**
- Validates at least one photo is available
- Logs each step for debugging
- Throws descriptive errors

### 8. File Utilities (`src/utils/fileUtils.js`)

**Responsibility:** File system operations for image storage

**Functions:**
- `ensureGeneratedDir()`: Create directory if not exists
- `checkImageExists(articleId)`: Check cache
- `saveImage(buffer, articleId)`: Save generated image
- `deleteImage(articleId)`: Remove cached image

**Storage Location:**
- Directory: `public/generated/`
- Filename format: `news_{articleId}.jpg`
- Example: `news_393.jpg`

## Data Flow

### Request Flow (New Image)

```
1. Client Request
   GET /news-image?id=393
   
2. Route Handler
   ├─ Validate: id=393 (valid)
   ├─ Check cache: news_393.jpg (not found)
   └─ Proceed to generation
   
3. Article Fetcher
   ├─ Check cache: all_articles (miss)
   ├─ Fetch: https://dailyfeed.teletechnepal.com/api/articles
   ├─ Cache: Store for 5 minutes
   └─ Return: { id: 393, title: "..." }
   
4. Keyword Extractor
   ├─ Input: "Trump and Oil Prices Shake Global Markets"
   ├─ NLP: Extract entities
   └─ Output: { people: ["Trump"], objects: ["Oil", "Prices"], ... }
   
5. Unsplash Service
   ├─ Search: "Trump" (portrait)
   ├─ Search: "Oil" (landscape)
   ├─ Search: "Global Markets" (landscape)
   └─ Download: 3 photos
   
6. Image Composer
   ├─ Resize: Background to 1920×1080
   ├─ Resize: Main subject to 864×1080
   ├─ Resize: Secondary to 864×648
   ├─ Composite: Layer all images
   ├─ Add: Title overlay
   └─ Output: JPEG buffer
   
7. File System
   ├─ Create: public/generated/ (if needed)
   ├─ Save: news_393.jpg
   └─ Confirm: File written
   
8. Response
   {
     "id": 393,
     "url": "http://localhost:3000/generated/news_393.jpg"
   }
```

### Request Flow (Cached Image)

```
1. Client Request
   GET /news-image?id=393
   
2. Route Handler
   ├─ Validate: id=393 (valid)
   ├─ Check cache: news_393.jpg (found!)
   └─ Return immediately
   
3. Response (< 50ms)
   {
     "id": 393,
     "url": "http://localhost:3000/generated/news_393.jpg"
   }
```

## Caching Strategy

### Level 1: Article Cache (In-Memory)
- **Storage**: NodeCache (in-memory)
- **TTL**: 5 minutes
- **Purpose**: Reduce external API calls
- **Invalidation**: Automatic (time-based)

### Level 2: Image Cache (File System)
- **Storage**: `public/generated/` directory
- **TTL**: Infinite (manual deletion required)
- **Purpose**: Avoid regeneration
- **Invalidation**: Manual (delete file)

## Performance Characteristics

### First Request (Cold Cache)
- Article fetch: ~200-500ms
- Keyword extraction: ~10-50ms
- Unsplash search (3 queries): ~1-2s
- Image download (3 photos): ~1-2s
- Image composition: ~500ms-1s
- **Total**: ~3-5 seconds

### Cached Request (Warm Cache)
- Cache check: ~1-5ms
- File system read: ~10-20ms
- **Total**: ~20-50ms

### Memory Usage
- Base application: ~50MB
- Per image in memory: ~10-20MB (during processing)
- Cached articles: ~1-5MB

### Disk Usage
- Per generated image: ~200-500KB
- 1000 images: ~200-500MB

## Scalability Considerations

### Horizontal Scaling
- Stateless design (except file cache)
- Can run multiple instances behind load balancer
- Shared file system required (NFS, S3, etc.)

### Vertical Scaling
- CPU-bound: Image processing (Sharp)
- Memory-bound: Image buffers
- I/O-bound: Network requests (Unsplash)

### Bottlenecks
1. **Unsplash API**: 50 requests/hour (free tier)
   - Solution: Upgrade to paid tier or cache aggressively
2. **Image Processing**: CPU-intensive
   - Solution: Use worker threads or separate service
3. **File Storage**: Disk space
   - Solution: Implement cleanup policy or use cloud storage

## Security Considerations

### Input Validation
- Article ID: Must be integer
- No SQL injection risk (external API)
- No XSS risk (server-side only)

### API Key Protection
- Unsplash key in environment variables
- Never exposed to client
- Server-side only

### Rate Limiting
- Implement rate limiting middleware (future)
- Prevent abuse of generation endpoint

### Content Safety
- Unsplash content filter: "high"
- Editorial-safe images only
- No user-generated content

## Error Handling

### Error Types
1. **Validation Errors** (400)
   - Missing parameters
   - Invalid parameter types
   
2. **Not Found Errors** (404)
   - Article doesn't exist
   
3. **External API Errors** (500)
   - News API unreachable
   - Unsplash API errors
   
4. **Processing Errors** (500)
   - Image composition failures
   - File system errors

### Error Response Format
```json
{
  "error": "Descriptive error message"
}
```

### Logging
- Console logging for all operations
- Emoji prefixes for visual clarity:
  - 🚀 Server start
  - 📡 API requests
  - 🔍 Keyword extraction
  - 📸 Photo retrieval
  - 🎨 Image composition
  - ✅ Success
  - ❌ Errors
  - ⚠️  Warnings

## Testing Strategy

### Unit Tests (Future)
- Keyword extraction accuracy
- Image composition logic
- Cache behavior

### Integration Tests (Future)
- End-to-end image generation
- API error handling
- Cache invalidation

### Manual Testing
- Use `test-api.sh` script
- Visual inspection of generated images
- Performance benchmarking

## Deployment Architecture

### Development
```
Local Machine
├─ Node.js process
├─ File system cache
└─ Environment variables (.env)
```

### Production (Replit)
```
Replit Container
├─ Node.js process (auto-restart)
├─ Persistent storage (/home/runner)
├─ Environment variables (Secrets)
└─ Public URL (*.replit.app)
```

### Production (Cloud)
```
Load Balancer
├─ Instance 1
│  ├─ Node.js process
│  └─ Local cache
├─ Instance 2
│  ├─ Node.js process
│  └─ Local cache
└─ Shared Storage (S3/NFS)
   └─ Generated images
```

## Future Enhancements

### Phase 2
- [ ] Multiple image providers (Pexels, Pixabay)
- [ ] Advanced NLP with spaCy
- [ ] Custom templates and layouts
- [ ] Batch generation endpoint

### Phase 3
- [ ] CDN integration
- [ ] Webhook support
- [ ] Analytics dashboard
- [ ] A/B testing for layouts

### Phase 4
- [ ] Machine learning for better keyword extraction
- [ ] Automatic image quality scoring
- [ ] Real-time generation via WebSockets
- [ ] Admin panel for cache management

## Monitoring & Observability

### Metrics to Track
- Request latency (p50, p95, p99)
- Cache hit rate
- Unsplash API usage
- Error rate by type
- Disk usage

### Logging
- Structured logging (JSON format)
- Log aggregation (future)
- Error tracking (Sentry, etc.)

### Health Checks
- `/health` endpoint
- Checks:
  - Server responsive
  - File system writable
  - External APIs reachable (optional)

## Conclusion

This architecture prioritizes:
1. **Simplicity**: Easy to understand and maintain
2. **Performance**: Aggressive caching at multiple levels
3. **Reliability**: Proper error handling and fallbacks
4. **Scalability**: Stateless design for horizontal scaling
5. **Authenticity**: Real photos only, no AI generation

