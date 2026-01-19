# 🎨 New Image Layout Guide

## Visual Comparison

### Old Layout (v1.0.0)
```
┌─────────────────────────────────────────────────────────────┐
│                       1920 × 1080                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ╔═══════════╗                                              │
│  ║           ║         BACKGROUND IMAGE                     │
│  ║   MAIN    ║       (Darkened to 70%)                      │
│  ║  SUBJECT  ║                                              │
│  ║           ║              ╔═══════════╗                   │
│  ║  (Left)   ║              ║ SECONDARY ║                   │
│  ║           ║              ║  SUBJECT  ║                   │
│  ║           ║              ║  (Right)  ║                   │
│  ╚═══════════╝              ╚═══════════╝                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Trump and Oil Prices Shake Global Markets and Cau...│   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↑ Title truncated at 100 chars, left-aligned
```

### New Layout (v1.1.0) ✨
```
┌─────────────────────────────────────────────────────────────┐
│                       1920 × 1080                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                                                              │
│              MAIN SUBJECT PHOTO                             │
│            (Full background coverage)                        │
│            (Darkened to 60-65%)                             │
│                                                              │
│                                                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │    Trump and Oil Prices Shake Global Markets and    │   │
│  │   Cause Widespread Economic Uncertainty Across      │   │
│  │              Europe and Asia                         │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↑ Full title with word wrapping, centered
```

## Key Improvements

### 1. Title Display

#### Before ❌
- Truncated at 100 characters
- Ellipsis (...) for long titles
- Information loss
- Left-aligned

#### After ✅
- **Full title displayed**
- Word wrapping (60 chars/line)
- All information visible
- **Center-aligned**

### 2. Image Focus

#### Before ❌
- Complex multi-layer composition
- Background + overlays
- Main subject less prominent
- Cluttered appearance

#### After ✅
- **Main subject as primary focus**
- Single focused image
- Clear visual hierarchy
- **Clean, professional look**

### 3. Text Positioning

#### Before ❌
```
┌──────────────────────┐
│ Title starts here... │
└──────────────────────┘
```

#### After ✅
```
┌──────────────────────┐
│    Title centered    │
└──────────────────────┘
```

## Technical Specifications

### Text Rendering

```javascript
// Word Wrapping
Max characters per line: 60
Line height: 60px
Font size: 48px
Font: Arial Bold
Color: White (#ffffff)
Alignment: Center (text-anchor: middle)
```

### Overlay Specs

```javascript
// Dynamic Height
Minimum height: 200px
Line estimation: title.length / 60
Height calculation: lines × 60px + 80px padding
Background: Black with 75% opacity
```

### Image Composition

```javascript
// Canvas
Size: 1920 × 1080 (16:9)
Format: JPEG
Quality: 90%

// Main Subject
Coverage: Full canvas (100%)
Brightness: 60-65%
Fit: Cover (no distortion)
Position: Center
```

## Examples with Real Titles

### Example 1: Short Title
**Title:** "Biden Announces New Policy"

**Output:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                  BIDEN PHOTO (FULL)                         │
│                                                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │            Biden Announces New Policy                │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        Single line, plenty of padding
```

### Example 2: Medium Title
**Title:** "Trump and Oil Prices Shake Global Markets and Cause Widespread Economic Uncertainty"

**Output:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                  TRUMP PHOTO (FULL)                         │
│                                                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │    Trump and Oil Prices Shake Global Markets and    │   │
│  │   Cause Widespread Economic Uncertainty              │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        Two lines, word-wrapped at boundaries
```

### Example 3: Long Title
**Title:** "President Biden Delivers Historic Speech on Climate Change Initiative That Will Transform American Energy Policy and Create Millions of Green Jobs Over the Next Decade"

