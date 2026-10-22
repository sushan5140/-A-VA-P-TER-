// Dependency-free adaptive quality controller with deterministic tests.
export function qualitySettings(mode = 'auto', dpr = 1) {
  const density = Math.max(1, Math.min(Number.isFinite(dpr) ? dpr : 1, 2));
  if (mode === 'low') return { pixelRatio: 1, shadows: false, antialias: false };
  if (mode === 'high') return { pixelRatio: Math.min(density, 1.5), shadows: true, antialias: true };
  return { pixelRatio: Math.min(density, 1.25), shadows: true, antialias: true };
}
export function recommendQuality(fps, current, slowFrames) {
  if (current === 'low' || !Number.isFinite(fps)) return current;
  return slowFrames >= 5 && fps < 28 ? 'low' : current;
}
export function sampleFps(frameCount, seconds) {
  if (seconds <= 0) return 0;
  return Math.round(frameCount / seconds);
}
