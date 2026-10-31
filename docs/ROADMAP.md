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

## Added during stabilization\n- [x] Added `game/core/rules.mjs` with collision, movement, damage, cooldown, stage, seed and tick helpers.\n- [x] Added `tests/unit/rules.test.mjs` and Playwright browser smoke tests.\n- [x] Added GitHub Actions CI workflow for install, unit test, typecheck, build, Chromium E2E.\n- [x] Added `docs/LEVEL_REFERENCE_MATRIX.md` with all eight stage chapter markers and observation gaps.\n\n## Not yet verified
- [ ] Production install/build and lint/typecheck in CI.
- [ ] Actual desktop and mobile browser gameplay.
- [ ] Touch multitouch, Android/iOS pointer capture and device landscape behavior.
- [ ] Collision edge cases, pacing and accessibility.
- [ ] Deployment URL or live production status.

## Priority 1: stabilize playable prototype
- [x] Add scripts for typecheck, unit and browser E2E tests (execution pending).
- [ ] Fix defects found via playtesting, particularly multitouch, overlapping projectile hits and stage transition edge cases.
- [~] Extracted pure rules and added a fixed-step loop; full simulation/render/input separation remains.
- [~] Added nine Node unit tests for base rules, plus Playwright desktop/mobile smoke tests; execution pending.

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

## Fidelity update (2026-10-31)
- [x] Restored 84×48 Nokia-era display geometry, LCD-scale sprite rendering, compact HUD and repeating stage wave sequences.
- [ ] Regenerate/verify passing unit and browser E2E checks after coordinate changes.
- [ ] Obtain permission-cleared, frame-audited sprites and exact eight-level timing/wave data.
- [ ] Implement original bomb, rocket and laser special weapons, original sound and proper level obstacle hitboxes.
- [ ] Confirm GitHub Pages deployment of the fidelity update before calling it live.

## 2026-10-31 fidelity evidence milestone
- [x] Found independent firmware-researched Nokia 3310 Space Impact verification work and documented its AGPL/firmware asset restrictions in docs/VERIFICATION_STANDARD.md.
- [x] Corrected shared game coordinate system and unit-test expectations to 84×48.
- [ ] Obtain lawful reference footage/firmware-derived observations for each stage, then independently implement and compare frames.
- [ ] Match all eight bosses and original terrain geometry, collisions, powerups, score rules and audio.
- [ ] Run screenshot diffs and input trace replay before any 'exact recreation' claim.
