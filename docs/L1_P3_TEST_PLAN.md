# L1.P3 — Visual Dressing Acceptance Plan

## Implemented
- Original low-poly Paris-inspired roofline, cornice, storefront awning, glazing details.
- Decorative plaza fountain, lamps, colored zone flags.
- Shared geometry and cached material references to reduce unnecessary allocations.
- Entire visual layer isolated in `src/world/dressing.js`; existing world collision and route data unchanged.

## Review gates (not yet verified in live browser)
1. `npm install && npm run build` succeeds; module import resolves.
2. Test existing movement and camera controls, including approach to campus and civic zones.
3. At least three distinct styles of façade are visually apparent (variation from base building colors/heights).
4. Player, paths, checkpoint rings and entry points remain clear.
5. No obvious rendering artifacts or excessive draw-call-related slowdown on Intel i3 / 8 GB baseline.
6. Evaluate close-range camera occlusion near roofs and awnings.
7. Accessibility: markers should be distinguishable without relying solely on color; labels/icons planned for L1.P5.

## Known limitations
- Fountain, flags and lamps are *non-colliding decorations*; could be walked through until collision treatment is scoped.
- Generated façade details are visual motifs rather than historically precise Paris architecture.
- No real audio, NPCs or multiplayer.
- Build and browser/FPS tests remain pending; phase is **implemented for review**, not marked complete.
