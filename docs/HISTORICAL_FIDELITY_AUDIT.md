# Historical fidelity audit — Nokia 3310 baseline
Updated 2026-10-31.

## Evidence we can confirm
1. The original has four-direction ship movement and separate primary and bonus firing buttons. Nokia's user guide specifies **8/0** up/down, **\*/#** left/right, **1/3** main fire, and **4/6** bonus fire. Primary source: https://fcc.report/FCC-ID/ljpnkc1/237770.pdf (Space Impact, Games section).
2. The classic Space Impact is described as **eight levels, boss at each end**. Source: https://nokia.fandom.com/wiki/Space_Impact (community secondary evidence); https://www.sify.com/gaming/the-impact-of-space-impact/ (historical retrospective).
3. Three special weapon categories reported: **bombs, rockets and long-range lasers**. Same secondary sources.
4. Unlike Nokia 3410, Nokia 3310 is described as **not offering fire-button hold for rapid firing**. Source: https://www.sify.com/gaming/the-impact-of-space-impact/ (secondary report).
5. One publicly documented full run and stage chapter markers: https://www.youtube.com/watch?v=sb20XEqdR1g ; see LEVEL_REFERENCE_MATRIX.md. Creator chapter labels have not been independently measured.

## Implemented this milestone
- Primary fire triggers on a key press or touch press rather than held automatic repeat; this is a meaningful 3310-specific behavior change.
- Eight external, readable stage scripts are consumed by the engine: `game/content/stages.mjs`.
- Three distinct special projectile modes cycle when using SPECIAL; **their precise graphics and mechanics are not validated**.
- Each level has its own progression duration and spawn-time schedule. **The time values are reconstruction placeholders**, not ROM extraction or verified frame counts.
- Unit tests cover wave event order and idempotence.

## Not established and not to be advertised as exact
- Per-level map and obstacle geometry, exact enemy silhouettes/path splines, specific wave timing, boss artwork/health/attack sequences.
- Correct HUD glyphs and score values.
- Exact weapon effects, firing cadence, score pickups, sounds and Nokia emulation speed.
- The original Nokia software assets are proprietary. Do not copy a ROM or fan remake assets/code absent permission.

## Required next evidence work
Record in a table for every stage: source URL, timestamp, sampled frame, score, player x/y, enemy types, enemy x/y, boss time, terrain geometry and confidence. Compare at least two references for disputed details. Then replace provisional data with verified annotated scripts one stage at a time. A faithful reproduction claim requires gameplay video comparison and documented outstanding deltas.
