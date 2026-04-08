# Particles

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-danlex.github.io%2Fparticles-blue?style=flat-square)](https://danlex.github.io/particles/)
[![Animations](https://img.shields.io/badge/Animations-114-brightgreen?style=flat-square)](https://danlex.github.io/particles/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-orange?style=flat-square)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

A gallery of **114 real-time, interactive GPU particle animations**. Each runs **65,536 particles** entirely on the GPU using [Three.js](https://threejs.org/) r160 and `GPUComputationRenderer`.

**[View Live Gallery](https://danlex.github.io/particles/)**

---

## Features

- **114 unique animations** across 13 categories
- **65,536 particles** per animation (256x256 GPU compute texture)
- **Mouse interaction** — particles react to your cursor in every animation
- **Real-time controls** — Speed, Bloom, Size, Hue sliders + zoom buttons
- **Category filtering** — filter by Attractors, Fractals, Physics, Nature, etc.
- **Random button** — discover animations serendipitously
- **Zero build step** — pure HTML + ES module imports, no bundler needed
- **Auto-deploy** — pushes to `main` deploy to GitHub Pages via Actions

## Categories

### Strange Attractors (15)
Lorenz, Aizawa, Thomas, Halvorsen, Rossler, Chen, Clifford, Four-Wing (Qi), Dadras, Chua, Burke-Shaw, Rabinovich-Fabrikant, Nose-Hoover, Shimizu-Morioka, Lu-Chen, Sprott

### Iterated Maps (3)
Hopalong (Barry Martin), De Jong, Pickover

### Parametric Surfaces (7)
Torus Knot, DNA Helix, 3D Lissajous, Fibonacci Sphere, Spherical Harmonics, Supershape (Gielis), Hopf Fibration

### Topology (2)
Klein Bottle, Mobius Flow

### Minimal Surfaces (1)
Gyroid (Schoen triply-periodic minimal surface)

### Implicit Surfaces (1)
Metaballs (morphing isosurface)

### Physics (6)
Magnetic Field, Ocean Surface (Gerstner waves), Vortex Rings, Chladni Patterns, Wave Interference, EM Wave

### Astrophysics (4)
Galaxy Spiral, Galaxy Collision, Black Hole (accretion disk), Supernova

### Chaos Theory (1)
Double Pendulum (sensitive dependence)

### Gravity (1)
N-Body (4-attractor orbital dynamics)

### Nature (4)
Aurora Borealis, Jellyfish, Fireflies, Tornado

### Effects (4)
Fireworks, Plasma Ball, Curl Noise Flow, Starfield Warp

### Fractals (4)
Menger Sponge, Fractal Tree, Lichtenberg (dielectric breakdown), Apollonian Gasket

### 4D Fractals (1)
Quaternion Julia Set

### Sacred Geometry (3)
Flower of Life, Mandala, Geometric Paradox (morphing impossible shapes)

### Biology (2)
Turing Patterns (reaction-diffusion), Phyllotaxis (golden-angle botanical spiral), BZ Spirals (Belousov-Zhabotinsky)

## Run Locally

No build step, no dependencies, no npm. Just a static file server:

```bash
git clone https://github.com/danlex/particles.git
cd particles
python3 -m http.server 8765
# open http://localhost:8765
```

## How It Works

Every animation follows the same GPU-compute architecture:

```
┌─────────────────────────────────────────────────┐
│  GPUComputationRenderer (256x256 RGBA float)    │
│  ┌───────────────────────────────────────────┐  │
│  │  Position Shader (fragment)               │  │
│  │  - Reads previous (x, y, z, w) per pixel  │  │
│  │  - Computes new position via:             │  │
│  │    - RK2 integration (ODEs/attractors)    │  │
│  │    - Iterated map (De Jong, Pickover)     │  │
│  │    - Analytical formula (parametric)      │  │
│  │  - Writes (x, y, z, speed/field/etc)     │  │
│  └───────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │ texture
┌─────────────────▼───────────────────────────────┐
│  Render Pipeline                                │
│  ┌─────────────┐  ┌──────────────┐  ┌────────┐ │
│  │Vertex Shader │→ │Fragment Shade│→ │ Bloom  │ │
│  │- Read texture│  │- Circle point│  │(Unreal)│ │
│  │- HSL→RGB     │  │- Alpha fade  │  │        │ │
│  │- Point size  │  │- Additive    │  │        │ │
│  └─────────────┘  └──────────────┘  └────────┘ │
└─────────────────────────────────────────────────┘
```

### Controls on Every Animation
| Control | What it does |
|---------|-------------|
| **Speed** slider | Simulation time scale (0.1x to 5x) |
| **Bloom** slider | Glow intensity (0 to 3) |
| **Size** slider | Particle point size (0.5x to 4x) |
| **Hue** slider | Shift the entire color palette |
| **+/−** buttons | Zoom in/out (scales the whole animation) |
| **Mouse** | Particles are attracted toward cursor |
| **Drag** | Orbit camera around the scene |
| **Scroll** | Zoom camera in/out |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| 3D Engine | [Three.js](https://threejs.org/) r160 |
| GPU Compute | [GPUComputationRenderer](https://threejs.org/examples/?q=gpgpu#webgl_gpgpu_birds) |
| Post-processing | UnrealBloomPass (half resolution) |
| Camera | OrbitControls (auto-rotate) |
| Hosting | GitHub Pages (static) |
| CI/CD | GitHub Actions |
| SEO | Open Graph, Twitter Cards, JSON-LD, sitemap.xml |

## Contributing

Want to add an animation? Every animation is a single self-contained HTML file. Use `lorenz-attractor.html` as your template:

1. Copy an existing animation HTML file
2. Replace the position shader with your math
3. Adjust camera, scale, and coloring
4. Add a card + preview function to `index.html`
5. Follow the quality rules in `CLAUDE.md`
6. Submit a PR

## License

MIT
