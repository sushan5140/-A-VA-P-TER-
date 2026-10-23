import test from 'node:test';
import assert from 'node:assert/strict';
import {createCrowdClock} from '../src/game/crowdClock.js';
import {createCrowdModel} from '../src/game/crowd.js';
import {createMatch} from '../src/game/match.js';
import {createScoring} from '../src/game/scoring.js';
import {createObjectives,ROLE_MISSIONS} from '../src/game/objectives.js';
import {buildResult} from '../src/game/results.js';
import {evaluateRoleParity} from '../src/game/balance.js';
const grid=[[-18,-16],[-18,0],[-18,16],[0,-16],[0,0],[0,16],[18,-16],[18,0],[18,16]];
test('crowd remains deterministic across 30 and 60 fps frame pacing',()=>{
 const a=createCrowdModel(grid,48,41),b=createCrowdModel(grid,48,41);
 const ca=createCrowdClock(),cb=createCrowdClock();
 for(let i=0;i<300;i++)ca.advance(1/30,dt=>a.update(dt));
 for(let i=0;i<600;i++)cb.advance(1/60,dt=>b.update(dt));
 assert.deepEqual(a.snapshot(),b.snapshot());
});
test('crowd clock restart does not leak partial simulation into next round',()=>{
 const clock=createCrowdClock();
 clock.advance(.02,()=>{});
 clock.reset();
 let steps=0;
 clock.advance(.02,()=>steps++);
 assert.equal(steps,0);
});
test('both role round results remain within identical reachable caps',()=>{
 assert.equal(evaluateRoleParity().parity,true);
 for(const role of ['student','safety']){
  const match=createMatch(),objectives=createObjectives(role),scoring=createScoring(role);
  match.select(role);match.start();
  for(const mission of ROLE_MISSIONS[role]){objectives.visit(mission.id);scoring.mission(mission.id);}
  for(let i=0;i<180;i++)match.tick(1);
  assert.equal(match.snapshot().phase,'results');
  const result=buildResult(scoring.snapshot(),objectives.snapshot());
  assert.equal(result.total,60);
  assert.equal(result.possible,3);
  assert.equal(result.completed,3);
 }
});
