import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, ROUND_SECONDS } from '../src/game/match.js';

test('initial match is menu with full timer', () => {
  const m = createMatch();
  assert.deepEqual(m.snapshot(), { phase:'menu', role:null, remaining:ROUND_SECONDS });
});
test('role selection validates the role', () => {
  const m=createMatch();
  assert.equal(m.select('invalid'),false);
  assert.equal(m.select('student'),true);
  assert.equal(m.select('safety'),false);
  assert.equal(m.snapshot().phase,'ready');
});
test('match does not advance before starting',()=>{
  const m=createMatch();m.tick(30);assert.equal(m.snapshot().remaining,ROUND_SECONDS);
});
test('pause and resume freeze time',()=>{
  const m=createMatch();m.select('safety');m.start();m.tick(.5);
  assert.equal(m.pause(),true);const t=m.snapshot().remaining;m.tick(1);assert.equal(m.snapshot().remaining,t);
  assert.equal(m.resume(),true);m.tick(.5);assert.equal(m.snapshot().remaining,ROUND_SECONDS-1);
});
test('reaches results after elapsed gameplay time and can reset',()=>{
  const m=createMatch();m.select('student');m.start();
  for(let i=0;i<ROUND_SECONDS;i++)m.tick(1);
  assert.equal(m.snapshot().phase,'results');
  m.reset();
  assert.deepEqual(m.snapshot(),{phase:'menu',role:null,remaining:ROUND_SECONDS});
});
test('invalid negative and NaN deltas do not consume time',()=>{
  const m=createMatch();m.select('student');m.start();m.tick(-4);m.tick(NaN);
  assert.equal(m.snapshot().remaining,ROUND_SECONDS);
});
