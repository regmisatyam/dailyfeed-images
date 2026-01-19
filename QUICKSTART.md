# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- ✅ Node.js 18 or higher
- ✅ npm (comes with Node.js)
- ✅ Unsplash API key ([Get free key](https://unsplash.com/developers))

## Installation (3 steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Open `.env` file and add your Unsplash API key:

```env
UNSPLASH_ACCESS_KEY=your_actual_key_here
```

### 3. Start Server

```bash
npm start
```

You should see:
```
🚀 DailyFeed Images Service running on port 3000
📸 Access endpoint: http://localhost:3000/news-image?id=ARTICLE_ID
```

## Test It!

### Option 1: Using cURL

```bash
curl "http://localhost:3000/news-image?id=393"
```

Expected response:
```json
{
  "id": 393,
  "url": "http://localhost:3000/generated/news_393.jpg"
}
```

### Option 2: Using Browser

Open in your browser:
```
http://localhost:3000/news-image?id=393
```

Then view the generated image:
```
http://localhost:3000/generated/news_393.jpg
```

### Option 3: Using Test Script

```bash
./test-api.sh
```

This runs a comprehensive test suite automatically.

## What Just Happened?

1. ✅ Server fetched article #393 from the news API
2. ✅ Extracted keywords from the article title
3. ✅ Searched Unsplash for relevant real photos
4. ✅ Composed a professional 1920×1080 news image
5. ✅ Saved it to `public/generated/news_393.jpg`
6. ✅ Returned the URL

## Try Different Articles

```bash
curl "http://localhost:3000/news-image?id=394"
curl "http://localhost:3000/news-image?id=395"
curl "http://localhost:3000/news-image?id=396"
```

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🏗️ Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- 💡 See [EXAMPLES.md](EXAMPLES.md) for usage examples
- 🔧 Review [SETUP.md](SETUP.md) for detailed setup instructions

## Troubleshooting

### "UNSPLASH_ACCESS_KEY not configured"

**Fix:** Edit `.env` file and add your Unsplash API key.

### "Failed to fetch articles"

**Fix:** Check your internet connection. The service needs to access:
- https://dailyfeed.teletechnepal.com/api/articles
- https://api.unsplash.com

### Port 3000 already in use

**Fix:** Change the port in `.env`:
```env
PORT=3001
```

## Development Mode

For auto-reload during development:

```bash
npm run dev
```

## That's It!

You now have a fully functional news image generation service! 🎉

For questions or issues, check the documentation or open an issue.

