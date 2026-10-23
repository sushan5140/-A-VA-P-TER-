# Level 3 — Final QA and Release Gate (L3.P5)

## Scope audited
- L3.P1 smoother cursor/keyboard/touch character movement (already integrated on main).
- L3.P2 bounded 30Hz NPC simulation, instanced renderer optimization (PR #21).
- L3.P3 opt-in synthesized audio cues, screen-reader event status and reduced-motion styles (PR #22).
- L3.P4 score-cap parity and exploit regression checks (PR #22).
- L3.P5 end-to-end deterministic regression suite for frame pacing, reset and both roles (this branch).

## Automated acceptance
- [ ] GitHub Actions PR quality gate (npm test, syntax, Vite build): requires green run.
- [ ] Confirm no unintended source changes to missions/camera.
- [ ] Check all tests on integration branch before release.

## Human/browser release blockers
- [ ] Desktop: verify mouse click-and-hold steering, keyboard, pause/resume, rematch.
- [ ] Touch device: verify joystick touch-release and unobstructed HUD.
- [ ] Sound: opt-in, mute, mobile/browser audio playback.
- [ ] Accessibility: focus navigation, 200% zoom, screen reader announcements, reduced motion.
- [ ] Frame time: profile i3/8GB low and auto quality; compare NPC simulation before/after.
- [ ] Fifteen balanced-role playtests with observations, not simulated metrics.
- [ ] Full 180-second rounds for both roles, events, scores and results.

## Release and contribution protocol
1. Preserve #21 and #22 as meaningful, reviewable pull requests.
2. Keep this L3.P5 PR stacked on #22. Do NOT squash commits solely to inflate contribution counts.
3. Integrate in dependency order only after final QA and user's deployment approval. Pushing/merging into main triggers automatic GitHub Pages deployment.
4. Do not count open PRs or branch commits as guaranteed GitHub profile contributions. GitHub determines contribution eligibility.
5. No fake commits, trivial artificial PRs or unreviewed changes.

**Status:** QA automation and documentation prepared; browser/device playtests are unresolved. No new deploy authorized.
