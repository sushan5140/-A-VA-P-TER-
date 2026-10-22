# ÇA VA PÉTER!

**A chaotic, stylized 3D browser arcade game set in a fictional modern Paris student-demonstration scenario.**

> *Paris is having a very bad school day.*

## Project status

**Phase 0 — planning and repository setup.** No playable game code has been implemented yet.

## Locked design baseline

- **Reference:** Jantar Mantar Chalo's compact, replayable, two-role arcade-game structure (not its assets or code).
- **Setting:** a fictional miniature Paris district with a campus, streets, public square, junctions and checkpoints.
- **Roles:** Students and Civic Safety Officers, each with distinct objectives focused on public safety and nonviolent play.
- **Art:** expressive low-poly / indie 3D characters; slightly angled top-down camera.
- **Matches:** approximately 3 minutes, with a complete beginning, scoring, and results screen.
- **Modes:** offline practice with bots first; online multiplayer in a later phase.
- **Visual design:** Space Grotesk + Inter; navy, French blue, coral and cream (proposed design tokens, not extracted from the reel).
- **Target stack:** Three.js and JavaScript; evaluate Supabase Realtime for multiplayer; static deployment on Vercel.
- **Budget goal:** ₹0 development with free-tier limits.

## Development phases

1. **Phase 0 — foundation:** repository audit, documentation, architecture, and development guardrails.
2. **Phase 1 — visual prototype:** one explorable Paris block, two stylized characters, camera, movement and basic lighting.
3. **Phase 2 — game loop:** roles, crowd NPCs, checkpoints, scenario events, scoring and match clock.
4. **Phase 3 — local playable vertical slice:** complete offline three-minute match, tutorial, results and tests.
5. **Phase 4 — multiplayer:** private rooms, role selection, synchronized state and reconnection behavior.
6. **Phase 5 — polish and release:** sound, accessibility, performance, responsive controls and deployment.

## Project principles

- Make gameplay understandable within seconds; avoid an empty 3D showcase.
- Each development phase must have observable acceptance criteria and smoke tests.
- Do not present invented incidents as factual news or impersonate real people.
- No instructions or scoring for violence against participants, officials or bystanders.
- Use original or properly licensed audio, characters, and environmental assets.
- Do not commit tokens, service keys, passwords or private data.
- Implement and test offline-first before introducing real-time multiplayer.

See [docs/PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md) and [docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) once the Phase 0 documentation branch is merged.

## Credits

Original indie-game concept and direction: project owner and collaborators. No third-party project is affiliated with this game.
