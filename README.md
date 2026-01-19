# DailyFeed Images - News Media Automation Service

A professional backend service that automatically generates news-style composite images using **real photographs only** from stock image providers. No AI-generated imagery—only authentic, editorial-safe photos.

## 🎯 Overview

This service fetches news headlines from an external API and creates visually compelling 16:9 composite images by intelligently combining real photographs from Unsplash based on extracted keywords from article titles.

## ✨ Features

- ✅ **Real Photos Only** - Uses Unsplash API for authentic, royalty-free images
- ✅ **Smart Keyword Extraction** - NLP-powered entity extraction (people, objects, locations)
- ✅ **News-Style Composition** - Professional 1920×1080 layouts with proper layering
- ✅ **Intelligent Caching** - Reuses generated images to save API calls and processing time
- ✅ **REST API** - Simple GET endpoint for image generation
- ✅ **Editorial Safe** - No deepfakes, no AI-generated faces, no misleading visuals

## 🏗️ Architecture

```
┌─────────────────┐
│  News API       │
│  (External)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Article        │      │  Keyword         │
│  Fetcher        │─────▶│  Extractor       │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Search          │
                         │  Strategy        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Unsplash API    │
                         │  (Real Photos)   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Image           │
                         │  Composer        │
                         │  (Sharp)         │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  File Storage    │
                         │  & Caching       │
                         └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Unsplash API Access Key ([Get one here](https://unsplash.com/developers))

### Installation

1. **Clone and navigate to the project:**

```bash
cd dailyfeed-images
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Edit the `.env` file:

```env
PORT=3000
UNSPLASH_ACCESS_KEY=your_actual_unsplash_access_key
ARTICLES_API_URL=https://dailyfeed.teletechnepal.com/api/articles
PUBLIC_BASE_URL=http://localhost:3000
```

> **Important:** Replace `your_actual_unsplash_access_key` with your real Unsplash API key.

4. **Start the server:**

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 📡 API Usage

### Endpoint

```
GET /news-image?id=ARTICLE_ID
```

### Request Example

```bash
curl "http://localhost:3000/news-image?id=393"
```

### Response Format

**Success (200 OK):**

```json
{
  "id": 393,
  "url": "http://localhost:3000/generated/news_393.jpg"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "Missing required parameter: id"
}
```

**Error (404 Not Found):**

```json
{
  "error": "Article with id 393 not found"
}
```

### Health Check

```bash
curl "http://localhost:3000/health"
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T12:34:56.789Z"
}
```

## 🎨 Image Generation Process

### 1. Keyword Extraction

The service uses NLP (via `compromise` library) to extract:

- **People**: Named individuals (e.g., "Trump", "Biden")
- **Objects**: Key nouns and concepts (e.g., "oil", "economy", "weapons")
- **Locations**: Places and environments (e.g., "Washington", "Middle East")

### 2. Search Strategy

Based on extracted keywords, the system determines:

- **Main Subject**: Primary focus (person or main object)
- **Secondary Subject**: Supporting element
- **Background**: Environmental context

### 3. Photo Retrieval

Searches Unsplash for:
- High-quality, editorial-safe photographs
- Landscape orientation for backgrounds
- Portrait orientation for people
- Content-filtered for news appropriateness

### 4. Image Composition

Creates a 1920×1080 composite with:
- **Background layer**: Full-canvas environmental photo (darkened)
- **Main subject**: Left side placement (45% width)
- **Secondary subject**: Right side placement (45% width, 60% height)
- **Title overlay**: Semi-transparent black bar at bottom with white text

### Example

**Title:** "Trump and Oil Prices Shake Global Markets"

**Generated Image:**
- Background: Real oil field photograph
- Left: Real Trump photograph
- Right: Real oil barrels/pump jack photograph
- Bottom: Title overlay with semi-transparent background

## 🗂️ Project Structure

