# Merge Kitchen

A mobile-first cooking merge game built for the browser. Tap spawners to drop ingredients onto an 8×8 grid, drag matching items together to merge them up through 4 levels, and fulfill orders before moving to the next level.

## What it is

- 10 levels of increasing difficulty (Tutorial → Master)
- 4 ingredient chains: Veggie, Protein, Grain, Sauce — each with 4 merge tiers
- Orders panel with recipe viewer and one-tap delivery
- Drag-and-drop or tap-to-select interaction, optimized for touch screens
- Particle effects, animations, and a coin scoring system

## Stack

- **TypeScript** — all game logic in `src/` modules, no framework
- **Vite** — dev server and bundler
- **HTML/CSS** — single `index.html` shell with inline styles
- Designed for mobile (max-width 430px, `100dvh`, touch events via Pointer API)

## Project structure

```
src/
  data.ts              — chains, order pools, level config, helper functions
  state.ts             — types and mutable game state singleton
  game/
    grid.ts            — pure merge/move/spawn logic
    orders.ts          — order generation and fulfillment checks
  ui/
    fx.ts              — toast, particles, coin bump, cell animations
    render.ts          — renderHeader, renderGrid, renderOrders, renderAll
    overlays.ts        — welcome, recipe, level-complete screens
    spawners.ts        — spawner button construction
  main.ts              — event wiring, deliver flow, drag/tap handlers, init
```

## How to run

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in a mobile-sized browser window (or on your phone).

```bash
npm run build    # production bundle → dist/
npm run preview  # preview the production build locally
```
