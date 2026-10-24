import test from 'node:test';
import assert from 'node:assert/strict';
import {validRoomCode,validPlayerIntent,validateRoomStart,createSequenceGuard,ROOM_MAX_PLAYERS} from '../src/network/protocol.js';
const players=[{id:'player_100',role:'student',ready:true},{id:'player_200',role:'safety',ready:true}];
test('room invite code has strict alphabet and length',()=>{assert.equal(validRoomCode('ABC239'),true);assert.equal(validRoomCode('abc239'),false);assert.equal(validRoomCode('ABCI29'),false);});
test('both roles and ready state required',()=>{assert.equal(validateRoomStart(players),true);assert.equal(validateRoomStart([players[0],{...players[1],ready:false}]),false);assert.equal(validateRoomStart([players[0],{...players[1],role:'student'}]),false);});
test('duplicate IDs and room limit rejected',()=>{assert.equal(validateRoomStart([players[0],{...players[1],id:players[0].id}]),false);assert.equal(validateRoomStart(Array.from({length:ROOM_MAX_PLAYERS+1},(_,i)=>({...players[i%2],id:'player_'+(100+i)}))),false);});
test('intents reject fabricated state and invalid motion',()=>{const p={v:1,type:'move',seq:0,x:0.6,z:0.8};assert.equal(validPlayerIntent(p),true);assert.equal(validPlayerIntent({...p,x:999}),false);assert.equal(validPlayerIntent({...p,seq:-1}),false);assert.equal(validPlayerIntent({...p,type:'score'}),false);assert.equal(validPlayerIntent({...p,x:NaN}),false);});
test('duplicate or outdated packet rejected',()=>{const g=createSequenceGuard();const p={v:1,type:'move',seq:2,x:0,z:1};assert.equal(g.accept('player_100',p),true);assert.equal(g.accept('player_100',p),false);assert.equal(g.accept('player_100',{...p,seq:1}),false);assert.equal(g.accept('player_100',{...p,seq:3}),true);});
