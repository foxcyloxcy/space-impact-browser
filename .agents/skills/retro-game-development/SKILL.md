---
name: retro-game-development
description: Scoped guidance for maintaining the Nuxt browser shooter, pixelated Canvas rendering, deterministic gameplay and source-faithful feature research.
---
# Retro Game Development

Use for changes to movement, weapons, enemies, waves, bosses, menus, Canvas rendering, mobile controls and game tests.

1. Start with `AGENTS.md`, `docs/GAME_DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/REFERENCES.md`.
2. Reproduce the issue and distinguish a historical behavior from an accessibility/browser adaptation.
3. Use the currently implemented 84×48 Nokia 3310-class canvas. Confirm dimensions from current code before editing; do not silently revert them. Visual fidelity still requires golden-frame comparison.
4. Separate pure world update and rendering. Apply fixed timestep and seedable randomness during the planned refactor.
5. Prefer data tables for level sequences, enemy paths, bosses and weapons over scattered timing constants.
6. Cover keyboard and touch concurrently. Hold inputs must release on pointercancel, blur and teardown; test multitouch.
7. Use custom pixel art, images with explicitly compatible licenses, or abstract procedural sprites; track attribution.
8. Tests: movement boundaries, cadence, collision once-per-hit, cooldown, death, stage clear, win, restart, pause, persistence fallback.
9. Run real install/build/unit/E2E checks when the environment allows; report pass/fail/untested truthfully.
10. Update roadmap and source evidence after changes. Do not install duplicate generic agent skill packs or add unrelated project tooling.
