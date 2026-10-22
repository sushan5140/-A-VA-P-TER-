import test from 'node:test';
import assert from 'node:assert/strict';
import {createCrowdModel} from '../src/game/crowd.js';
const nodes=[[0,0],[8,0],[8,8],[0,8]];
test('crowd starts with requested agent count',()=>assert.equal(createCrowdModel(nodes,24).agents.length,24));
test('same seed produces the same initial state',()=>assert.deepEqual(createCrowdModel(nodes,6,12).snapshot(),createCrowdModel(nodes,6,12).snapshot()));
test('crowd advances while remaining finite',()=>{const c=createCrowdModel(nodes,10);for(let i=0;i<240;i++)c.update(.05);assert.ok(c.agents.every(a=>Number.isFinite(a.x)&&Number.isFinite(a.z)))});
test('negative and invalid time steps are harmless',()=>{const c=createCrowdModel(nodes,5);const before=c.snapshot();c.update(-1);c.update(NaN);assert.deepEqual(c.snapshot(),before)});
test('reroute returns agents to waiting state',()=>{const c=createCrowdModel(nodes,8);for(let i=0;i<40;i++)c.update(.05);c.reroute();assert.ok(c.agents.every(a=>a.state==='wait'||a.state==='travel'))});
