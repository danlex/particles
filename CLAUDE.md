# Particles — GPU Particle Animation Gallery

## Project
A gallery of GPU-computed particle animations built with Three.js r160 and GPUComputationRenderer. Each animation runs 65,536 particles entirely on the GPU.

## Architecture
Every animation follows the same structure:
- **GPUComputationRenderer** with 256x256 texture (65,536 particles)
- **Custom ShaderMaterial** with vertex shader HSL→RGB coloring
- **UnrealBloomPass** post-processing (half resolution)
- **OrbitControls** with auto-rotate
- Controls: Speed, Bloom, Size, Hue sliders
- Additive blending, depthWrite false, pixel ratio 1

## Quality Rules (CRITICAL)
Before adding ANY new animation to the gallery:
1. **Build it** with conservative defaults
2. **Judge 1 (Visual):** Open in browser, screenshot — particles must NOT be crowded, bloom must NOT blow out, shape must have clear negative space
3. **Judge 2 (Technical):** Check console for errors, verify FPS > 30
4. Only add to `index.html` after BOTH judges pass

### Default Values (start here, adjust down if needed)
- Point size reference: 50-60 / -mvPosition.z
- Fragment alpha: * 0.15-0.2
- Bloom: strength 0.3-0.4, threshold 0.8+
- Vertex lightness: base 0.1-0.15
- Noise perturbation: 0.01-0.02

## Gallery Index
`index.html` has Canvas 2D preview thumbnails for each animation. When adding a new card:
1. Add the `<a class="card">` HTML block
2. Add a `drawXxx()` function in the `<script>` section
3. Call `drawXxx()` in the `drawAll()` function

## Dev Server
```bash
python3 -m http.server 8765
```
