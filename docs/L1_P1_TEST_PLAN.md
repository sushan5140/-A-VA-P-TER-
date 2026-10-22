# L1.P1 — Scaffold Verification

## Included in the proposed branch
- Vite project using Three.js, with npm dev/build/check scripts.
- Responsive canvas, basic low-poly Paris-inspired blockout, a single placeholder character.
- WASD/arrow movement, collision with building footprints, following angled orthographic camera.
- Introductory HUD, original temporary geometry and fallback error message for graphics context loss.

## Manual acceptance tests (not yet executed in a browser)
1. Run `npm install && npm run dev`; open local Vite URL.
2. No errors in browser console; WebGL canvas shows buildings, roads and blue player.
3. WASD and arrows move character; diagonal movement has consistent speed.
4. Player cannot walk through facades; camera follows; HUD position changes.
5. Reload restores starting position; resizing keeps canvas and text readable.
6. `npm run build` completes and `npm run preview` serves the build.

## Explicit exclusions
No online multiplayer, NPC AI, score, match timers, touch joystick, sound, authentic Paris landmarks, final character art, or live deployment. This is a **scaffold**, not a complete L1 world or playable round.

## Local validation status
Package installation and browser acceptance remain unverified until dependencies can be installed in a network-enabled environment. `node --check` can validate JavaScript syntax without downloading dependencies.