```
dailyfeed-images/
├── src/
│   ├── server.js                 # Express server entry point
│   ├── routes/
│   │   └── newsImage.js          # /news-image endpoint
│   ├── services/
│   │   ├── articleFetcher.js     # Fetch articles from external API
│   │   ├── keywordExtractor.js   # NLP-based keyword extraction
│   │   ├── unsplashService.js    # Unsplash API integration
│   │   ├── imageComposer.js      # Sharp-based image composition
│   │   └── imageGenerator.js     # Main orchestration logic
│   └── utils/
│       └── fileUtils.js          # File system operations
├── public/
│   └── generated/                # Generated images (cached)
├── package.json
├── .env                          # Environment configuration
├── .env.example                  # Environment template
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `UNSPLASH_ACCESS_KEY` | Unsplash API key | *Required* |
| `ARTICLES_API_URL` | External news API endpoint | `https://dailyfeed.teletechnepal.com/api/articles` |
| `PUBLIC_BASE_URL` | Public URL for generated images | `http://localhost:3000` |

### Caching

- **Generated Images**: Cached in `public/generated/` directory
- **Articles**: Cached in memory for 5 minutes
- **Cache Strategy**: If image exists, return immediately without regeneration

## 📦 Dependencies

### Core Dependencies

- **express** - Web framework
- **axios** - HTTP client for API calls
- **sharp** - High-performance image processing
- **dotenv** - Environment variable management
- **compromise** - Natural language processing
- **node-cache** - In-memory caching

### Development Dependencies

- **nodemon** - Auto-reload during development

## 🎯 Design Principles

### 1. Real Photos Only
- ❌ No DALL·E, Stable Diffusion, or Midjourney
- ✅ Only Unsplash (real, royalty-free photographs)

### 2. News Credibility
- Editorial-safe content filtering
- No face manipulation or deepfakes
- Authentic photojournalism style

### 3. Performance
- Image caching to avoid regeneration
- Article caching to reduce API calls
- Efficient Sharp-based processing

### 4. Scalability
- Stateless design
- Easy horizontal scaling
- Cloud-ready (Replit, Heroku, AWS, etc.)

## 🚀 Deployment

### Replit

1. Import this repository to Replit
2. Set environment variables in Replit Secrets:
   - `UNSPLASH_ACCESS_KEY`
   - `PUBLIC_BASE_URL` (your Replit app URL)
3. Run the app

### Heroku

```bash
heroku create your-app-name
heroku config:set UNSPLASH_ACCESS_KEY=your_key
heroku config:set PUBLIC_BASE_URL=https://your-app-name.herokuapp.com
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing

```bash
# Start the server
npm start

# Test health endpoint
curl http://localhost:3000/health

# Generate an image
curl "http://localhost:3000/news-image?id=393"

# View the generated image
open public/generated/news_393.jpg
```

### Example Test Cases

1. **Article with person name**: "Trump Announces New Policy"
2. **Article with objects**: "Oil Prices Surge Amid Global Tensions"
3. **Article with location**: "Earthquake Strikes California Coast"
4. **Complex article**: "Biden and Putin Discuss Nuclear Arms Treaty"

## 📝 Legal & Safety

### Image Rights
- All images sourced from Unsplash (royalty-free, commercial use allowed)
- Photographer attribution included in metadata
- Complies with Unsplash API Terms of Service

### Content Safety
- No AI-generated faces or deepfakes
- No misleading synthetic imagery
- Editorial content filtering enabled
- Suitable for news media use

### Privacy
- No user data collection
- No tracking or analytics
- Stateless operation

## 🐛 Troubleshooting

### "UNSPLASH_ACCESS_KEY not configured"
- Ensure `.env` file exists and contains valid Unsplash API key
- Verify the key is active on Unsplash dashboard

### "Failed to fetch articles"
- Check internet connection
- Verify `ARTICLES_API_URL` is correct
- Ensure external API is accessible

### "Could not find any suitable photos"
- Article title may be too generic or abstract
- Try different article IDs
- Check Unsplash API rate limits (50 requests/hour for free tier)

### Images not displaying
- Verify `PUBLIC_BASE_URL` is correct
- Check `public/generated/` directory permissions
- Ensure server is running

## 🔮 Future Enhancements

- [ ] Support for multiple image providers (Pexels, Pixabay)
- [ ] Advanced NLP with spaCy for better entity extraction
- [ ] Custom image templates and layouts
- [ ] Batch image generation endpoint
- [ ] Image regeneration/refresh endpoint
- [ ] Analytics dashboard
- [ ] CDN integration for image delivery
- [ ] Webhook support for automatic generation

## 📄 License

MIT License - Feel free to use this project for commercial or personal purposes.

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing style
- All features are tested
- Documentation is updated
- Real photos only (no AI generation)

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ for news credibility and automation**

