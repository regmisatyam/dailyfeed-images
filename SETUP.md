# Setup Guide

## Step-by-Step Setup Instructions

### 1. Get Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Click "Register as a Developer"
3. Create a new application
4. Copy your "Access Key"

### 2. Configure Environment

Open the `.env` file and update:

```env
UNSPLASH_ACCESS_KEY=YOUR_ACTUAL_KEY_HERE
```

Replace `YOUR_ACTUAL_KEY_HERE` with the Access Key from step 1.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

You should see:
```
🚀 DailyFeed Images Service running on port 3000
📸 Access endpoint: http://localhost:3000/news-image?id=ARTICLE_ID
```

### 5. Test the API

Open a new terminal and run:

```bash
# Test health check
curl http://localhost:3000/health

# Generate an image for article ID 393
curl "http://localhost:3000/news-image?id=393"
```

Expected response:
```json
{
  "id": 393,
  "url": "http://localhost:3000/generated/news_393.jpg"
}
```

### 6. View Generated Image

Open in browser:
```
http://localhost:3000/generated/news_393.jpg
```

Or use command line:
```bash
open public/generated/news_393.jpg
```

## Troubleshooting

### Issue: "UNSPLASH_ACCESS_KEY not configured"

**Solution:** Make sure you've updated the `.env` file with your actual Unsplash API key.

### Issue: "Failed to fetch articles"

**Solution:** Check your internet connection and verify the articles API is accessible:
```bash
curl https://dailyfeed.teletechnepal.com/api/articles
```

### Issue: Rate Limit Exceeded

**Solution:** Unsplash free tier has limits:
- 50 requests per hour
- Wait an hour or upgrade your Unsplash plan

### Issue: No images generated

**Solution:** 
1. Check the console logs for errors
2. Verify the `public/generated/` directory exists
3. Check file permissions

## Development Mode

For development with auto-reload:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Testing Different Articles

Try different article IDs to see various image compositions:

```bash
curl "http://localhost:3000/news-image?id=393"
curl "http://localhost:3000/news-image?id=394"
curl "http://localhost:3000/news-image?id=395"
```

## Deployment to Replit

1. Import this repository to Replit
2. In Replit, go to "Secrets" (lock icon in sidebar)
3. Add secrets:
   - Key: `UNSPLASH_ACCESS_KEY`, Value: your Unsplash key
   - Key: `PUBLIC_BASE_URL`, Value: your Replit app URL (e.g., `https://your-app.replit.app`)
4. Click "Run"

## Next Steps

- Read the main [README.md](README.md) for full documentation
- Explore the code in `src/` directory
- Customize image layouts in `src/services/imageComposer.js`
- Adjust keyword extraction in `src/services/keywordExtractor.js`

