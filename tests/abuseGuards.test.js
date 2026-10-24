import test from 'node:test';
import assert from 'node:assert/strict';
import {createRateLimiter,safeIntentEnvelope} from '../src/network/abuseGuards.js';
test('rate limiter caps per session and resets next window',()=>{
 let t=0;const r=createRateLimiter({now:()=>t,max:2});
 assert.equal(r.allow('session_a'),true);assert.equal(r.allow('session_a'),true);
 assert.equal(r.allow('session_a'),false);
 assert.equal(r.allow('session_b'),true);t=1000;assert.equal(r.allow('session_a'),true);
});
test('unbounded or invalid session identifiers rejected',()=>{
 const r=createRateLimiter();assert.equal(r.allow(''),false);assert.equal(r.allow('x'.repeat(129)),false);
});
test('cleanup prunes old entries',()=>{
 let t=0;const r=createRateLimiter({now:()=>t});r.allow('session');t=1500;r.prune();assert.equal(r.size(),0);
});
test('small valid envelope parsed',()=>{
 assert.deepEqual(safeIntentEnvelope('{"v":1,"type":"move","seq":0,"x":0,"z":1}'),{v:1,type:'move',seq:0,x:0,z:1});
});
test('malformed, oversized and extra-field packets rejected',()=>{
 assert.equal(safeIntentEnvelope('{'),null);
 assert.equal(safeIntentEnvelope('a'.repeat(513)),null);
 assert.equal(safeIntentEnvelope('{"v":1,"type":"move","seq":0,"x":0,"z":1,"score":999}'),null);
});
