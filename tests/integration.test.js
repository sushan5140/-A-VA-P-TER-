import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,ROUND_SECONDS} from '../src/game/match.js';
import {createObjectives,ROLE_MISSIONS} from '../src/game/objectives.js';
import {createScoring} from '../src/game/scoring.js';
import {createEventDirector} from '../src/game/events.js';
import {createCrowdModel} from '../src/game/crowd.js';
import {buildResult} from '../src/game/results.js';
const grid=[[-18,-16],[-18,0],[-18,16],[0,-16],[0,0],[0,16],[18,-16],[18,0],[18,16]];
for(const role of ['student','safety']) {
 test('integrated 180-second solo round for '+role,()=>{
  const match=createMatch(), objectives=createObjectives(role), score=createScoring(role), events=createEventDirector(), crowd=createCrowdModel(grid,48);
  assert.equal(match.select(role),true);
  assert.equal(match.start(),true);
  const original=crowd.snapshot();
  for(const mission of ROLE_MISSIONS[role]){objectives.visit(mission.id);score.mission(mission.id);}
  for(let frame=0;frame<ROUND_SECONDS*20;frame++){
    const dt=.05;
    match.tick(dt);
    const event=events.update(dt);
    if(event.changed)crowd.setEvent(event.event);
    crowd.update(dt);
    score.access(dt,true);
    if(event.event)score.respond(event.event.type,'acknowledge');
  }
  assert.equal(match.snapshot().phase,'results');
  const result=buildResult(score.snapshot(),objectives.snapshot());
  assert.equal(result.completed,3);
  assert.ok(result.total>=60 && result.total<=120);
  assert.equal(crowd.agents.length,48);
  events.reset();crowd.reset();match.reset();score.reset();objectives.reset();
  assert.deepEqual(crowd.snapshot(),original);
  assert.equal(match.snapshot().remaining,ROUND_SECONDS);
  assert.equal(score.snapshot().total,0);
  assert.equal(objectives.snapshot().completed,0);
 });
}
test('paused simulation does not progress match clock or director',()=>{
 const match=createMatch(),director=createEventDirector();
 match.select('student');match.start();match.tick(1);director.update(.05);match.pause();
 const before=match.snapshot(),ev=director.snapshot();
 for(let i=0;i<100;i++)match.tick(.05);
 assert.deepEqual(match.snapshot(),before);
 assert.equal(director.snapshot(),ev);
});
