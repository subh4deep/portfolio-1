# Subhadeep Bera — Portfolio V5 🚀

Ultra-premium developer portfolio with insane animations, WebGL aurora, particle constellations, 3D glass and full dark/light mode.

## ✨ Animation Inventory (New in V5)

### 🎬 Page Load
- Spinning logo badge with `spin-badge` keyframe
- Giant gradient counter (0→100) with shimmer text
- 3-dot bouncing preloader
- Animated progress bar with sweep shimmer
- Full page fade-out on completion

### 🌌 Persistent FX
- **WebGL Aurora** — GLSL fBm shader, 7-octave noise, mouse-reactive, full dark/light dual shader
- **Particle Constellation** — 90 particles, 4 colors, glow in dark mode, flee-on-hover, auto-reconnect lines
- **Light Streaks** — 6 diagonal glowing lines sweeping across screen (dark mode only)
- **Morphing Blobs** — `border-radius` shape-shifting ambient blobs in each section
- **4 Floating Orbs** — blurred gradient spheres drifting with unique paths

### 🔤 Hero Section
- **Scramble Name** — Characters cycle through Unicode symbols → staggered reveal with elastic bounce
- **Typewriter Roles** — "MERN Stack Developer", "Full Stack Engineer", "DSA Enthusiast"... (no Java Developer!)
- **Animated grid overlay** — pulsing grid with radial fade
- **3 concentric rotating rings** — alternating directions
- **Status badge** — float + pulse dot animation
- **Social pills** — hover: lift 8px + scale + violet glow

### 📊 Sections
- **ScrollReveal (Fade)** — Every element fades in from below/left/right with spring easing
- **3D TiltCard** — Per-card mouse-tracking tilt, glass shine follow, elastic spring-back
- **CountUp numbers** — Intersection-triggered counter animation for DSA stats
- **Skill bars** — Animated width + glowing dot at tip + dual-layer track
- **Heatmap cells** — Scale(1.8) + glow on hover with spring transition
- **Marquee** — Smooth infinite scrolling tech ticker
- **Project accent line** — Animated gradient border-run at top of each card
- **Timeline line** — Gradient from violet → teal going down
- **Topic pills** — translateY(-6px) + box-shadow on hover
- **Tech chips** — Scale + lift hover across Skills section

### 🔘 Buttons
- **5 variants**: primary (violet), ghost, teal, coral, amber
- **Full 3D tilt** with `perspective(380px)` tracking
- **Specular highlight** follows mouse position
- **Per-variant glow** on hover
- **Elastic spring-back** on mouse leave

### 🎨 Dark / Light Mode
- CSS variable swap for bg, text, card, borders, bars, cells
- Aurora shader smoothly transitions between deep-space and lavender
- Particle opacity adapts per mode
- Light streaks disabled in light mode
- Theme toggle: emoji-moon/sun slides with elastic spring

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 📦 Deploy

```bash
npm run build
npx vercel --prod
```

## ✅ TODO (user action)
- Drop `Subhadeep_Bera_Resume.pdf` in `/public/` and wire Resume button href
- Replace contact form `setTimeout` with EmailJS or Formspree endpoint
- Update live demo URLs after deployment
