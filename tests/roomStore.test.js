import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoomStore} from '../src/network/roomStore.js';
const idA='student_123',idB='safety_456';
function fixture(){return createRoomStore({codeFactory:()=> 'ABCD23'});}
test('host creates private room and valid invite code',()=>{const s=fixture();const r=s.create(idA);assert.equal(r.code,'ABCD23');assert.equal(r.players.length,1);assert.equal(r.status,'lobby');});
test('joining a room requires code and prevents duplicates',()=>{const s=fixture();s.create(idA);assert.equal(s.join('ZZZZ99',idB).ok,false);assert.equal(s.join('ABCD23',idB).ok,true);s.join('ABCD23',idB);assert.equal(s.inspect('ABCD23').players.length,2);});
test('only host can start when both roles ready',()=>{const s=fixture();s.create(idA);s.join('ABCD23',idB);s.choose('ABCD23',idA,'student');s.choose('ABCD23',idB,'safety');assert.equal(s.start('ABCD23',idA),false);s.ready('ABCD23',idA);s.ready('ABCD23',idB);assert.equal(s.start('ABCD23',idB),false);assert.equal(s.start('ABCD23',idA),true);assert.equal(s.join('ABCD23','third_123').ok,false);});
test('switching role cancels readiness',()=>{const s=fixture();s.create(idA);s.choose('ABCD23',idA,'student');s.ready('ABCD23',idA);s.choose('ABCD23',idA,'safety');assert.equal(s.inspect('ABCD23').players[0].ready,false);});
test('host handoff after leave and empty room cleanup',()=>{const s=fixture();s.create(idA);s.join('ABCD23',idB);s.leave('ABCD23',idA);assert.equal(s.inspect('ABCD23').players[0].id,idB);s.leave('ABCD23',idB);assert.equal(s.inspect('ABCD23'),null);});
test('rooms expire and reject late joins',()=>{let t=0;const s=createRoomStore({now:()=>t,ttlMs:1000,codeFactory:()=> 'ABCD23'});s.create(idA);t=1000;assert.equal(s.join('ABCD23',idB).ok,false);});
test('room limit enforced',()=>{const s=fixture();s.create(idA);for(let i=1;i<8;i++)assert.equal(s.join('ABCD23','member_'+i+'xxx').ok,true);assert.equal(s.join('ABCD23','extra_999').ok,false);});
