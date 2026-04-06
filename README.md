# Particles

A gallery of **53 real-time GPU particle animations**. Each runs 65,536 particles fully computed on the GPU using Three.js r160 and `GPUComputationRenderer`.

Live site: https://danlex.github.io/particles/

## What's inside

Every animation packs 65,536 particles into a 256×256 GPU texture and updates all their positions in a single fragment-shader pass. Custom vertex/fragment shaders render them with additive blending and HSL→RGB coloring, with UnrealBloomPass post-processing at half resolution for glow.

### Categories

- **Strange attractors** — Lorenz, Aizawa, Thomas, Halvorsen, Rössler, Chen, Clifford, Four-Wing (Qi), Dadras, Chua, Burke-Shaw, Rabinovich-Fabrikant, Nose-Hoover, Shimizu-Morioka, Lu-Chen
- **Iterated maps** — Hopalong, De Jong, Pickover
- **Parametric surfaces** — Torus Knot, DNA Helix, 3D Lissajous, Fibonacci Sphere, Spherical Harmonics, Klein Bottle, Supershape
- **Physics** — Magnetic Field, Ocean Surface (Gerstner waves), Vortex Rings, Chladni Patterns, Tornado
- **Astrophysics** — Galaxy Spiral, Galaxy Collision, Black Hole, Supernova, Starfield Warp
- **Nature** — Aurora Borealis, Jellyfish, Fireworks
- **Fractals** — Menger Sponge, Fractal Tree
- **Sacred geometry** — Flower of Life, Mandala, Geometric Paradox
- **Flow** — Curl Noise Flow, Plasma Ball

## Run locally

No build step — it's pure HTML + ES modules.

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## Architecture

Every animation follows the same pattern:

1. **GPUComputationRenderer** with a 256×256 RGBA float texture — one pixel per particle
2. **Position shader** — updates `(x, y, z, extra)` each frame (RK2 for ODEs, analytical for parametric, iterated-map for maps)
3. **Vertex shader** — reads the texture, applies scale and HSL coloring
4. **Fragment shader** — circular point sprites with quadratic alpha falloff
5. **UnrealBloomPass** — half-res bloom for the glow
6. **OrbitControls** — auto-rotate on Y, a pivot group adds slow X rotation

Each page has four sliders (Speed / Bloom / Size / Hue) and +/− zoom buttons.

## Quality rules

See `CLAUDE.md` for the strict quality bar each animation passes before being added to the gallery.

## License

MIT
