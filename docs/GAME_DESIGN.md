# Game Design and Fidelity Contract

## Vision
A nostalgic yet usable browser adaptation of **Nokia Space Impact (2000)**. Baseline priority is responsive gameplay with the recognizable monochrome palette, small left-side ship, horizontal right-to-left world motion, compact top HUD, alien hazards, weapon pickups, finite lives, eight levels and a final boss for each level.

## Verified historical baseline
- The game is a horizontally scrolling shooter; the ship can move vertically and horizontally.
- Original Nokia variants document 8/0 up/down, */# left/right, 1/3 primary weapons, 4/6 bonus weapons.
- There are eight original levels with a boss at the end of each; upgrades include special weapons and additional lives.
- The HUD displays survival/scoring state and the original phone screen is low-resolution monochrome.

Sources and exact confidence levels: `docs/REFERENCES.md`.

## Implementation versus reference
| Feature | Current browser implementation | Fidelity status |
|---|---|---|
| Landscape monochrome canvas | 320x200 virtual pixels | Browser adaptation, not the Nokia resolution |
| Player ship | Custom procedural pixels | Placeholder; visual comparison outstanding |
| Eight stages | Eight themed sectors with timers | Progression works in code; layouts not faithful |
| Bosses | One procedural boss per sector | Mechanics prototype; original patterns unverified |
| Primary fire | Repeat-fire bullets | Adaptation of Nokia controls |
| Special weapons | Three-projectile spread with ammo | Placeholder, not historical weapon categories |
| Pickups | Special ammo or extra life | Functional approximation |
| Life/score HUD | Top row, browser local best | Approximation |
| Touchpad | Direction + primary/special | Browser-only enhancement |
| Audio | None | Missing |

## Gameplay acceptance targets
- A new run starts with 3 lives, 3 special charges, stage 1, score 0.
- The player remains inside the field and cannot move into the HUD.
- Holding primary fire repeats at a bounded cadence; specials consume exactly one charge per press.
- Collisions decrease lives at most once per invulnerability window.
- Enemy defeat increments score once; health-zero bosses must trigger stage progression once.
- Complete all 8 sectors to win; losing all lives opens a restartable game-over state.
- Pause stops simulation; resize does not change simulation geometry.
- All game-critical actions work via keyboard and touch; mobile does not accidentally scroll while playing.
- Persistent best score stays local. No user profile, login or remote telemetry.

## Fidelity milestones
1. Capture verified level footage and original handset screenshots for each stage, boss, enemy class, power-up and UI state.
2. Replace placeholder enemy waves with data-driven, reference-matched spawns and fixed positions.
3. Recreate sprite silhouettes from permitted reference observation with original drawings.
4. Audit timing and movement against recordings, including collision and scrolling speed.
5. Implement appropriately licensed or original sound, user-muted by default until interaction.
6. Run device/browser comparisons, document outstanding differences.

No claim is made that stage visuals, sounds, boss attacks, weapon variants or level timings currently match the original.
