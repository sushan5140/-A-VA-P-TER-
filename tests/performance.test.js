import test from 'node:test';
import assert from 'node:assert/strict';
import {qualitySettings,recommendQuality,sampleFps} from '../src/performance.js';
test('low mode prioritizes lower GPU cost',()=>{const q=qualitySettings('low',2);assert.equal(q.pixelRatio,1);assert.equal(q.shadows,false);});
test('automatic mode limits high DPI',()=>assert.equal(qualitySettings('auto',3).pixelRatio,1.25));
test('five consecutive weak samples trigger downgrade',()=>assert.equal(recommendQuality(20,'auto',5),'low'));
test('isolated lag does not trigger downgrade',()=>assert.equal(recommendQuality(20,'auto',1),'auto'));
test('low mode never auto-upgrades unexpectedly',()=>assert.equal(recommendQuality(60,'low',10),'low'));
test('FPS calculations reject invalid intervals',()=>{assert.equal(sampleFps(60,1),60);assert.equal(sampleFps(12,0),0);});
