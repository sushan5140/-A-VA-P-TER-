import test from 'node:test';
import assert from 'node:assert/strict';
import {createCrowdClock} from '../src/game/crowdClock.js';
test('60FPS rendering gives 30 crowd steps per second',()=>{
 const c=createCrowdClock(30);let steps=0;
 for(let i=0;i<60;i++)c.advance(1/60,()=>steps++);
 assert.equal(steps,30);
});
test('30FPS rendering gives one step each frame',()=>{
 const c=createCrowdClock(30);let steps=0;
 for(let i=0;i<30;i++)c.advance(1/30,()=>steps++);
 assert.equal(steps,30);
});
test('frame spikes are bounded to prevent runaway catchup',()=>{
 const c=createCrowdClock(30,3);let steps=0;c.advance(8,()=>steps++);
 assert.equal(steps,3);
});
test('invalid frame time never advances',()=>{
 const c=createCrowdClock();assert.equal(c.advance(-1,()=>assert.fail()),0);
 assert.equal(c.advance(NaN,()=>assert.fail()),0);
});
test('reset clears pending partial frame',()=>{
 const c=createCrowdClock();c.advance(1/60,()=>{});c.reset();
 assert.equal(c.advance(1/60,()=>assert.fail()),0);
});
test('invalid configuration rejected',()=>{
 assert.throws(()=>createCrowdClock(0));
 assert.throws(()=>createCrowdClock(30,0));
});
