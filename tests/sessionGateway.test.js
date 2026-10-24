import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoomCoordinator} from '../src/network/coordinator.js';
import {createSessionGateway} from '../src/network/sessionGateway.js';
const host='student_123',guest='safety_456';
function fixture(){
 let time=0;const c=createRoomCoordinator({now:()=>time,codeFactory:()=> 'ABCD23'});
 const code=c.create(host).code;c.join(code,guest);
 for(const [id,role] of [[host,'student'],[guest,'safety']]){c.choose(code,id,role);c.ready(code,id,true);}
 c.start(code,host);
 const gateway=createSessionGateway(c,{now:()=>time,maxMessages:2});
 return {c,code,gateway,advance:ms=>{time+=ms;}};
}
const packet=(seq)=>JSON.stringify({v:1,type:'move',seq,x:1,z:0});
test('gateway connects intent to issued identity, no caller player ID',()=>{
 const {c,code,gateway}=fixture();
 const token=gateway.issue(code,host);assert.ok(token);
 assert.equal(gateway.move(token,packet(0)),true);
 c.tick(code,.1);
 assert.ok(c.inspect(code).game.players.find(p=>p.id===host).x>0);
 assert.equal(gateway.move('forged-token',packet(1)),false);
});
test('rate and schema guards reject floods and extra data',()=>{
 const {code,gateway}=fixture();const t=gateway.issue(code,host);
 assert.equal(gateway.move(t,packet(0)),true);
 assert.equal(gateway.move(t,packet(1)),true);
 assert.equal(gateway.move(t,packet(2)),false);
 assert.equal(gateway.move(t+'x',packet(3)),false);
});
test('disconnected player can resume with rotated credential',()=>{
 const {code,gateway}=fixture();const t=gateway.issue(code,guest);
 assert.equal(gateway.disconnect(t),true);
 const next=gateway.resume(t);assert.ok(next);assert.notEqual(next,t);
 assert.equal(gateway.move(t,packet(0)),false);
 assert.equal(gateway.move(next,packet(0)),true);
});
test('resume expires after recovery deadline',()=>{
 const {code,gateway,advance}=fixture();const t=gateway.issue(code,guest);
 gateway.disconnect(t);advance(30001);
 assert.equal(gateway.resume(t),null);
});
test('revoked sessions cannot continue',()=>{
 const {code,gateway}=fixture();const t=gateway.issue(code,guest);
 assert.equal(gateway.revoke(t),true);
 assert.equal(gateway.move(t,packet(0)),false);
});
test('unknown member never receives a credential',()=>{
 const {code,gateway}=fixture();assert.equal(gateway.issue(code,'stranger_000'),null);
});