**Output:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                  BIDEN PHOTO (FULL)                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ President Biden Delivers Historic Speech on Climate │   │
│  │ Change Initiative That Will Transform American      │   │
│  │ Energy Policy and Create Millions of Green Jobs     │   │
│  │ Over the Next Decade                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        Four lines, overlay expanded automatically
```

## Subject Focus Strategy

### Priority: Main Subject First

1. **If person identified** → Person photo fills canvas
2. **If object identified** → Object photo fills canvas
3. **If location identified** → Location photo fills canvas
4. **Fallback** → First relevant photo fills canvas

### Why This Works

✅ **Clear focus** - One primary subject, not competing elements  
✅ **News-style** - Similar to professional news graphics  
✅ **Readable** - No visual clutter around text  
✅ **Impactful** - Strong visual presence  

## Word Wrapping Algorithm

```javascript
// Pseudo-code
maxCharsPerLine = 60
words = title.split(' ')
lines = []
currentLine = ''

for each word in words:
  if (currentLine + word).length <= maxCharsPerLine:
    currentLine += word + ' '
  else:
    lines.push(currentLine)
    currentLine = word + ' '

lines.push(currentLine)
```

**Features:**
- Respects word boundaries (no mid-word breaks)
- Maintains natural reading flow
- Automatic line distribution
- Handles titles of any length

## Dynamic Overlay Height

```javascript
// Calculation
charsPerLine = 60
estimatedLines = Math.ceil(title.length / charsPerLine)
lineHeight = 60
padding = 80
overlayHeight = Math.max(200, estimatedLines × lineHeight + padding)
```

**Examples:**
- 50 chars → 1 line → 200px (minimum)
- 100 chars → 2 lines → 200px (fits in minimum)
- 150 chars → 3 lines → 260px (expanded)
- 300 chars → 5 lines → 380px (expanded further)

## Testing Checklist

### Visual Tests
- [ ] Title is fully visible (no truncation)
- [ ] Text is centered horizontally
- [ ] Text is centered within overlay
- [ ] Word wrapping looks natural
- [ ] No mid-word breaks
- [ ] Adequate padding around text

### Subject Focus Tests
- [ ] Main subject fills entire canvas
- [ ] Subject is clearly identifiable
- [ ] Image quality is good
- [ ] Brightness allows text readability
- [ ] No unnecessary secondary images

### Readability Tests
- [ ] Text is easy to read
- [ ] Good contrast with background
- [ ] Font size is appropriate
- [ ] Line spacing is comfortable
- [ ] Overlay is not too dark/light

## How to Test

### Step 1: Clear Cache
```bash
rm public/generated/*.jpg
```

### Step 2: Generate New Image
```bash
npm start
# In another terminal:
curl "http://localhost:3000/news-image?id=393"
```

### Step 3: View Result
```bash
open public/generated/news_393.jpg
```

### Step 4: Check Against Checklist
- Is the title complete?
- Is it centered?
- Does word wrapping look good?
- Is the main subject clear?

## Customization Options

### Change Font Size
Edit `src/services/imageComposer.js`:
```javascript
const fontSize = 48; // Change this value
```

### Change Line Width
```javascript
const maxCharsPerLine = 60; // Adjust characters per line
```

### Change Overlay Opacity
```javascript
background: { r: 0, g: 0, b: 0, alpha: 0.75 } // Change alpha (0-1)
```

### Change Image Brightness
```javascript
.modulate({ brightness: 0.6 }) // Change brightness (0-1)
```

## Troubleshooting

### Title is cut off
**Cause:** Very long single word  
**Solution:** Word will wrap to next line automatically

### Text is too small
**Cause:** Font size might be too small for screen  
**Solution:** Increase `fontSize` in `createTextSvg()`

### Overlay is too tall
**Cause:** Very long title  
**Solution:** This is expected; overlay expands to fit

### Can't see main subject
**Cause:** Image might be too dark  
**Solution:** Increase `brightness` value (closer to 1.0)

## Summary

### What Changed
✅ Full titles (no truncation)  
✅ Bottom-center positioning  
✅ Main subject as primary focus  

### Why It's Better
✅ More information visible  
✅ Better visual balance  
✅ Stronger subject focus  
✅ Professional appearance  

### Impact
✅ Zero breaking changes  
✅ Same API  
✅ Better output  

---

**Version:** 1.1.0  
**Updated:** January 19, 2026  
**Status:** ✅ Live

