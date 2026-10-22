# Development Plan

The authoritative implementation breakdown is [**Level / Phase Master Roadmap**](LEVEL_PHASE_ROADMAP.md), using the hierarchy **Level → Phase → Task/Test**. The earlier milestone labels M0–M4 in the Word PRD are mapped to levels in this roadmap and do not represent separate parallel plans.

## Current state
- L0.P1 Repository audit — Verified.
- L0.P2 Product baseline — Documented.
- L0.P3–L0.P4 visual tokens and architecture — Planned for review.
- L0.P5 Merge and approve documents — Pending.
- L1–L5 — Not started. No game code, deployment or online service exists yet.

## Workflow
1. Complete one phase at a time on a feature branch.
2. Require demonstrable acceptance checks per phase.
3. Open PR with tests/screenshots and unresolved issues.
4. Merge only after review; do not mark the next level started early.
5. Keep costs at ₹0 where feasible; validate limits before adding realtime dependencies.

## First playable target
A fictional miniature Paris map with a top-down tilted camera, role choice, NPC crowd flows, three environmental events and a 180-second offline match. Students and Civic Safety Officers have different safety-focused objectives. See [Product Brief](PRODUCT_BRIEF.md).
