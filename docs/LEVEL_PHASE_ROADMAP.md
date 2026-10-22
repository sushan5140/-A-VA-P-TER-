# ÇA VA PÉTER! — Level / Phase Master Roadmap

**Status:** Planning baseline aligned to approved `Revolution_2026_Game_PRD_v1.0.docx`. Rename of game brand only; gameplay requirements remain those in the PRD. **Hierarchy: Level > Phase > Task / Test.**

**Tracking scheme:** `L2.P3` = Level 2, Phase 3. One phase at a time; each phase ends with evidence (screenshots, tests, recorded gameplay or notes), not only a commit. Level gates prevent scope creep.

## Level 0 — Foundation / Design Lock
**Rank:** project setup. **Level gate:** documented scope, architecture and reviewable plan, with no secrets in repository.
- **L0.P1 Repository audit:** confirm permissions, default branch, contents, branching strategy and contribution rules. *Done.*
- **L0.P2 Product baseline:** lock title **ÇA VA PÉTER!**, fictional Paris premise, students vs civic safety officers, 180-second target, ₹0 tools. *Documented.*
- **L0.P3 Visual tokens:** Space Grotesk/Inter, proposed navy `#17233A`, blue `#3764C9`, coral `#F07162`, cream `#F9E8C9`, grey `#87939B`, green `#5D9477`; annotate as original design choices, not extracted from Jantar Mantar reel.
- **L0.P4 Architecture & quality plan:** offline-first architecture, scoped milestones, collision/crowd/performance testing, deploy strategy.
- **L0.P5 Review gate:** approve documentation, merge Phase 0 PR. No game code in this level.

## Level 1 — Visual World / Exploration
**Rank:** first navigable scene. **Level gate:** clear, responsive, walkable miniature Paris environment.
- **L1.P1 Project scaffold:** Vite + Three.js, modular game entry, lint/smoke build; first blank canvas loads.
- **L1.P2 World blockout:** school gate, two routes, plaza, service corridor, two pinch points, three path options; no crowd dead ends.
- **L1.P3 Visual dressing:** fictional bakery/facades, railings, street trees, directional markers, low-poly original assets and attribution ledger.
- **L1.P4 Player & camera:** one stylized prototype character, top-down slightly tilted orthographic follow camera, WASD/arrows and basic collision.
- **L1.P5 HUD & readability:** top score/timer mock; left mini-map; right action buttons; bottom objective; check 720p, contrast and accessibility.
- **L1.P6 Performance gate:** baseline Intel i3/8 GB testing, graphics settings prototype; target 60 FPS and minimum acceptable 30 FPS.

## Level 2 — Offline Game / Complete Match
**Rank:** first full playable game. **Level gate:** a deterministic 180-second solo round with both roles, feedback, verdict and restart.
- **L2.P1 Match states:** home → role select → spawn within 5 s → play → results → rematch, pause/restart.
- **L2.P2 Two role kits:** Student organizer safe rally/checkpoint objectives vs Civic Safety Officer emergency corridor/congestion objectives; at least two meaningful actions per role.
- **L2.P3 Crowd simulation:** 40–80 pooled NPCs to start; idle/travel/gather/wait/reroute/exit states, node capacities and steering.
- **L2.P4 Three scenario events:** road closure, crowd surge and emergency access; reroute NPCs and update objective state visibly; event cadence approximately 20–35 s.
- **L2.P5 Scoring & safeguards:** students 45% checkpoints + 35% safety + 20% route/accessibility; safety role 45% emergency uptime + 35% congestion + 20% public hazards. Neither side earns points for harm, harassment, blocking emergency services or suppressing lawful speech.
- **L2.P6 Complete result loop:** 180 s match, outcome breakdown, restart without reload, offline-only operation/no account/no paid API.
- **L2.P7 Acceptance gate:** cold start to round within 10 s, no soft-locks, correct scoring, distinct roles, three events all alter map/behavior.

## Level 3 — Game Feel / Stability / Balance
**Rank:** retention and playable quality. **Level gate:** reliable and enjoyable solo build on target hardware.
- **L3.P1 Feel:** responsiveness, readable indicators, contextual prompts, event camera emphasis (no excessive shaking).
- **L3.P2 NPC & routes optimization:** batched/instanced rendering, pooling, LOD, lower graphics preset, crowd capacity/load tests.
- **L3.P3 Audio & accessibility:** original audio and cues, volume/mute, visual alerts/subtitles, reduced motion, keyboard navigation; touch targets ≥44 px where applicable.
- **L3.P4 Balance & anti-exploit:** run 15 playtests, investigate exploit paths, verify both roles have viable strategies, prevent objective soft-locks.
- **L3.P5 Quality gate:** deterministic tests for transitions, role scoring, closures, NPC flow and restart; 30 FPS minimum acceptable on Intel i3/8 GB test class; note any unmet target explicitly.

## Level 4 — Multiplayer / Private Alpha
**Rank:** realtime competitive mode. **Level gate:** two teams can complete matches with tested synchronization and failure recovery.
- **L4.P1 Architecture decision:** determine viable free-tier networking approach; Supabase Realtime for lobby/events if appropriate, evaluate authoritative game-state hosting and cost.
- **L4.P2 Lobby:** private invite code, team/role selection, ready state, lobby privacy.
- **L4.P3 Match sync:** authoritative event validation, player positions and timers, fair cooldowns, state reconciliation.
- **L4.P4 Network resilience:** disconnect/rejoin, late packet and room timeout handling, graceful offline fallback.
- **L4.P5 Multiplayer tests:** scripted two-browser run, concurrent rooms load check, anti-cheat checks, access validation, quota tracking.
- **L4.P6 Alpha gate:** correct winners across clients, no indefinite stuck rooms, failures reported without falsely claiming always-on free capacity.

## Level 5 — Public Beta / Release
**Rank:** launch-ready presentation and distribution. **Level gate:** accessible, optimized build with documented production limitations.
- **L5.P1 Mobile controls:** responsive HUD, touch joystick/context controls, small-screen legibility, input parity where feasible.
- **L5.P2 Visual & audio polish:** cohesive original assets, crowd/character animations, original music and sounds, polish in gameplay rather than empty cutscenes.
- **L5.P3 Social sharing:** safe shareable match summary and optional replay highlight only if technically validated.
- **L5.P4 Release readiness:** build/cross-browser checks, licenses, privacy/security audit, accessibility and low-bandwidth loading checks.
- **L5.P5 Deploy & smoke test:** Vercel production release only after user approval; monitor errors and verify real client flow.
- **L5.P6 Post-launch triage:** bug priorities and retention metrics, no automatic feature expansion.

## Risk / dependency rules
- **Sequential gate:** L1 before L2, offline L2/L3 before L4; exceptions require a documented decision.
- **Budget:** ₹0 is a goal, not proof of unlimited free multiplayer or permanent hosting.
- **Fictional, nonviolent framing:** no real protest participants, real-time organizing instructions, targeting of individuals, weapons or realistic injury systems.
- **Jantar Mantar reference:** use its genre and game-loop lessons; exact UI timing and original camera/color specs are not verified.
- **Performance:** 720p legibility, <8 s initial load target on good connectivity, low mode, no premature scaling of NPCs.
- **Issue conventions:** `[Lx.Py] feature:...`; tests and acceptance criteria in each PR; mark status as Not started / In progress / Verified / Blocked.
