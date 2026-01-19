# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-19

### Changed - Image Composition Improvements

#### 🎨 Full Title Display
- **Removed title truncation** - Now displays complete article titles without cutting them off
- **Word wrapping** - Long titles automatically wrap to multiple lines (60 characters per line)
- **Dynamic overlay height** - Text overlay expands based on title length to accommodate longer titles

#### 📍 Bottom-Center Positioning
- **Centered text alignment** - Title now displays at bottom-center instead of left-aligned
- **Better visual balance** - Uses SVG `text-anchor: middle` for perfect centering
- **Responsive padding** - Automatically adjusts spacing based on number of text lines

#### 🎯 Enhanced Subject Focus
- **Main subject priority** - Images now feature the main subject (person/object) as the primary focus
- **Simplified composition** - Uses main subject photo as full background for better clarity
- **Darker overlay** - Improved text readability with 75% opacity black background (up from 70%)
- **Better brightness** - Adjusted image brightness to 60-65% for optimal text contrast

### Technical Details

#### Modified Files
- `src/services/imageComposer.js`

#### Key Changes

1. **Title Rendering (`createTextSvg` function)**
   - Removed 100-character limit
   - Added word wrapping algorithm
   - Changed positioning from left-aligned to center-aligned
   - Dynamic SVG height based on content

2. **Image Composition Strategy**
   - `createFullComposition`: Now uses main subject as background
   - `createTwoLayerComposition`: Simplified to focus on main subject
   - `createSingleImageComposition`: Improved brightness balance

3. **Text Overlay (`addTitleOverlay` function)**
   - Dynamic overlay height calculation
   - Minimum height: 200px
   - Scales up for longer titles (60px per estimated line + 80px padding)
   - Increased opacity: 0.75 (was 0.70)

### Example Output

**Before:**
```
Title: "Trump and Oil Prices Shake Global Markets and Cause..."
Layout: Multi-layer composition with title on left
```

**After:**
```
Title: "Trump and Oil Prices Shake Global Markets and Cause 
       Widespread Economic Uncertainty Across Europe"
Layout: Main subject photo as full background with centered title
```

### Benefits

✅ **Complete information** - No more truncated titles  
✅ **Better readability** - Centered text is easier to scan  
✅ **Stronger focus** - Main subject is now the star of the image  
✅ **Professional look** - Clean, news-style composition  
✅ **Automatic adaptation** - Handles titles of any length

### Backward Compatibility

✅ **Fully compatible** - No breaking changes to API  
✅ **Same endpoints** - All existing integrations continue to work  
✅ **Cache preserved** - Existing cached images remain accessible  
✅ **Performance** - No impact on generation speed

---

## [1.0.0] - 2026-01-19

### Added - Initial Release

#### Features
- REST API endpoint for news image generation
- Real photo integration with Unsplash
- NLP-based keyword extraction
- Professional image composition (1920×1080)
- Smart caching system
- Comprehensive documentation
- Production-ready error handling

#### Deliverables
- 8 JavaScript source files (794 lines)
- 11 documentation files (4,000+ lines)
- Automated test script
- Deployment guides for multiple platforms

#### Tech Stack
- Node.js + Express.js
- Sharp (image processing)
- Compromise.js (NLP)
- Axios (HTTP client)
- NodeCache (caching)

---

## Version History

- **v1.1.0** - Enhanced title display and subject focus
- **v1.0.0** - Initial production release

