# Space Impact — project status and handoff
Updated 2026-11-01

## Goal
Independent, historically faithful Nokia 3310 Space Impact browser recreation, retaining Nuxt 3/Vue 3/Canvas and GitHub Pages. No proprietary ROM/audio/sprites committed.

## Built and committed
- 84×48 LCD-style playfield, keyboard/touch movement, tap-fire, three approximate special weapons, score/lives and pause.
- Eight provisional stage scripts, stage transitions and an approximately animated boss.
- Level 1 blank background correction, approximate scripted enemies and boss; no verified original enemy/boss artwork.
- Unit and Playwright tests, GitHub Actions CI + Pages workflows.
- Historical evidence ledger, frame/event comparison helpers, original-source restrictions.

## Known issues and accuracy gaps
- Level 1 is NOT exact. Enemy waves, physics, score, boss animation, and sounds lack independent original firmware-frame verification.
- Levels 2–8 are still placeholder content; existing generic bosses do not match each stage's original.
- No original sound effects or reference-matched menus.
- Game remains heavily concentrated in app.vue; no fully separated deterministic simulation.
- Several past updates were declared progress before CI and gameplay verification; stop doing this.
- At last observation, GitHub Pages and CI passed for earlier commits, but this status file update has not yet been verified by CI.

## Single next milestone: Level 1 parity
Acceptance conditions:
1. Legally usable Level 1 reference recording or original-hardware/MAME trace obtained and documented with provenance.
2. Frame-indexed wave, terrain, enemy attack and boss evidence fixtures created and peer-reviewed.
3. Engine replays equivalent inputs deterministically; discrepancies logged and resolved.
4. Level 1 original-style visual scene, sound behavior, movement, damage and transition implemented.
5. Unit tests, typecheck, production build and desktop/mobile Playwright checks green.
6. GitHub Pages deployment for final SHA passes and real browser gameplay is verified.
Until all pass: Level 1 is **prototype**, not completed/exact.

## Working contract
Read AGENTS.md and .agents/skills/{retro-game-development,milestone-quality-gates}/SKILL.md. Work one vertical milestone; record real test outcomes and open blockers here. Do not create another roadmap-only change in place of implementation.

## Status terms
Implemented = code exists. Tested = actual tests green. Deployed = release action green. Historically verified = matched documented original reference. These words are not interchangeable.
