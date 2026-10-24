# Physical Locomotion Upgrade — Prototype

## Referenced open-source repositories
- Rapier physics: https://github.com/dimforge/rapier — Apache-2.0. Installed as the published dependency `@dimforge/rapier3d-compat@0.21.0`; no engine sources are copied into our repository.
- Ecctrl: https://github.com/pmndrs/ecctrl — MIT. Consulted for controller ideas; **not copied or installed** because its React Three Fiber architecture doesn't match this vanilla Three.js project.

## Changes
- Optional Rapier WASM-backed kinematic capsule and static building colliders.
- Character controller slides against building walls and follows axis-resolved motion.
- Existing custom movement acceleration, pointer, touch and keyboard inputs remain unchanged.
- Graceful fallback to classic rectangular collisions on Rapier initialization failure.
- Character procedural torso lean while turning.

## Verification gate
1. Install dependencies, npm test, JS syntax, Vite build and check WASM module bundling in Pages subpath.
2. Play a full round, walk into walls and corners, verify no clipping, jitter or tunneling; check after rematch/reset.
3. Verify desktop mouse hold, WASD, touch joystick and FPS impact on i3 / 8 GB target.
4. Compare loading bytes and frames against previous build; if regression is severe, default back to existing controller.
5. No merge to main or GitHub Pages deployment until physical playtesting.

This is a **prototype integration**, not proof of production-grade physics or real-device performance. No exact source clone was possible in this environment because git network access was unavailable; integration uses the official versioned package and code references instead.
