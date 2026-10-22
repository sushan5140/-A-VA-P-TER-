import test from 'node:test';
import assert from 'node:assert/strict';
import {createObjectives,ROLE_MISSIONS} from '../src/game/objectives.js';
test('roles receive distinct mission routes',()=>{assert.notDeepEqual(ROLE_MISSIONS.student,ROLE_MISSIONS.safety)});
test('reaching mission zone marks task complete only once',()=>{const m=createObjectives('student');m.visit('campus');m.visit('campus');assert.equal(m.snapshot().completed,1)});
test('unrelated zones do not award progress',()=>{const m=createObjectives('student');m.visit('services');assert.equal(m.snapshot().completed,0)});
test('safety role can complete all objectives',()=>{const m=createObjectives('safety');for(const t of ROLE_MISSIONS.safety)m.visit(t.id);assert.equal(m.snapshot().completed,m.snapshot().total)});
test('reset returns missions to uncompleted',()=>{const m=createObjectives('student');m.visit('campus');m.reset();assert.equal(m.snapshot().completed,0)});
test('unknown role throws',()=>assert.throws(()=>createObjectives('villain')));
