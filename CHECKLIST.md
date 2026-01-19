# Pre-Launch Checklist

Use this checklist before deploying or running the service.

## ✅ Setup Checklist

### 1. Dependencies
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Run `npm install` successfully
- [ ] All 143 packages installed without errors

### 2. Configuration
- [ ] `.env` file exists
- [ ] `UNSPLASH_ACCESS_KEY` added to `.env`
- [ ] `PORT` configured (default: 3000)
- [ ] `PUBLIC_BASE_URL` set correctly

### 3. API Keys
- [ ] Unsplash account created
- [ ] Unsplash API application registered
- [ ] Access Key copied from Unsplash dashboard
- [ ] Access Key added to `.env` file

### 4. Directory Structure
- [ ] `public/generated/` directory exists
- [ ] Directory has write permissions
- [ ] `.gitignore` configured correctly

### 5. External APIs
- [ ] Can access https://dailyfeed.teletechnepal.com/api/articles
- [ ] Can access https://api.unsplash.com
- [ ] Internet connection stable
- [ ] No firewall blocking requests

## ✅ Testing Checklist

### 1. Server Startup
- [ ] Run `npm start`
- [ ] Server starts without errors
- [ ] See "🚀 DailyFeed Images Service running" message
- [ ] Port 3000 (or configured port) is accessible

### 2. Health Check
- [ ] `curl http://localhost:3000/health` returns 200
- [ ] Response includes `{"status":"ok"}`
- [ ] Timestamp is current

### 3. Image Generation
- [ ] `curl "http://localhost:3000/news-image?id=393"` works
- [ ] Response includes `id` and `url` fields
- [ ] Image file created in `public/generated/`
- [ ] Image is viewable in browser

### 4. Caching
- [ ] Second request to same article is faster
- [ ] Response time < 100ms for cached images
- [ ] Same image file is reused

### 5. Error Handling
- [ ] Missing `id` parameter returns 400 error
- [ ] Invalid `id` format returns 400 error
- [ ] Non-existent article returns 404 error
- [ ] Error messages are descriptive

## ✅ Code Quality Checklist

### 1. Linting
- [ ] No ESLint errors
- [ ] No TypeScript errors (if using TS)
- [ ] Code follows style guide

### 2. Documentation
- [ ] README.md is complete
- [ ] All code has comments
- [ ] API endpoints documented
- [ ] Examples provided

### 3. Error Handling
- [ ] Try-catch blocks in async functions
- [ ] Descriptive error messages
- [ ] Proper HTTP status codes
- [ ] Errors logged to console

### 4. Security
- [ ] API keys in environment variables
- [ ] No hardcoded secrets
- [ ] Input validation on all endpoints
- [ ] No sensitive data in logs

## ✅ Deployment Checklist

### Replit
- [ ] Repository imported to Replit
- [ ] Secrets configured:
  - [ ] `UNSPLASH_ACCESS_KEY`
  - [ ] `PUBLIC_BASE_URL`
- [ ] Run command set to `npm start`
- [ ] App starts successfully
- [ ] Public URL accessible

### Heroku
- [ ] Heroku app created
- [ ] Config vars set:
  - [ ] `UNSPLASH_ACCESS_KEY`
  - [ ] `PUBLIC_BASE_URL`
- [ ] Git remote added
- [ ] Code pushed to Heroku
- [ ] App deployed successfully
- [ ] Logs show no errors

### Docker
- [ ] Dockerfile created
- [ ] Image builds successfully
- [ ] Container runs without errors
- [ ] Environment variables passed correctly
- [ ] Ports exposed properly

### General Deployment
- [ ] Environment variables configured
- [ ] Public URL updated in config
- [ ] HTTPS enabled (if applicable)
- [ ] Health check endpoint accessible
- [ ] Test image generation works

## ✅ Performance Checklist

### 1. Response Times
- [ ] Cached requests < 100ms
- [ ] First request < 5 seconds
- [ ] Health check < 50ms

### 2. Resource Usage
- [ ] Memory usage < 200MB
- [ ] CPU usage reasonable
- [ ] Disk space monitored

### 3. Caching
- [ ] Article cache working (5 min TTL)
- [ ] Image cache working (permanent)
- [ ] Cache hit rate acceptable

## ✅ Legal & Compliance Checklist

### 1. Image Rights
- [ ] Only using Unsplash photos
- [ ] Unsplash API Terms of Service reviewed
- [ ] Commercial use allowed
- [ ] No copyright violations

### 2. Content Safety
- [ ] No AI-generated faces
- [ ] No deepfakes
- [ ] Content filter enabled (high)
- [ ] Editorial-safe images only

### 3. Privacy
- [ ] No user data collected
- [ ] No tracking or analytics
- [ ] GDPR compliant (if applicable)

## ✅ Monitoring Checklist

### 1. Logging
- [ ] All operations logged
- [ ] Errors logged with stack traces
- [ ] Log levels appropriate
- [ ] Logs accessible for debugging

### 2. Metrics
- [ ] Request count tracked
- [ ] Response times measured
- [ ] Error rate monitored
- [ ] Cache hit rate tracked

### 3. Alerts
- [ ] Server down alerts (optional)
- [ ] Error rate alerts (optional)
- [ ] Disk space alerts (optional)

## ✅ Documentation Checklist

### 1. User Documentation
- [ ] README.md complete
- [ ] QUICKSTART.md clear
- [ ] SETUP.md detailed
- [ ] EXAMPLES.md helpful

### 2. Developer Documentation
- [ ] ARCHITECTURE.md comprehensive
- [ ] Code comments adequate
- [ ] API documented
- [ ] Setup instructions clear

### 3. Maintenance Documentation
- [ ] Troubleshooting guide included
- [ ] Common issues documented
- [ ] Deployment guide provided

## ✅ Final Pre-Launch Checks

### Critical
- [ ] Unsplash API key is valid
- [ ] Server starts without errors
- [ ] Test image generation works
- [ ] Public URL is accessible
- [ ] No security vulnerabilities

### Important
- [ ] Documentation is complete
- [ ] Error handling is robust
- [ ] Caching is working
- [ ] Performance is acceptable

### Nice to Have
- [ ] Monitoring set up
- [ ] Backup strategy planned
- [ ] Scaling strategy considered

## 🚀 Ready to Launch?

If all critical and important items are checked, you're ready to launch! 🎉

### Launch Command
```bash
npm start
```

### First Test
```bash
curl "http://localhost:3000/news-image?id=393"
```

### Monitor Logs
Watch the console for any errors or warnings.

## 📝 Post-Launch Tasks

- [ ] Monitor error rates
- [ ] Check response times
- [ ] Verify cache hit rates
- [ ] Review disk usage
- [ ] Collect user feedback

## 🆘 If Something Goes Wrong

1. Check server logs
2. Verify environment variables
3. Test external API connectivity
4. Review troubleshooting guide in README.md
5. Check Unsplash API rate limits

## 📞 Support Resources

- README.md - Main documentation
- SETUP.md - Setup troubleshooting
- ARCHITECTURE.md - System design
- EXAMPLES.md - Usage examples

---

**Good luck with your launch! 🚀**

