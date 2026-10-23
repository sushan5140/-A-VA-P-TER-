import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateRoleParity,evaluateObjectiveIntegrity} from '../src/game/balance.js';
import {createScoring} from '../src/game/scoring.js';
test('student and civic safety maximum outcomes have equal caps',()=>{
 const audit=evaluateRoleParity();assert.equal(audit.parity,true);assert.deepEqual(audit.scores,{student:120,safety:120});
});
test('both roles have unique, readable tasks',()=>assert.equal(evaluateObjectiveIntegrity(),true));
for(const role of ['student','safety']){
 test(role+' cannot farm repeated event points',()=>{
  const score=createScoring(role);for(let n=0;n<100;n++)score.respond('closure','acknowledge');
  assert.equal(score.snapshot().events,10);
 });
 test(role+' cannot farm safe access past score cap',()=>{
  const score=createScoring(role);for(let n=0;n<500;n++)score.access(1,true);
  assert.equal(score.snapshot().access,30);
 });
}
