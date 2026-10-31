# Architecture

## Current (first playable milestone)
`app.vue` owns Nuxt/Vue UI, browser input, one requestAnimationFrame loop, world state, Canvas painting and browser-local best score. No server endpoint, auth or database is required.

## Proposed modular extraction
```text
app.vue                       # application shell, menu, game mount
components/GameCanvas.client.vue
components/TouchControls.vue
game/
  core/types.ts
  core/simulation.ts          # fixed tick, pure state transitions
  core/collision.ts
  core/random.ts              # seedable deterministic PRNG
  input/keyboard.ts
  input/touch.ts
  render/canvas.ts            # pixel-scaled renderer
  render/sprites.ts
  content/levels.ts           # stage definitions and waves
  content/enemies.ts
  content/weapons.ts
  persistence/high-score.ts
tests/
  unit/
  e2e/
```
This tree is **planned**; these modules are not yet present.

## Constraints
- Keep world resolution independent of CSS or screen size. Nearest-neighbor scaling only.
- Browser-only Canvas must initialize on mount, never during SSR.
- Use one lifecycle-owned animation frame, teardown event listeners and pointer capture responsibly.
- For frame-rate independence use a capped accumulator with a fixed simulation step (e.g. 1/60s). Current update uses clamped delta, not a deterministic fixed tick.
- Implement collision iteration without mutating active arrays during nested traversal; defer removal and score event emission.
- Treat browser storage access as optional/fallible.
- Avoid introducing a game engine until performance/profile/fidelity warrants it. Phaser is an option, not a required dependency.
- Do not store secrets in client code; no API or data service is required by the current scope.
