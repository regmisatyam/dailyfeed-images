# 🚀 Render Deployment Guide

This guide walks you through deploying your DailyFeed Images service to Render with persistent Cloudinary storage.

## Prerequisites

Before you begin:
- ✅ GitHub repository with your code
- ✅ Cloudinary account set up (see [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md))
- ✅ Unsplash API key
- ✅ DailyFeed API URL

---

## Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Add Cloudinary support for Render deployment"
   git push origin main
   ```

2. **Verify your `package.json` has the start script:**
   ```json
   {
     "scripts": {
       "start": "node src/server.js"
     }
   }
   ```

---

## Step 2: Create Render Web Service

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository:**
   - If not connected, click "Connect GitHub"
   - Select your repository
   - Click "Connect"

4. **Configure the service:**
   - **Name**: `dailyfeed-images` (or your preferred name)
   - **Region**: Select closest to your users
   - **Branch**: `main` (or your default branch)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or your preferred tier)

5. **Click "Advanced"** to expand advanced settings

---

## Step 3: Add Environment Variables

In the **Environment Variables** section, add the following:

| Key | Value | Example |
|-----|-------|---------|
| `PORT` | `3000` | `3000` |
| `UNSPLASH_ACCESS_KEY` | Your Unsplash key | `abc123xyz...` |
| `DAILYFEED_API_URL` | Your API URL | `https://dailyfeed.teletechnepal.com/api/articles` |
| `USE_CLOUDINARY` | `true` | `true` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard | `dxyz123abc` |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard | `123456789012345` |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard | `abcdef123456...` |

**Important Notes:**
- Don't include `PUBLIC_BASE_URL` - not needed with Cloudinary
- Make sure `USE_CLOUDINARY` is set to `true`
- Keep `CLOUDINARY_API_SECRET` secure

---

## Step 4: Deploy

1. **Click "Create Web Service"**

2. **Wait for deployment** (2-5 minutes)
   - Render will install dependencies
   - Build your application
   - Start the server

3. **Monitor the logs** in the Render dashboard
   - Look for: `Server is running on port 3000`
   - Check for any errors

---

## Step 5: Test Your Deployment

### Get Your Render URL

Your service URL will be:
```
https://your-service-name.onrender.com
```

### Test the Health Endpoint

```bash
curl https://your-service-name.onrender.com/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T12:34:56.789Z"
}
```

### Test Image Generation

```bash
curl "https://your-service-name.onrender.com/api/news-image?id=123"
```

**Expected response:**
```json
{
  "id": 123,
  "url": "https://res.cloudinary.com/your-cloud-name/image/upload/dailyfeed/news_123.jpg"
}
```

### Verify Image Storage

1. Go to [Cloudinary Media Library](https://console.cloudinary.com/console/media_library)
2. Look for the `dailyfeed` folder
3. Verify your generated image is there
4. Click the URL to view the image

---

## Step 6: Configure Your Main App

Update your main application to use the Render URL:

```javascript
const imageServiceUrl = 'https://your-service-name.onrender.com';

// Generate image
const response = await fetch(`${imageServiceUrl}/api/news-image?id=${articleId}`);
const data = await response.json();

// Use the Cloudinary URL
console.log(data.url); // https://res.cloudinary.com/.../news_123.jpg
```

---

## 🔄 Auto-Deploy on Git Push

Render automatically redeploys when you push to your connected branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will:
1. Detect the push
2. Start a new deployment
3. Keep the old version running until the new one is ready
4. Switch traffic to the new version (zero downtime)

---

## 📊 Monitoring

### View Logs

In Render Dashboard:
1. Click your service
2. Go to **Logs** tab
3. Watch real-time logs

### Check Metrics

Go to **Metrics** tab to see:
- CPU usage
- Memory usage
- Request count
- Response time

---

## 🐛 Troubleshooting

### Service Won't Start

**Check logs for:**
```
Error: Missing environment variable: CLOUDINARY_CLOUD_NAME
```

**Solution:** Add missing environment variables in Render dashboard

### Images Not Uploading

**Check logs for:**
```
❌ Cloudinary upload error: Invalid credentials
```

**Solution:** 
1. Verify Cloudinary credentials in Render environment variables
2. Ensure `USE_CLOUDINARY=true`
3. Restart the service

### 502 Bad Gateway

**Causes:**
- Service is still starting up (wait 30 seconds)
- Build failed (check build logs)
- Port configuration issue

**Solution:**
- Check logs for errors
- Verify `PORT` is not hardcoded (use `process.env.PORT`)

### Slow First Request

Render free tier "spins down" after 15 minutes of inactivity.

**Solutions:**
- Upgrade to paid tier for always-on
- Use a service like [UptimeRobot](https://uptimerobot.com/) to ping every 10 minutes
- Accept the 30-second cold start on free tier

---

## 💰 Render Free Tier Limits

The free tier includes:
- 750 hours/month (enough for one service 24/7)
- Auto-spin down after 15 minutes of inactivity
- Limited CPU/memory
- Perfect for testing and small projects

**Paid tiers ($7+/month) provide:**
- Always-on (no spin down)
- More CPU/memory
- Faster builds
- Custom domains

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Store all secrets in Render environment variables
- ❌ Never commit `.env` files to Git
- ✅ Rotate API keys periodically

### API Access
- Consider adding API key authentication
- Use rate limiting for production
- Monitor for unusual traffic

---

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set in Render
- [ ] Cloudinary configured and tested
- [ ] Health endpoint responding
- [ ] Image generation working
- [ ] Images appearing in Cloudinary
- [ ] Logs showing no errors
- [ ] Performance acceptable (check metrics)
- [ ] Consider upgrading to paid tier for always-on
- [ ] Set up monitoring/alerts
- [ ] Document your Render URL

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com/
- **Render Docs**: https://render.com/docs
- **Cloudinary Console**: https://console.cloudinary.com/
- **Status Page**: https://status.render.com/

---

## 🆘 Need Help?

1. Check Render logs for specific errors
2. Review [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
3. Consult [Render documentation](https://render.com/docs)
4. Open an issue on the repository

---

**Congratulations! Your service is now deployed on Render with persistent cloud storage! 🎉**
