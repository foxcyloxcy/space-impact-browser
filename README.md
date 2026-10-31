# Space Impact: Browser Edition

An unofficial, Nokia-era-inspired horizontal space shooter built with **Nuxt 3, Vue 3 and HTML5 Canvas**. This project preserves a green monochrome pixel aesthetic while using original code and procedural pixel sprites.

## Project status (2026-10-31)

A playable first browser milestone is implemented in `app.vue`: four-direction movement, repeated primary fire, limited spread specials, enemy types and enemy projectiles, destructible bosses, eight consecutive sectors, lives, ammo pickups, scoring, pause/resume, restart, on-screen mobile controls and a browser-local best score. **This is not yet a frame-perfect recreation or a production-verified release.** Exact original enemy waves, level maps, boss art, sound, speed and scoring still require reference-by-reference comparison.

## Run locally

Requirements: Node.js supported by this project's Nuxt version and Yarn 1.x (the existing project package manager).

```bash
yarn install
yarn dev
```

Open http://localhost:3000. Build with `yarn build`; static generation is available via `yarn generate`. CI and live-browser verification have **not** been completed for this update.

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Movement | Arrow keys or WASD | Direction pad |
| Primary fire | Space, 1, 3 (hold for repeat) | Hold FIRE |
| Limited special | X, 4, 6 | SPECIAL |
| Pause / resume | P or Escape | PAUSE / RESUME |
| Begin / restart | Enter | START / PLAY AGAIN |

Controls are a practical web mapping. Original handset keys are documented in `docs/REFERENCES.md`.

## Architecture

- `app.vue`: current prototype shell and game canvas. No server or account required.
- `docs/GAME_DESIGN.md`: reference-driven design, boundaries and acceptance targets.
- `docs/ARCHITECTURE.md`: structure to use for the next refactor.
- `docs/ROADMAP.md`: current capabilities, missing fidelity, testing and launch sequence.
- `docs/REFERENCES.md`: source-of-truth list, original versus adaptation labels.
- `AGENTS.md`: project-specific instructions for contributors and coding agents.
- `.agents/skills/retro-game-development/SKILL.md`: focused, local game implementation guidance.

## Verification commands\n\n```bash\nyarn install\nyarn test\nyarn typecheck\nyarn build\nnpx playwright install chromium\nyarn test:e2e\n```\n\nThese scripts and CI checks were added on 2026-10-31; they have not yet been confirmed passing. The existing Yarn lockfile has not been regenerated, so run `yarn install` before attempting a frozen-lockfile CI build.\n\nSee `docs/LEVEL_REFERENCE_MATRIX.md` for the recording-by-recording stage comparison plan.\n\n## Next development milestone

Refactor the single-file game into a deterministic TypeScript simulation, renderer and input adapter, then create reference-verified wave data and pixel assets. Add unit and browser E2E tests (including touch), run a production build and test on real mobile screen sizes before deployment. Do not report any feature as tested until it has actually been tested.

## Attribution

Unofficial fan-inspired project. Space Impact and Nokia names belong to their respective owners. Do not copy third-party game code, images, ROM assets, music or effects without an appropriate license. See `docs/REFERENCES.md` for research links. Current art is generated programmatically.
