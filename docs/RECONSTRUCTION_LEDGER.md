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
