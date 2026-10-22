export const ROUND_SECONDS = 180;
export const ROLES = ['student', 'safety'];
export function createMatch() {
  let phase = 'menu', role = null, remaining = ROUND_SECONDS;
  const snapshot = () => ({ phase, role, remaining: Math.ceil(remaining) });
  return {
    snapshot,
    select(next) { if (phase !== 'menu' || !ROLES.includes(next)) return false; role = next; phase = 'ready'; return true; },
    start() { if (phase !== 'ready') return false; phase = 'playing'; return true; },
    pause() { if (phase !== 'playing') return false; phase = 'paused'; return true; },
    resume() { if (phase !== 'paused') return false; phase = 'playing'; return true; },
    tick(delta) {
      if (phase !== 'playing') return;
      remaining = Math.max(0, remaining - Math.max(0, Math.min(Number.isFinite(delta) ? delta : 0, 1)));
      if (remaining === 0) phase = 'results';
    },
    reset() { phase = 'menu'; role = null; remaining = ROUND_SECONDS; },
  };
}
