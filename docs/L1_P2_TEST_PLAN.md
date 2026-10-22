# L1.P2 — Paris District Blockout

## Scope delivered
- Fictional Paris-inspired 60×60-unit district with orthogonal roads, a walkable plaza, placeholder shops, school-side and civic-side areas.
- Five clearly marked zones: Campus Gate, Place des Étudiants, Civic Services, Rue de l’Est and Rue de l’Ouest.
- Thirteen simple waypoint coordinates reserved for future NPC routing.
- Reusable map module exports `createWorld`, `ZONES`, `WAYPOINTS`, `SPAWN`.
- Building footprint collisions; player movement and camera remain from L1.P1.
- All geometry generated in code with original placeholder colors.

## Manual test checklist — pending browser validation
1. `npm install && npm run dev`; confirm canvas renders without console exceptions.
2. Spawn near the central plaza and use WASD / arrow keys to reach the marked campus and civic zones.
3. Follow multiple road paths without clipping buildings or blocking routes.
4. Confirm blocked outer bounds and building footprints; inspect corners at diagonal input.
5. Resize desktop browser from wide to narrow and verify viewport/camera/UI readability.
6. Run `npm run build` and `npm run check`; test preview build.
7. Confirm the five zones are all reachable and don't accidentally spawn inside geometry.
8. Measure FPS on the target i3/8 GB laptop before increasing geometry density.

## Deferred to future phases
- Authentically detailed architecture (L1.P3), polished character and camera (L1.P4), HUD iterations (L1.P5), performance gate (L1.P6).
- NPC pathfinding, actual checkpoints, crowds, barricade interaction and match mechanics (L2).
- Real-world protest data, real participants and tactical violence are not part of this project.

## Status
Code pushed for review. Browser run/build/performance have **not** been independently verified.
