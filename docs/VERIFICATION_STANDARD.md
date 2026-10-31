# Nokia 3310 fidelity verification specification

Updated 2026-10-31. This is a research and acceptance artifact, not a claim that the browser game is yet exact.

## Authoritative reference hierarchy

1. **Original Nokia 3310 firmware running on compatible hardware or MAME**, with permission to use the firmware, is the behavioral ground truth. Do not commit firmware, extracted sprites, dumps or audio to this public repository.
2. **Firmware-derived independent reimplementation and reverse-engineering notes:** [lukesau/nokia-gb-games](https://github.com/lukesau/nokia-gb-games) (AGPL-3.0); [lukesau/nokia-dct3-re, games/re-3310](https://github.com/lukesau/nokia-dct3-re/tree/games/re-3310). Its README documents 3310 Space Impact verification against MAME frame by frame, using user-owned firmware data at build time. Research findings and tests can inform our independently written implementation; do not import AGPL code or ROM assets without a deliberate licensing and compliance decision.
3. [Nokia 3310 original gameplay photo](https://thesmartlocal.com/read/old-school-phone-games/), shows the compact upper HUD, player/enemy proportions and sparse rocky foreground.
4. [Nokia 3310 Space Impact screenshot](https://photogallery.indiatimes.com/gadgets/news-events/nokia-3310-the-wonder-years/4-jpg/articleshow/57533626.cms), shows a distinct level-three boss, ornate large sprite and foreground. This is a **screenshot**, not an animation specification.
5. [Community summary](https://nokia.fandom.com/wiki/Space_Impact) verifies the familiar keypad mapping, eight stages and broad weapon types, but not exact per-frame waves.

## Reference evidence per stage
| Stage | Theme/terrain | Enemy waves | Boss silhouette | Boss behavior | Audio | Evidence confidence |
|---|---|---|---|---|---|---|
| 1 | Unverified | Unverified | Unverified | Unverified | Unverified | Low |
| 2 | Unverified | Unverified | Unverified | Unverified | Unverified | Low |
| 3 | Photo shows intricate mechanical boss, detailed lower terrain | Unverified | One original photo | Unverified | Unverified | Medium for screenshot only |
| 4 | Unverified | Unverified | Unverified | Unverified | Unverified | Low |
| 5 | Unverified | Unverified | Unverified | Unverified | Unverified | Low |
| 6 | Unverified | Unverified | Unverified | Unverified | Unverified | Low |
| 7 | Unverified | Unverified | Unverified | Unverified | Unverified | Low |
| 8 | Unverified | Unverified | Unverified | Unverified | Unverified | Low |

## How we will know it is exact

For every stage capture a lawful reference run and an equivalent browser run under comparable input events. Capture normalized 84×48 frames after the HUD and landscape orientation are matched. Record:
- stage start time and duration; scroll offset; foreground/background geometry; obstacles and collision outcomes
- enemy ID, spawn frame, position trajectory, dimensions, attack frame and projectile speed
- boss appearance frame, dimensions, animation frames, attack patterns, health and transition conditions
- weapon inventory, selection behavior, projectile shapes and damage, ammo and pickups, scoring
- lives, death flashes, pause/end screens, sound events, game speed, key-repeat semantics

Build a fixture table with `source_kind`, `source_url`, `frame`, `pixel_bounds`, `expected_events`, `confidence`. No placeholders should be described as verified. Require an independent review of each stage before setting its `verified` flag.

## Gaps in current browser edition

- Scripted waves are authored approximations, not firmware-transcribed paths.
- One procedural boss is reused across all eight stages. Level-three original photograph clearly indicates more elaborate art.
- Terrain is sinusoidal rather than original obstacle geometry, and the terrain does not cause damage.
- Special weapon names are supported, but cycling inventory and weapon trajectories are invented approximations.
- No sound has been matched against original device recordings.
- Current HUD style and pixel geometry resemble the classic but have not passed pixel-diff verification.

## Legal/technical boundary

The upstream implementation is AGPL-3.0 and explicitly requires a **user-provided phone firmware dump** to extract its level, sprite, audio and font data. Mere source availability does not license Nokia firmware or its extracted art. We can use public documentation and independently authored clean-room code; a true byte/pixel-accurate reimplementation would require access to lawful original reference material and license review before distribution.
