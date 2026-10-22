# L1.P6 — Performance & QA Report

## Verified in local Node environment
- `node --test tests/performance.test.js`: **6 passed, 0 failed**.
- `node --check src/performance.js`: passed.
- Logic covers low/auto quality configuration, DPI caps, downgrade threshold, no auto-upgrade, and FPS math.

## Changes
- Live FPS readout (measured with unclamped frame time).
- Manual Graphics button toggles auto/low quality.
- `?quality=low` starts with a lightweight configuration.
- Low mode disables dynamic shadows and limits rendering pixel ratio to 1.
- After five consecutive <28 FPS one-second measurements, auto falls back to low.
- Existing movement, scene, HUD and level layout are unchanged.
- `npm test` added to package scripts.

## High-priority checks still NOT VERIFIED
- `npm install` / `npm run build`: blocked because npm registry access timed out.
- Real browser render, playthrough across five destinations, arrow/WASD collision, map labels and UI.
- Intel i3/8GB target benchmark and frame-time stability.
- Occlusion near buildings; player can clip non-collidable decorations.
- Responsive/mobile portrait overlap, keyboard focus, reduced-motion/a11y review.
- Full Level 1 acceptance gate therefore **NOT PASSED**.

## Follow-up validation commands
```sh
npm install
npm test
npm run check
npm run build
npm run dev
```
Open in Chromium and verify desktop and mobile viewports. Toggle graphics mode, record FPS and check all five destination markers. Fix issues before merging and moving to Level 2.

## Additional note
Renderer antialiasing is chosen at WebGL creation; changing the quality button does not recreate the context. Low mode lowers DPR and disables shadows; the initial `?quality=low` URL also disables antialiasing. Actual speedup must be measured.
