// Pure result calculations. A solo prototype receives a personal grade,
// never a fabricated multiplayer "winner" result.
export function buildResult(score, objectives) {
  if (!score || !objectives) throw new Error('Missing round data');
  const total=Math.max(0,Math.min(120,score.total));
  const fraction=total/120;
  const grade=fraction>=.85?'S':fraction>=.65?'A':fraction>=.45?'B':fraction>=.25?'C':'D';
  return Object.freeze({
    role:score.role, total, grade,
    missions:score.missions, access:score.access, events:score.events,
    completed:objectives.completed, possible:objectives.total,
    headline:grade==='S'?'Excellent coordination':grade==='A'?'Strong performance':grade==='B'?'Good progress':grade==='C'?'Keep exploring':'Try another route',
  });
}
