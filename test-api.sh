#!/bin/bash

# Test script for DailyFeed Images API

echo "🧪 Testing DailyFeed Images API"
echo "================================"
echo ""

# Check if server is running
echo "1️⃣  Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Server not responding. Is it running?"
    echo "   Start with: npm start"
    exit 1
fi

echo ""
echo "2️⃣  Testing news image generation (article ID: 393)..."
IMAGE_RESPONSE=$(curl -s "http://localhost:3000/news-image?id=393")
echo "   Response: $IMAGE_RESPONSE"

# Extract URL from response
IMAGE_URL=$(echo $IMAGE_RESPONSE | grep -o '"url":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$IMAGE_URL" ]; then
    echo "✅ Image generated successfully"
    echo "   URL: $IMAGE_URL"
    
    # Check if file exists locally
    if [ -f "public/generated/news_393.jpg" ]; then
        echo "✅ Image file exists locally"
        FILE_SIZE=$(du -h public/generated/news_393.jpg | cut -f1)
        echo "   File size: $FILE_SIZE"
    else
        echo "⚠️  Image file not found locally"
    fi
else
    echo "❌ Image generation failed"
    echo "   Check server logs for errors"
fi

echo ""
echo "3️⃣  Testing cache (requesting same article again)..."
START_TIME=$(date +%s%N)
CACHE_RESPONSE=$(curl -s "http://localhost:3000/news-image?id=393")
END_TIME=$(date +%s%N)
DURATION=$((($END_TIME - $START_TIME) / 1000000))
echo "   Response time: ${DURATION}ms"
echo "   Response: $CACHE_RESPONSE"

if [ $DURATION -lt 100 ]; then
    echo "✅ Cache working (fast response)"
else
    echo "⚠️  Response slower than expected (may not be cached)"
fi

echo ""
echo "4️⃣  Testing error handling (invalid ID)..."
ERROR_RESPONSE=$(curl -s "http://localhost:3000/news-image?id=invalid")
echo "   Response: $ERROR_RESPONSE"

if echo "$ERROR_RESPONSE" | grep -q "error"; then
    echo "✅ Error handling works correctly"
else
    echo "⚠️  Expected error response"
fi

echo ""
echo "5️⃣  Testing missing parameter..."
MISSING_RESPONSE=$(curl -s "http://localhost:3000/news-image")
echo "   Response: $MISSING_RESPONSE"

if echo "$MISSING_RESPONSE" | grep -q "Missing required parameter"; then
    echo "✅ Parameter validation works correctly"
else
    echo "⚠️  Expected validation error"
fi

echo ""
echo "================================"
echo "✅ All tests completed!"
echo ""
echo "📸 View generated images:"
echo "   Browser: http://localhost:3000/generated/news_393.jpg"
echo "   File: open public/generated/news_393.jpg"

