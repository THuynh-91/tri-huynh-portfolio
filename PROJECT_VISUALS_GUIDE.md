# 📸 Adding Project Screenshots & Demos Guide

This guide will help you add visual content to your portfolio projects to make them stand out!

---

## 🎯 Quick Overview

Your project cards now support:
- **Screenshots/Images** - Project previews
- **GIFs** - Animated demos
- **Live Demo Links** - Working applications
- **Hover Effects** - Interactive visual feedback

---

## 📁 File Structure

```
public/
├── images/
│   ├── rps-game.png          # Rock Paper Scissor Mind Game
│   ├── spotify-app.png        # Spotify Recommendation App
│   ├── aaoc-planner.png       # AAOC Planner
│   ├── rps-demo.gif           # Optional: Animated demo
│   └── spotify-demo.gif       # Optional: Animated demo
└── resume.pdf
```

---

## 🖼️ Option 1: Screenshots (Recommended)

### Step 1: Take Screenshots
1. Open your deployed project or run it locally
2. Take high-quality screenshots (recommended: 1200x630px)
3. Use these tools:
   - **Windows**: Win + Shift + S
   - **Mac**: Cmd + Shift + 4
   - **Browser Extension**: [Awesome Screenshot](https://www.awesomescreenshot.com/)

### Step 2: Optimize Images
Use these tools to compress images:
- [TinyPNG](https://tinypng.com/) - Compress PNG/JPG
- [Squoosh](https://squoosh.app/) - Google's image compressor
- Target size: < 500KB per image

### Step 3: Add to Project
1. Save images in `public/images/` folder
2. Name them clearly: `project-name.png`
3. They're already configured in `data/projects.json`!

---

## 🎬 Option 2: Animated GIFs (Best for Demos)

### Creating GIFs

**Option A: Using LICEcap (Free)**
1. Download [LICEcap](https://www.cockos.com/licecap/)
2. Record your project demo (keep it under 10 seconds)
3. Save as `.gif`
4. Compress at [ezgif.com](https://ezgif.com/optimize)

**Option B: Using ScreenToGif (Windows)**
1. Download [ScreenToGif](https://www.screentogif.com/)
2. Record demo
3. Edit & optimize within the app
4. Export as `.gif`

**Option C: Using Kap (Mac)**
1. Download [Kap](https://getkap.co/)
2. Record screen
3. Export as `.gif`

### Best Practices for GIFs
- ✅ Keep under 5MB
- ✅ 10-15 seconds max
- ✅ Show key features only
- ✅ Use 15-20 FPS (smooth but small)
- ✅ Reduce colors to 128-256 palette

---

## 🎥 Option 3: Video Demos (Advanced)

### Recording Videos
1. Use **Loom** or **OBS Studio**
2. Record 30-60 second demo
3. Upload to YouTube (unlisted)
4. Create thumbnail screenshot

### Converting Video to GIF
```bash
# Using FFmpeg (if installed)
ffmpeg -i demo.mp4 -vf "fps=15,scale=800:-1:flags=lanczos" -c:v gif output.gif
```

Or use online tools:
- [CloudConvert](https://cloudconvert.com/mp4-to-gif)
- [ezgif.com](https://ezgif.com/video-to-gif)

---

## 🚀 Quick Start for Your Projects

### Rock Paper Scissor Mind Game
```bash
# 1. Deploy or run locally
npm run dev

# 2. Record gameplay showing:
   - Initial game state
   - AI adapting to patterns
   - Winning/losing animations

# 3. Save as: public/images/rps-game.png or rps-demo.gif
```

### Spotify Recommendation App
```bash
# 1. Run the app
npm run dev

# 2. Screenshot showing:
   - URL input interface
   - Generated recommendations
   - Explanation text

# 3. Save as: public/images/spotify-app.png
```

### AAOC Planner
```bash
# 1. Run in terminal
python main.py

# 2. Screenshot terminal showing:
   - Input prompts
   - Calculation output
   - Results summary

# 3. Save as: public/images/aaoc-planner.png
```

---

## 🎨 Using Placeholder Images (Temporary)

If you don't have screenshots yet, the cards show a 🚀 emoji placeholder with a gradient background.

To create quick placeholders:
1. Go to [Unsplash](https://unsplash.com/) or [Pexels](https://www.pexels.com/)
2. Search for tech/code/AI images
3. Download and save to `public/images/`
4. Or use generated gradients: [coolbackgrounds.io](https://coolbackgrounds.io/)

---

## 📊 Image Specifications

| Type | Dimensions | Format | Max Size | Use Case |
|------|-----------|--------|----------|----------|
| Screenshot | 1200x630px | PNG/JPG | 500KB | Static preview |
| GIF Demo | 800x450px | GIF | 3-5MB | Animated demo |
| Hero Image | 1920x1080px | JPG | 1MB | Full showcase |
| Thumbnail | 400x300px | PNG | 200KB | Grid view |

---

## 🔧 Troubleshooting

### Images Not Showing?
1. Check file path in `data/projects.json`
2. Ensure files are in `public/images/`
3. Verify file names match exactly (case-sensitive)
4. Restart dev server: `npm run dev`

### Images Too Large?
1. Compress at [TinyPNG](https://tinypng.com/)
2. Resize to recommended dimensions
3. Convert to WebP format for better compression

### GIFs Not Loading?
1. Check file size (should be < 5MB)
2. Use [ezgif optimizer](https://ezgif.com/optimize)
3. Reduce FPS to 10-15
4. Decrease dimensions if needed

---

## 💡 Pro Tips

1. **Consistency**: Use same aspect ratio for all projects
2. **Branding**: Add subtle watermark/logo if desired
3. **Dark Theme**: Screenshot in dark mode to match site
4. **Mobile**: Test how images look on mobile devices
5. **Loading**: Use lazy loading (already implemented!)

---

## 🎁 Bonus: Recording Best Practices

### For GIFs:
✅ Show one feature at a time
✅ Use mouse highlights/clicks
✅ Keep cursor movements smooth
✅ Add 1-2 second pause at start/end

### For Screenshots:
✅ Clear, focused interface
✅ Real data (not lorem ipsum)
✅ Consistent lighting
✅ Hide personal info

---

## 🔗 Useful Resources

- [Figma](https://figma.com) - Create mockups
- [Canva](https://canva.com) - Design thumbnails
- [Carbon](https://carbon.now.sh) - Beautiful code screenshots
- [Shots](https://shots.so) - Mockup generator

---

## ⚡ Next Steps

1. Take screenshots of your deployed projects
2. Save to `public/images/` with correct names
3. Optionally create GIF demos
4. Run `npm run dev` to see them live!

Your project cards will automatically display the images with beautiful hover effects! 🎉
