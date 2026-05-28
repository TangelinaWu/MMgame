# Merge Kitchen

A mobile-first cooking merge game built for the browser. Tap spawners to drop ingredients onto an 8×8 grid, drag matching items together to merge them up through 4 levels, and fulfill orders before moving to the next level.

## What it is

- 10 levels of increasing difficulty (Tutorial → Master)
- 4 ingredient chains: Veggie, Protein, Grain, Sauce — each with 4 merge tiers
- Orders panel with recipe viewer and one-tap delivery
- Drag-and-drop or tap-to-select interaction, optimized for touch screens
- Particle effects, animations, and a coin scoring system

## Stack

- **Vanilla HTML/CSS/JS** — single file (`public/index.html`), no framework, no build step
- **TypeScript** entry point (`src/main.ts`) for future modularization
- Designed for mobile (max-width 430px, `100dvh`, touch events via Pointer API)

## How to run

Just open `public/index.html` directly in a browser — no server or install needed:

```bash
open public/index.html
```

Or serve it locally if you prefer:

```bash
npx serve public
```

Then open `http://localhost:3000` on your phone or in a mobile-sized browser window.
