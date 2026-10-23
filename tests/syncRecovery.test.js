import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoomSimulation} from '../src/network/roomSimulation.js';
import {createRecoveryManager} from '../src/network/recovery.js';
const players=[{id:'student_123',role:'student'},{id:'safety_456',role:'safety'}];
const packet=(seq,x,z)=>({v:1,type:'move',seq,x,z});
test('server moves based on validated intent not claimed position',()=>{
 const s=createRoomSimulation(players);
 assert.equal(s.input(players[0].id,packet(0,1,0)),true);
 s.step(.1);
 assert.equal(s.snapshot().players[0].x,.6);
 assert.equal(s.input(players[0].id,{...packet(1,1,0),position:999}),true);
 assert.ok(s.snapshot().players[0].x<1);
});
test('rejects stale and invalid direction packets',()=>{
 const s=createRoomSimulation(players);
 assert.equal(s.input(players[0].id,packet(1,1,0)),true);
 assert.equal(s.input(players[0].id,packet(1,0,1)),false);
 assert.equal(s.input(players[0].id,packet(2,10,10)),false);
});
test('disconnect halts movement and reconnect requires new intent',()=>{
 const s=createRoomSimulation(players);
 s.input(players[0].id,packet(0,1,0));s.disconnect(players[0].id);s.step(.1);
 assert.equal(s.snapshot().players[0].x,0);
 assert.equal(s.reconnect(players[0].id),true);
 s.step(.1);assert.equal(s.snapshot().players[0].x,0);
 assert.equal(s.input(players[0].id,packet(1,0,1)),true);
 s.step(.1);assert.equal(s.snapshot().players[0].z,.6);
});
test('authoritative positions are bounded',()=>{
 const s=createRoomSimulation(players);s.input(players[0].id,packet(0,1,0));
 for(let i=0;i<800;i++)s.step(.1);
 assert.equal(s.snapshot().players[0].x,28);
});
test('reconnect within grace succeeds, expiry rejects',()=>{
 let t=1000;const r=createRecoveryManager({now:()=>t,graceMs:2000});
 r.disconnect('student_123');t=2900;assert.equal(r.resume('student_123'),true);
 r.disconnect('student_123');t=5001;assert.equal(r.resume('student_123'),false);
 assert.deepEqual(r.expired(),['student_123']);
});
test('recovery does not resurrect unregistered player',()=>{
 const r=createRecoveryManager();assert.equal(r.resume('unknown'),false);
});
