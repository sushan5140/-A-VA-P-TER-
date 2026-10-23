import test from 'node:test';import assert from 'node:assert/strict';import {joystickAxes} from '../src/input/touch.js';
test('deadzone stops jitter',()=>assert.deepEqual(joystickAxes(2,1),{x:0,z:0}));
test('full right movement',()=>assert.deepEqual(joystickAxes(52,0),{x:1,z:0}));
test('full up movement',()=>assert.deepEqual(joystickAxes(0,-52),{x:0,z:-1}));
test('diagonal direction is normalized',()=>{const a=joystickAxes(52,52);assert.ok(Math.abs(Math.hypot(a.x,a.z)-1)<1e-9);});
test('proportional movement below edge',()=>assert.ok(Math.abs(joystickAxes(26,0).x-.5)<1e-9));
test('drag outside circle is clamped',()=>assert.deepEqual(joystickAxes(1000,0),{x:1,z:0}));
test('bad coordinates do not create NaN',()=>assert.deepEqual(joystickAxes(NaN,0),{x:0,z:0}));
