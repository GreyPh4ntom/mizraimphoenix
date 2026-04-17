# MizraimPhoenix Landing Page - Deployment Guide

## ✅ What's Been Completed

### HTML (index.html)
- [x] SEO meta tags (title, description, keywords, robots)
- [x] Open Graph tags for social sharing
- [x] Twitter Card meta tags
- [x] Google Fonts with preconnect for performance
- [x] Semantic HTML structure (main, nav, section, footer)
- [x] ARIA labels and roles for accessibility
- [x] All product cards have images (including placeholders)
- [x] YouTube thumbnail with fallback
- [x] Dynamic copyright year
- [x] Canonical URL

### CSS (style.css)
- [x] CSS custom properties (variables)
- [x] Focus-visible styles for keyboard navigation
- [x] Skip to content link style
- [x] Mobile menu toggle animation
- [x] Loading shimmer animation
- [x] Print styles
- [x] Reduced motion support
- [x] High contrast mode support
- [x] Responsive breakpoints (1024px, 768px, 480px)
- [x] Utility classes

### JavaScript (config.js)
- [x] Dynamic Twitch parent domain (uses window.location.hostname)
- [x] Twitch embed error handling with fallback
- [x] Mobile menu toggle with aria-expanded
- [x] Keyboard navigation for tabs (arrow keys)
- [x] Keyboard navigation for carousels (arrow keys)
- [x] Keyboard navigation for indicators (Enter/Space)
- [x] Escape key closes mobile menu
- [x] Resize debounce
- [x] Smooth scroll with URL update
- [x] Lazy loading support for images
- [x] Dynamic footer year

### Images
- [x] GTA VI placeholder (SVG)
- [x] Monitor placeholder (SVG)
- [x] Stream Deck placeholder (SVG)
- [x] Mixer & Mic placeholder (SVG)

## 🚀 Deploy to GitHub Pages

### Option 1: Push to existing repo
```bash
cd "/home/greyph4ntom/Documents/website/MP landing page"
git add .
git commit -m "feat: complete landing page with accessibility & SEO"
git push origin main
```

### Option 2: Force push if needed
```bash
git add .
git commit -m "feat: complete landing page overhaul"
git push --force origin main
```

## ⚠️ Before Going Live - Checklist

### Update These Placeholders:
- [ ] **Discord invite link** - Currently: `https://discord.gg/yourserver`
- [ ] **Spotify profile link** - Currently: `https://open.spotify.com/user/yourprofile`
- [ ] **YouTube video ID** - Replace `VIDEO_ID` in index.html with your actual video ID
- [ ] **Favicon** - Verify `images/logo.svg` is working as favicon

### Optional Improvements:
- [ ] Add real product images for accessories (currently using SVG placeholders)
- [ ] Add real GTA VI image when available
- [ ] Set up YouTube Data API key for auto-fetching latest video
- [ ] Add Google Analytics or Plausible for tracking
- [ ] Add a contact email link in the footer

### Testing:
- [ ] Test on Chrome/Edge
- [ ] Test on Firefox  
- [ ] Test on Safari (macOS/iOS)
- [ ] Test on mobile devices
- [ ] Test Twitch embed on the actual domain
- [ ] Verify all social links work
- [ ] Test keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Test with screen reader (NVDA/VoiceOver)

## 🌐 GitHub Pages Setup

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Set source to **main** branch, **/(root)** folder
4. Click **Save**
5. Your site will be live at: `https://greyph4ntom.github.io/`

## 🔧 Troubleshooting

### Twitch embed not working?
- Make sure the `parent` domain matches your GitHub Pages URL
- The code now uses `window.location.hostname` automatically

### YouTube thumbnail broken?
- Replace `VIDEO_ID` in the HTML with your actual YouTube video ID
- Example: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`

### Fonts not loading?
- Check that the Google Fonts preconnect links are in the `<head>`
- Verify internet connection

## 📊 Performance Tips

- All fonts use `display=swap` for faster rendering
- Images use `loading="lazy"` where appropriate
- CSS and JS are separate files for caching
- SVG placeholders are lightweight

## 🎨 Customization

### Change brand colors:
Edit CSS variables in `style.css`:
```css
:root {
    --brand-gold: #fceba2;
    --brand-dark: #1A1A1A;
}
```

### Change Twitch channel:
Edit `config.js`:
```js
channel: "mizraimphoenix2"  // Change to your channel
```

### Add more game cards:
Copy a `.product-card` block in `index.html` and update the image/title.


i want you to create the pages from the nav link and transform the accessories carousel to shop carousel were instead of it being monitore and stream deck suff its more clothing and key chain/ phone cover brand stuff you know

so when the user clicks on one of the shop items in the carousel it redirects to the shop page where all the items are the clothes should have optoins for them like size and color so section them
tops:
shirt
hoody
sweater
etc…
bottoms:
pants
shorts
etc
accessories:
key chain
neck chain
bracellet
Phone cover
stickers
etc…

so yeah the full website is in htm css javascript, add some nice smooth animation and remember that it shold work on mobile as well

and this is how the twitch embed looks i got it from their dev page as referance because i want something to show instead it saying stream unavailable

<script src= “https://player.twitch.tv/js/embed/v1.js”></script>
<div id=“<player div ID>”></div>
<script type=“text/javascript”>
var options = {
width: <width>,
height: <height>,
channel: “<channel ID>”,
video: “<video ID>”,
collection: “<collection ID>”,
// only needed if your site is also embedded on embed.example.com and othersite.example.com
parent: [“embed.example.com”, “othersite.example.com”]
};
var player = new Twitch.Player(“<player div ID>”, options);
player.setVolume(0.5);
</script>
