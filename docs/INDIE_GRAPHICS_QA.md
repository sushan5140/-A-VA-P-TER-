# Indie Graphics Upgrade — Visual Prototype

## Source audit
- Three.js core and examples: MIT license. Adopted built-in ACES tone mapping, atmospheric fog and reusable low-cost meshes instead of copying demo assets.
- pmndrs/postprocessing: Zlib license, reviewed for effects like outline, vignette, color grading and bloom. NOT installed because a full-screen effect chain needs measured FPS on integrated graphics.
- Three.js Sky: evaluated but not installed because scene uses an orthographic aerial camera and distant fog already; skydome requires additional draw work.
- Other game art assets, textures and model repositories not imported without individual asset license checks.

## Changes
- Warmer cinematic tone mapping and consistent pastel atmospheric palette.
- Pulsing thin landmark/mission rings made with one shared mesh geometry and five simple materials, no expensive postprocessing.
- Quality-aware fog and exposure, all compatible with the existing graphics toggle.
- Changes are visuals only and preserve original collisions, geometry, camera and gameplay.

## Tests before merging
- Vite build, Node tests and JavaScript syntax checks.
- Compare FPS/frametime on i3/8 GB laptop and mobile, especially low quality mode.
- Verify landmarks remain legible, no z-fighting or HUD contrast regression.
- Compare loading and assets size with and without Rapier in parent PR.
- No deployment until user approval.

Parent branch PR #30 contains the optional Rapier prototype. This PR is stacked on that branch and must be reviewed after physics integration.
