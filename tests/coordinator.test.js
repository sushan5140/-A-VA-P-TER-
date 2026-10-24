import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoomCoordinator} from '../src/network/coordinator.js';

function fixture(){
 let time=1000;
 const coordinator=createRoomCoordinator({now:()=>time,codeFactory:()=> 'ABCD23'});
 return {coordinator,advance:ms=>{time+=ms;}};
}
const host='student_123',guest='safety_456';
function readyRoom(c){
 const room=c.create(host);
 assert.equal(c.join(room.code,guest).ok,true);
 assert.equal(c.choose(room.code,host,'student'),true);
 assert.equal(c.choose(room.code,guest,'safety'),true);
 assert.equal(c.ready(room.code,host,true),true);
 assert.equal(c.ready(room.code,guest,true),true);
 return room.code;
}
test('host starts synchronized match after both players ready',()=>{
 const {coordinator:c}=fixture(),code=readyRoom(c);
 assert.equal(c.start(code,guest),false);
 assert.equal(c.start(code,host),true);
 assert.equal(c.inspect(code).game.players.length,2);
});
test('validated input advances server state and rejects replay',()=>{
 const {coordinator:c}=fixture(),code=readyRoom(c);c.start(code,host);
 const p={v:1,type:'move',seq:1,x:1,z:0};
 assert.equal(c.intent(code,host,p),true);
 assert.equal(c.intent(code,host,p),false);
 const state=c.tick(code,.1);
 assert.ok(Math.abs(state.players[0].x-.6)<1e-9);
 assert.equal(c.intent(code,guest,{...p,x:99}),false);
});
test('disconnect stops movement, reconnect requires grace window',()=>{
 const {coordinator:c,advance}=fixture(),code=readyRoom(c);c.start(code,host);
 c.intent(code,guest,{v:1,type:'move',seq:0,x:1,z:0});
 assert.equal(c.disconnect(code,guest),true);
 c.tick(code,.1);
 assert.equal(c.inspect(code).game.players[1].x,0);
 advance(1000);assert.equal(c.reconnect(code,guest),true);
 assert.equal(c.inspect(code).game.players[1].connected,true);
});
test('expired grace interval blocks reconnect',()=>{
 const {coordinator:c,advance}=fixture(),code=readyRoom(c);c.start(code,host);
 c.disconnect(code,guest);advance(30001);
 assert.equal(c.reconnect(code,guest),false);
 assert.equal(c.inspect(code).game.players[1].connected,false);
});
test('no room or game rejects intent and reconnect',()=>{
 const {coordinator:c}=fixture();
 assert.equal(c.intent('NOPE99',host,{v:1,type:'move',seq:0,x:0,z:1}),false);
 assert.equal(c.reconnect('NOPE99',host),false);
});
