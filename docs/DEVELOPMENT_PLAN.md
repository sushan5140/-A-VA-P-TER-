# ÇA VA PÉTER! — Development Plan

## Phase 0: repository foundation
- [x] Confirm repository and permissions.
- [x] Confirm initial repository was empty.
- [x] Initialize README on main.
- [x] Draft design and development documentation on separate branch.
- [ ] Merge Phase 0 PR after review.

## Phase 1: visual foundation
**Deliverable:** basic walkable stylized Paris block. Create renderer, ground, streets, buildings, camera and two placeholder player models. Include controls and a browser smoke test. **Not complete** until the scene loads consistently and player navigation works.

## Phase 2: core mechanics
**Deliverable:** one distinct objective for each role, safe zones, checkpoints, a simple crowd simulator and scenario events. Keep simulation deterministic and testable.

## Phase 3: offline vertical slice
**Deliverable:** full three-minute round: select role → play → scoring → result → restart. Include pause, audio controls, input help and automated game-state tests.

## Phase 4: multiplayer
**Deliverable:** verified private-room workflow with synchronized positions and authoritative match resolution. Include disconnect/reconnect tests, basic anti-cheat validation and sensible free-tier usage constraints. Avoid shipping if core offline loop is not fun and stable.

## Phase 5: polish and shipping
Performance profiling, asset optimization, responsive UI, accessibility, sound, mobile control refinement and release audit.

## Proposed architecture (not implemented)
- Browser client: JavaScript/TypeScript with Three.js and Vite.
- Game modules: world, input, character, NPC behavior, objectives, match state, UI/audio.
- Static deployment first, then optional realtime backend.
- Asset manifest and explicit attribution/licenses.

## Definition of done per phase
A working build, reproducible tests, documented limitations, no leaked credentials, and reviewable changes. Avoid merging a beautiful but noninteractive placeholder as if it were gameplay.
