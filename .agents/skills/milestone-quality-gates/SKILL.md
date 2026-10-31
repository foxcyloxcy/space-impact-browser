---
name: milestone-quality-gates
description: Enforces evidence-backed, tested and deployed vertical slices for the Space Impact Nokia recreation.
---
# Milestone quality gates
1. Before coding, read AGENTS.md, docs/PROJECT_STATUS.md, docs/RECONSTRUCTION_LEDGER.md and current files. Specify one deliverable and its acceptance test.
2. Distinguish historical evidence, independent approximations and original browser improvements. Never label guessed numbers or sketches exact.
3. Implement an entire vertical slice: data/behavior, rendering, necessary input, regression tests and documentation. Do not finish at scaffold-only research.
4. Run unit tests, typecheck, build and Playwright tests. On CI failures inspect actual job logs and fix rather than moving milestones.
5. Verify GitHub Pages ran successfully for the commit and perform a browser playthrough. A published HTML page alone does not demonstrate working gameplay.
6. Demand original-vs-browser frame/event evidence for accuracy claims. If absent, call the milestone prototype and state the blocker.
7. Report pass/fail with commit SHA, exact check result, remaining flaws, and one next priority. Update docs/PROJECT_STATUS.md each time.
8. Prefer adapting this skill to the game over importing irrelevant Next.js, backend, affiliate or scientific-analysis rules.
