# ⚡ Quick Start: Deploy to Render in 5 Minutes

Follow these steps to deploy your image service to Render with persistent storage.

---

## ✅ Prerequisites (Do These First)

### 1. Create Cloudinary Account (2 minutes)
1. Go to https://cloudinary.com
2. Click "Sign Up" (free, no credit card)
3. Verify your email
4. Write down from dashboard:
   - Cloud Name: `______________`
   - API Key: `______________`
   - API Secret: `______________`

### 2. Get Unsplash Key (if you don't have it)
1. Go to https://unsplash.com/developers
2. Create an app
3. Copy your Access Key

---

## 🚀 Deploy to Render (3 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Cloudinary support"
git push origin main
```

### Step 2: Create Render Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Click **"Connect"**

### Step 3: Configure
Fill in these fields:

**Basic Settings:**
- Name: `dailyfeed-images`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables** (click "Advanced"):

| Key | Value |
|-----|-------|
| `USE_CLOUDINARY` | `true` |
| `CLOUDINARY_CLOUD_NAME` | Paste from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Paste from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Paste from Cloudinary dashboard |
| `UNSPLASH_ACCESS_KEY` | Your Unsplash key |
| `DAILYFEED_API_URL` | `https://dailyfeed.teletechnepal.com/api/articles` |

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. Watch the logs for "Server is running on port 3000"

---

## ✅ Test It

Your service URL will be: `https://your-service-name.onrender.com`

### Test 1: Health Check
```bash
curl https://your-service-name.onrender.com/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Test 2: Generate Image
```bash
curl "https://your-service-name.onrender.com/api/news-image?id=123"
```

Should return:
```json
{
  "id": 123,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/dailyfeed/news_123.jpg"
}
```

### Test 3: View Image
1. Copy the URL from the response
2. Paste it in your browser
3. You should see the generated image ✅

### Test 4: Check Cloudinary
1. Go to https://console.cloudinary.com/console/media_library
2. Look for `dailyfeed` folder
3. Your generated image should be there ✅

---

## 🎉 Success!

If all tests pass, you're done! Your images are now:
- ✅ Persisting across deployments
- ✅ Served via global CDN
- ✅ Automatically optimized
- ✅ Stored in the cloud

---

## 🐛 Troubleshooting

### Render Won't Start
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure `USE_CLOUDINARY` is exactly `true` (lowercase)

### "Invalid cloud_name" Error
- Double-check Cloudinary credentials
- Copy-paste directly from Cloudinary dashboard
- No spaces before/after values

### Images Not Appearing in Cloudinary
- Check Render logs for upload errors
- Verify Cloudinary API secret is correct
- Check Cloudinary quota (free tier limits)

### Render URL Returns 502
- Wait 30 seconds (service may be starting)
- Check build logs for errors
- Verify Node.js version compatibility

---

## 📚 Need More Details?

- **Complete Setup**: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
- **Detailed Render Guide**: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- **Architecture Overview**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

---

## 💡 Pro Tips

1. **Bookmark your Render URL** for easy access
2. **Save your Cloudinary credentials** securely
3. **Monitor your Cloudinary usage** at https://console.cloudinary.com
4. **Check Render logs** if something goes wrong
5. **Free tier spins down** after 15 min inactivity (30s cold start)

---

**That's it! You're deployed! 🚀**
