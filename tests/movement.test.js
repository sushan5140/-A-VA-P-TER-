import test from 'node:test';import assert from 'node:assert/strict';
import {stepMotion,cursorDirection} from '../src/game/movement.js';
test('accelerates rather than snapping to max speed',()=>{const v=stepMotion({x:0,z:0},{x:1,z:0},.016);assert.ok(v.x>0&&v.x<6)});
test('releases with braking and reaches rest',()=>{let v={x:6,z:0};for(let i=0;i<90;i++)v=stepMotion(v,{x:0,z:0},.016);assert.ok(v.x<.001)});
test('diagonal is not faster than cardinal',()=>{let v={x:0,z:0};for(let i=0;i<60;i++)v=stepMotion(v,{x:1,z:1},.016);assert.ok(Math.hypot(v.x,v.z)<=6.001)});
test('analog input retains half speed',()=>{let v={x:0,z:0};for(let i=0;i<80;i++)v=stepMotion(v,{x:.5,z:0},.016);assert.ok(v.x>2.9&&v.x<3.01)});
test('mouse cursor stops within arrival radius',()=>assert.deepEqual(cursorDirection({x:0,z:0},{x:.1,z:.1}),{x:0,z:0}));
test('mouse movement eases near target',()=>{const near=cursorDirection({x:0,z:0},{x:1,z:0});const far=cursorDirection({x:0,z:0},{x:10,z:0});assert.ok(near.x>0&&near.x<far.x)});
test('invalid mouse target does not create NaN motion',()=>assert.deepEqual(cursorDirection({x:0,z:0},{x:NaN,z:0}),{x:0,z:0}));
