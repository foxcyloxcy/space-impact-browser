# Agent Instructions: Space Impact Browser Edition

## Purpose
Build and maintain a playable, reference-driven browser adaptation of the original Nokia Space Impact game. Read README.md and docs/{GAME_DESIGN,ARCHITECTURE,ROADMAP,REFERENCES}.md before designing gameplay changes.

## Working principles
1. Inspect existing code, dependencies, tests, Git state and target environment first. Preserve Nuxt 3/Vue 3/Canvas unless a measured reason to change is documented.
2. Keep gameplay authoritative in one fixed-time-step simulation; render via Canvas at a stable logical resolution, with pixel-perfect scaling. The current app.vue is a first milestone and must be refactored carefully, not rewritten blindly.
3. Separate input, simulation, collisions, level scripting, rendering, sound and persistence. Do not couple gameplay to Vue reactive state or create untracked browser event listeners.
4. Original feature versus browser adaptation versus unverified assumption must be labelled in docs. Prefer Nokia's manuals and observable gameplay to fan summaries. Do not claim pixel-perfect fidelity until comparison evidence exists.
5. Support desktop keyboard and touch devices; prevent input scrolling only when necessary, pause on blur, teardown animation frames/listeners and avoid stale intervals.
6. Use deterministic seeds and fixed tick stepping in game logic; protect against double-counted hits, enemy removal during iteration, repeated collision damage and runaway projectiles.
7. Maintain tests for movement bounds, fire cooldowns, pickups, special ammo, lives/invulnerability, eight-level progression, bosses, and pause/restart; add Playwright tests for mobile touch and desktop keyboard.
8. Respect copyright/trademarks: use custom art/code/sounds or verified licensed materials, keep credits, and never paste source from unrelated remakes.
9. Do not introduce unrelated frameworks, paid services, authentication, databases, speculative agent packs or deployment dependencies. Use minimal scoped skills; do not duplicate repository/global instructions.
10. Update README, docs/ROADMAP.md and docs/REFERENCES.md after material changes. Explicitly disclose which tests/builds were actually run; don't imply a release or deployment was verified without evidence.

## Repository-local skill
Use `.agents/skills/retro-game-development/SKILL.md` for game-loop, rendering and verification changes. Treat it as advice subordinate to this file and to system/user instructions.

## Git/deployment
Prefer small reviewable commits. Don't commit secrets, copyrighted ROMs or binary assets of unknown origin. Production deploy requires a verified build, desktop/mobile smoke testing and working input after browser blur/resume.
