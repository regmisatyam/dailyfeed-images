#!/bin/bash

echo "🎨 Testing New Image Layout (v1.1.0)"
echo "====================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "⚠️  Server not running. Start it with: npm start"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Clear cache for fresh generation
echo "🗑️  Clearing cached images..."
rm -f public/generated/news_*.jpg
echo "✅ Cache cleared"
echo ""

# Generate test images
echo "📸 Generating test images with new layout..."
echo ""

echo "Test 1: Short title (article 393)"
curl -s "http://localhost:3000/news-image?id=393" | jq '.'
echo ""

echo "Test 2: Different article (394)"
curl -s "http://localhost:3000/news-image?id=394" | jq '.'
echo ""

echo "Test 3: Another article (395)"
curl -s "http://localhost:3000/news-image?id=395" | jq '.'
echo ""

echo "✅ Test complete!"
echo ""
echo "📸 View generated images:"
echo "   open public/generated/"
echo ""
echo "🔍 What to look for:"
echo "   ✅ Full titles (no truncation)"
echo "   ✅ Text centered at bottom"
echo "   ✅ Word wrapping on long titles"
echo "   ✅ Main subject fills entire image"
echo "   ✅ Good text contrast"
