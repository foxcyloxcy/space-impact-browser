# Project Roadmap

Updated: 2026-10-31

## Completed in repository
- [x] Retained Nuxt 3 / Vue 3 / Canvas stack and existing Yarn tooling.
- [x] Added a browser game playable from the application root.
- [x] Added directional keyboard and touch controls, fire and special buttons.
- [x] Added 8-sector progression, procedural enemies and boss encounters.
- [x] Added lives, damage invulnerability, scoring, pickups and local best score.
- [x] Added start, pause/resume, game over and win states.
- [x] Added maintainer README, architecture/game-design/reference docs, scoped skill and AGENTS.md.

## Not yet verified
- [ ] Production install/build and lint/typecheck in CI.
- [ ] Actual desktop and mobile browser gameplay.
- [ ] Touch multitouch, Android/iOS pointer capture and device landscape behavior.
- [ ] Collision edge cases, pacing and accessibility.
- [ ] Deployment URL or live production status.

## Priority 1: stabilize playable prototype
- [ ] Add scripts for typecheck, unit and browser E2E tests.
- [ ] Fix defects found via playtesting, particularly multitouch, overlapping projectile hits and stage transition edge cases.
- [ ] Refactor game simulation out of app.vue with deterministic fixed timestep.
- [ ] Add test coverage for controls, collisions, weapons, death and level progression.

## Priority 2: historical gameplay fidelity
- [ ] Gather timestamped gameplay observations for all eight levels.
- [ ] Implement verified original enemy types, patterns, stage geometry and powerups.
- [ ] Implement three historically reported special weapon behaviors.
- [ ] Recreate UI layouts, menus, boss silhouettes and original speed using custom assets.
- [ ] Add sound effects with proper origin/license records and audio toggle.

## Priority 3: release preparation
- [ ] Automated build, test and browser E2E in GitHub Actions.
- [ ] Test narrow phones, touch devices, keyboard repeat, pause on focus loss.
- [ ] Optimize pixel art and screen scaling; add game options.
- [ ] Deploy to chosen hosting, verify live URL and document it.

## Non-goals for this phase
Accounts, cloud leaderboards, multiplayer, monetization, paid APIs or migrating away from Nuxt.
