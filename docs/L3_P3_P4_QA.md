# L3.P3–P4 — Audio, Accessibility and Balance QA

## Implemented
- Audio is opt-in via Sound: Off/On toggle; synthesized, original and lightweight notification tones only.
- Audio cues for mission completion, event appearance and round outcome.
- Screen-reader live region for important game events; visually-hidden style and reduced-motion preferences.
- Deterministic role parity evaluator and regression tests for duplicate objectives, capped access points and repeated events.

## Verification still required
- Manual sound playback and mute across Chrome, Safari and mobile; Web Audio requires user gesture.
- Keyboard tab navigation, focus order, 200% zoom, screen-reader event announcements and minimum 44-pixel touch targets.
- Minimum 15 **real human playtests** to assess role balance. Deterministic parity is mathematical, not evidence that both roles are equally easy.
- Gameplay event timing, mission visibility and HUD overlap with voice-over/mobile.
- Full production build and npm test through PR CI.

## Constraints
- No copyrighted songs or third-party audio assets.
- No claims of live user playtests or real device validation.
- No merge into main or GitHub Pages release before Level 3 final QA and user release instruction.
