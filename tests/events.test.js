import test from 'node:test';import assert from 'node:assert/strict';import {createEventDirector} from '../src/game/events.js';import {createCrowdModel} from '../src/game/crowd.js';
const grid=[[-18,-16],[-18,0],[-18,16],[0,-16],[0,0],[0,16],[18,-16],[18,0],[18,16]];
test('event director cycles through three events',()=>{const d=createEventDirector(.1,.1);const observed=[];for(let i=0;i<30;i++){const v=d.update(.05);if(v.changed&&v.event)observed.push(v.event.type);}assert.deepEqual(observed.slice(0,3),['closure','congestion','emergency']);});
test('reset clears active event',()=>{const d=createEventDirector(.05,.1);d.update(.05);assert.equal(d.snapshot().type,'closure');d.reset();assert.equal(d.snapshot(),null);});
test('closure event never removes entire grid',()=>{const c=createCrowdModel(grid,20);c.setEvent({type:'closure'});for(let i=0;i<500;i++)c.update(.05);assert.ok(c.agents.every(a=>Number.isFinite(a.x)&&Number.isFinite(a.z)));});
test('crowd paths remain on roads',()=>{const c=createCrowdModel(grid,40);for(let i=0;i<1000;i++)c.update(.05);assert.ok(c.agents.every(a=>[-18,0,18].some(x=>Math.abs(a.x-x)<.01)||[-16,0,16].some(z=>Math.abs(a.z-z)<.01)));});
test('event removal restores normal behavior',()=>{const c=createCrowdModel(grid,5);c.setEvent({type:'congestion'});c.setEvent(null);c.update(.05);assert.equal(c.agents.length,5);});
