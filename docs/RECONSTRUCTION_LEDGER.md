# Eight-level reconstruction ledger

Updated 2026-11-01. The project is not yet a firmware-exact Space Impact port.

## Sources and use restrictions

- Original 3310 reimplementation: https://github.com/lukesau/nokia-gb-games
- Firmware reverse-engineering fork: https://github.com/lukesau/nokia-dct3-re (branch `games/re-3310`)
- Previously recorded complete playthrough: https://www.youtube.com/watch?v=sb20XEqdR1g
- The reimplementation documents frame-by-frame comparison with MAME but requires firmware supplied by the user; it does not bundle sprites, sounds or levels. Its AGPL-3.0 code must not be copied into this independently authored browser game.
- A video chapter is not proof of an individual enemy trajectory, boss graphic, frame number, or score rule.

## Completion gate

For each stage, require all five gates: **(1)** reference trace and timestamps, **(2)** terrain and hazards, **(3)** enemy spawn/path sequence, **(4)** unique boss sprite, movement, attacks and death transition, **(5)** sound plus pixel/event comparisons. `verified` is reserved for reviewed evidence with source links. Use `game/reference/verification.mjs` for observation validation and event-diff fixtures.

| Stage | Known video chapter | Terrain | Enemy trajectories | Distinct boss | Audio | Parity |
|---|---|---|---|---|---|---|
| 1 | 00:00 | Pending | Pending | Pending | Pending | No |
| 2 | 01:36 | Pending | Pending | Pending | Pending | No |
| 3 | 02:29 | Pending | Pending | Screenshot reference only | Pending | No |
| 4 | 03:33 | Pending | Pending | Pending | Pending | No |
| 5 | 04:57 | Pending | Pending | Pending | Pending | No |
| 6 | 06:43 | Pending | Pending | Pending | Pending | No |
| 7 | 08:03 | Pending | Pending | Pending | Pending | No |
| 8 | 09:29 | Pending | Pending | Pending | Pending | No |

## Level 1 evidence work package

1. Get a lawful reference capture of the 3310 firmware or video showing the entire stage at an observable frame rate. Record hardware/emulator, firmware version, FPS and any speed multiplier.
2. Log every enemy entrance at frame-indexed timestamps with the visible 84×48 bounds; label enemy classes by observation, not guessed game IDs.
3. Trace both terrain boundaries and obstacle collision outcomes. The existing sinusoid terrain and no-collision floor are known approximations.
4. Capture boss appearance, animation states, projectile origins, attack cadence, collision box and transition behavior.
5. Observe normal and special firing, score changes, lives, pickups, pause and sound event times.
6. Add reviewed event fixtures in `tests/fixtures/stage-01/`; update `game/content/stages.mjs` only when a specific event has evidence.
7. Replay the same input trace on both implementations; compare frames and event logs, record mismatches and sign off the stage.

## Stop conditions

Do not invent timings or hand-draw copyrighted sprites by tracing extracted firmware assets. Do not report eight completed levels because eight provisional arrays are present. Do not claim that comparing a handful of screenshots proves frame-perfect behavior.

## Level 1 implementation checkpoint (2026-11-01)

A standalone **Level 1 terrain study** and **Level 1 boss silhouette** are implemented in `app.vue`. These are original pixel drawings built at 84×48, not firmware-extracted art. They give Level 1 its own identity and preserve our deployment pipeline. **Not yet verified**: boss sprite parity, exact terrain height at each frame, boss attack timings, collision, wave positions and the original audio. Neither a screen recording nor firmware input was available to produce defensible golden fixtures; the Level 1 parity gate remains open. Do not mark the stage complete on this basis.

## Level 1 mechanical implementation (2026-11-01)

- `game/levels/level-one.mjs` centralizes independently authored floor/ceiling geometry, obstacle hit checks, repeatable enemy trajectories, boss motion, aimed boss-projectile movement, and fixed boss firing cadence.
- `app.vue` now uses the same terrain geometry for rendering and collision, and uses deterministic first-stage enemy/boss motion rather than the global sine/random attack behavior.
- `tests/unit/level-one.test.mjs` covers geometry and obstacle collision, trajectory reproducibility, boss aim and timing conversion.
- **Historical accuracy remains UNVERIFIED:** parameters are approximations pending lawful emulator/video frame measurements, not measurements from Nokia ROM. Separate weapon-damage physics, pickup pacing, original sound, exact boss silhouettes and full input replay remain outstanding.

## Level 1 historical correction — 2026-11-01
An independent retrospective reports a blank first-stage background and a boss that moves up/down near the right edge with occasional projectiles: https://www.sohu.com/a/815236246_492137 . We removed our invented Level 1 rocky landscape, disabled terrain collision damage on that stage, and reduced the provisional boss firing rate. Previous ledger entries mentioning Level 1 jagged terrain are **superseded**. These observations are secondary-source evidence; exact timing and pixel parity remain unverified. Other levels retain their existing provisional scenery. No original audio or firmware graphics were imported.
