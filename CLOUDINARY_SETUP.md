# ☁️ Cloudinary Setup Guide

This guide will help you set up Cloudinary for persistent image storage on Render (or any other cloud platform).

## Why Cloudinary?

Platforms like Render, Heroku, and Railway use **ephemeral storage** - any files saved to disk are deleted when:
- The container restarts
- You deploy new code
- The platform scales your app

**Cloudinary provides:**
- ✅ Persistent cloud storage
- ✅ Global CDN for fast image delivery
- ✅ Free tier (25 GB storage, 25 GB bandwidth/month)
- ✅ Automatic image optimization
- ✅ Easy API integration

---

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com/)
2. Click **Sign Up for Free**
3. Complete the registration (no credit card required for free tier)
4. Verify your email address

---

## Step 2: Get Your API Credentials

After logging in:

1. Go to your **Dashboard** (https://console.cloudinary.com/)
2. You'll see your **Account Details** section with:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "reveal" to see it)

**⚠️ Keep your API Secret private!**

---

## Step 3: Configure Environment Variables

### For Local Development

Create or update your `.env` file in the project root:

```bash
# Cloudinary Configuration
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Your existing variables
UNSPLASH_ACCESS_KEY=your_unsplash_key
DAILYFEED_API_URL=your_dailyfeed_api_url
PUBLIC_BASE_URL=http://localhost:3000
PORT=3000
```

### For Render (Production)

1. Go to your Render dashboard
2. Select your web service
3. Click on **Environment** in the left sidebar
4. Add these environment variables:

| Key | Value | Example |
|-----|-------|---------|
| `USE_CLOUDINARY` | `true` | `true` |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | `dxyz123abc` |
| `CLOUDINARY_API_KEY` | Your API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Your API secret | `abcdef123456` |

5. Click **Save Changes** - Render will automatically redeploy

---

## Step 4: Test the Setup

### Local Testing

1. Start your server:
   ```bash
   npm start
   ```

2. Generate a test image:
   ```bash
   curl "http://localhost:3000/api/news-image?id=123"
   ```

3. Check the response - you should see a Cloudinary URL:
   ```json
   {
     "id": 123,
     "url": "https://res.cloudinary.com/your-cloud-name/image/upload/dailyfeed/news_123.jpg"
   }
   ```

4. Visit your Cloudinary dashboard → Media Library to see the uploaded image

### Production Testing (Render)

After Render redeploys:

1. Test your production API:
   ```bash
   curl "https://your-app.onrender.com/api/news-image?id=123"
   ```

2. Verify the Cloudinary URL is returned
3. Check your Cloudinary Media Library for the uploaded image

---

## Understanding the Configuration

### How It Works

The app now supports **two storage modes**:

#### 1. **Cloud Storage (Cloudinary)** - Recommended for production
- Set `USE_CLOUDINARY=true`
- Images are uploaded to Cloudinary
- URLs point to Cloudinary CDN
- Images persist across deployments

#### 2. **Local Storage** - For local development only
- Set `USE_CLOUDINARY=false`
- Images are saved to `public/generated/`
- URLs point to your local server
- **NOT suitable for Render/Heroku/Railway**

### Storage Structure

Images are stored in Cloudinary with this structure:
```
dailyfeed/
  └── news_123.jpg
  └── news_456.jpg
  └── news_789.jpg
```

---

## Cloudinary Free Tier Limits

The free tier includes:

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

### What This Means

If each image is ~500 KB:
- You can store ~50,000 images
- Serve ~50,000 images/month

This is more than enough for most applications!

---

## Optional: Cloudinary Features

### Image Optimization

The app automatically optimizes images using:
```javascript
{
  quality: 'auto:good',     // Automatic quality adjustment
  fetch_format: 'auto'      // Automatic format (WebP for browsers that support it)
}
```

### Custom Transformations

You can add more transformations in `src/services/cloudinaryService.js`:

```javascript
export function getCloudinaryUrl(articleId) {
  return cloudinary.url(`dailyfeed/news_${articleId}`, {
    secure: true,
    format: 'jpg',
    transformation: [
      { width: 1200, height: 630, crop: 'fill' },  // Resize
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
}
```

---

## Troubleshooting

### "Invalid cloud_name" Error

**Problem**: Cloudinary credentials are incorrect or missing

**Solution**:
1. Verify credentials in your Cloudinary dashboard
2. Check environment variables in Render
3. Restart the service after updating variables

### Images Not Appearing

**Problem**: Cache or CDN delay

**Solution**:
1. Check Cloudinary Media Library - is the image there?
2. Try with `invalidate: true` (already enabled)
3. Wait 30-60 seconds for CDN propagation

### "Upload failed" Error

**Problem**: API key permissions or quota exceeded

**Solution**:
1. Check your Cloudinary dashboard for quota usage
2. Verify API key has upload permissions
3. Check error logs for specific error messages

---

## Switching Back to Local Storage

To disable Cloudinary and use local storage:

```bash
USE_CLOUDINARY=false
```

**Note**: Only do this for local development. Render will lose images on restart.

---

## Need Help?

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Support**: https://support.cloudinary.com/
- **API Reference**: https://cloudinary.com/documentation/image_upload_api_reference

---

## Summary Checklist

- [ ] Created Cloudinary account
- [ ] Got Cloud Name, API Key, and API Secret
- [ ] Added environment variables to `.env` (local)
- [ ] Added environment variables to Render (production)
- [ ] Set `USE_CLOUDINARY=true`
- [ ] Tested image generation locally
- [ ] Tested image generation on Render
- [ ] Verified images appear in Cloudinary Media Library

**You're all set! 🎉 Your images will now persist across deployments.**
