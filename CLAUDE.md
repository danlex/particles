# Particles — GPU Particle Animation Gallery

## Project
A gallery of 100 GPU-computed particle animations built with Three.js r160 and GPUComputationRenderer. Each animation runs 65,536 particles entirely on the GPU. Live at https://danlex.github.io/particles/

## Current State (as of 2026-04-07)
- \*\*100 animations\*\* across 35+ categories
- **Features:** mouse interaction, audio reactivity (mic + file upload), video export, embed codes, shader source viewer, category filters, random button
- **Deployment:** GitHub Pages via `.github/workflows/deploy.yml`, auto-deploys on push
- **SEO:** per-page metatags, JSON-LD, sitemap.xml, 18 GitHub topics
- **Hourly trigger:** `trig_01HTKm7zZrE7YGm43gFQEjcY` adds 1 animation/hour automatically

## Architecture
Every animation follows the same structure:
- **GPUComputationRenderer** with 256x256 texture (65,536 particles)
- **Custom ShaderMaterial** with vertex shader HSL→RGB coloring
- **UnrealBloomPass** post-processing (half resolution)
- **OrbitControls** with auto-rotate + pivot group for slow X rotation
- Controls: Speed, Bloom, Size, Hue sliders + zoom +/- buttons
- **Mouse interaction:** particles attracted toward cursor (raycaster)
- **shared-ui.js:** toolbar with info panel, video export, mic/upload audio buttons, embed
- Additive blending, depthWrite false, pixel ratio 1

## Template
Use `cosmic-web.html` as the canonical template for new animations. It has ALL latest features:
- Zoom buttons with uScale listeners
- Pivot group with slow X rotation
- Mouse interaction (uMouse/uMouseActive uniforms)
- `<script src="shared-ui.js"></script>` before `</body>`
- Full SEO metatags (title, description, canonical, OG, Twitter)

## Quality Rules (CRITICAL)
Before adding ANY new animation to the gallery:
1. **Build it** with conservative defaults
2. **Judge 1 (Visual):** Open in browser, screenshot — particles must NOT be crowded, bloom must NOT blow out, shape must have clear negative space
3. **Judge 2 (Technical):** Check console for errors, verify FPS > 30
4. Only add to `index.html` after BOTH judges pass

### Default Values (start here, adjust down if needed)
- Point size reference: 50-60 / -mvPosition.z
- Fragment alpha: * 0.15-0.2
- Bloom: strength 0.3-0.5, threshold 0.8+
- Vertex lightness: base 0.1-0.15
- Noise perturbation: 0.01-0.02
- Camera: calibrate for 60-80% screen fill

### Lessons Learned
- Pre-iterate iterated maps during seeding (Hopalong, De Jong, Pickover)
- Newton projection works well for implicit surfaces (Gyroid, Metaballs)
- Analytical shaders (no state dependency) are most reliable
- Avoid representational shapes (faces/animals look bad with particles)
- Calibrate effective_size / (camera_distance * tan(30deg)) for screen fill
- Always bound shader values to prevent NaN/infinity

## Gallery Index
`index.html` has Canvas 2D preview thumbnails for each animation. When adding a new card:
1. Add the `<a class="card">` HTML block with preview canvas
2. Add a `drawXxx()` function in the `<script>` section
3. Call `drawXxx()` in the `drawAll()` function
4. Add to `sitemap.xml`
5. Update animation counts in `index.html` title/description and `README.md`

## Adding a New Animation (Checklist)
1. Copy `cosmic-web.html` as template
2. Replace the position shader with your math
3. Adjust camera, uScale, coloring
4. Add SEO metatags (title, description, canonical URL, OG, Twitter)
5. Add card + preview function to `index.html`
6. Add to `sitemap.xml`
7. Update counts in `index.html` and `README.md`
8. Commit and push

## Dev Server
```bash
python3 -m http.server 8765
# open http://localhost:8765
```

## Research-Learn-Improve Cycle
Each batch of new animations should follow this workflow:
1. **Research:** Check Shadertoy, demoscene, creative coding communities for novel concepts
2. **Learn:** Review past failures (scale issues, shader bugs) and apply lessons
3. **Build:** Create animations that fill genuinely new visual categories
4. **Ship:** Add to gallery, update sitemap/counts, commit, push
