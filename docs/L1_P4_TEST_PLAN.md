# L1.P4 — Character and Camera Acceptance Plan

## Changes
- Original stylized indie character with oversized head, face direction cues, shoes, arm/leg movement and subtle walk bob.
- Character animation implemented as a separate `src/character/player.js` module.
- Smooth facing interpolation (shortest-angle rotation).
- Smoothed follow target and consistent angled orthographic camera; avoids camera whipping during turns.
- Movement/collision remain controlled by the existing world implementation.

## Manual checks (PENDING)
1. `npm install && npm run build && npm run check` in an environment with dependency access.
2. Open game and confirm eyes, arms and legs are visible; no detached body parts at idle.
3. Test WASD and arrow keys independently and diagonally; direction turns smoothly.
4. Walk against building corners, stop, resume; feet should remain on the ground.
5. Test rapid alternating directions and long idle periods; no spinning or drift.
6. Follow camera should track without snapping at low or high FPS.
7. Test camera/character near tall buildings for occlusion; adjust angle if necessary.
8. Resize to 16:9, 4:3, and narrow mobile proportions; HUD remains legible.
9. Test pause by switching tabs; blur clears keys and frame delta clamp prevents jumps.
10. Measure average/minimum FPS on target Intel i3/8 GB machine.

## Known limitations
- The prototype character is not a rigged production model; no skeletal animations.
- Overhead camera has not yet implemented dynamic building-fade/occlusion avoidance.
- The moving rig uses approximate foot placement; clipping and knee motion need in-browser inspection.
- This phase has not yet passed a runtime/browser QA gate and must not be marked verified.
- No multiplayer, NPCs, scoring or new world geometry is added in this phase.
