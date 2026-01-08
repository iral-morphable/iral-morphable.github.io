# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static GitHub Pages website for the MorphEUS (Morphable OmnidirEctional Unmanned System) research project - a novel omnidirectional quadrotor design. The site was adapted from the [Nerfies website template](https://nerfies.github.io).

## Repository Structure

- [index.html](index.html) - Main landing page containing all content
- [static/](static/) - All static assets organized by type:
  - [static/css/](static/css/) - Bulma framework, carousels, sliders, and custom styles
  - [static/js/](static/js/) - Bulma carousel/slider plugins and custom JavaScript
  - [static/videos/](static/videos/) - MP4 demonstration videos (experiments, simulations)
  - [static/images/](static/images/) - PNG/JPG images (CAD models, diagrams, photos)
  - [static/interpolation/stacked/](static/interpolation/stacked/) - 240 sequential images for slider animation
  - [static/files/](static/files/) - PDF paper

## Local Development

This is a static site with no build step. To preview locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```

Then open http://localhost:8000 in a browser.

## Key Features

### Video Carousel
The homepage includes a Bulma carousel ([static/js/index.js](static/js/index.js:32-50)) that displays multiple demonstration videos. Videos auto-play, loop, and are muted by default. Carousel configuration:
- Shows 3 slides at once
- Loops infinitely
- Manual navigation (autoplay disabled)

### Image Interpolation Slider
The [static/js/index.js](static/js/index.js:3-21) file includes functionality to preload and display 240 sequential images for smooth interpolation effects. Images are loaded from `static/interpolation/stacked/` (numbered 000000.jpg through 000239.jpg).

## Content Updates

When adding new content:

- **Videos**: Add to [static/videos/](static/videos/) and reference in [index.html](index.html) carousel section (lines 195-246). Use `autoplay controls muted loop playsinline` attributes.
- **Images**: Add to [static/images/](static/images/) and reference with relative paths (`./static/images/filename.png`).
- **Paper/Documents**: Add to [static/files/](static/files/) directory.

## Deployment

Changes pushed to the `main` branch are automatically published to GitHub Pages at the configured URL. No manual deployment step required.

## License

Website is licensed under Creative Commons Attribution-ShareAlike 4.0 International License (see [README.md](README.md:9-10)).
