import {createScoring} from './scoring.js';
import {ROLE_MISSIONS} from './objectives.js';
// Comparable solo performance scenarios for both roles. Not real playtest data.
export function evaluateRoleParity(){
 const scores={};
 for(const role of ['student','safety']){
  const scoring=createScoring(role);
  for(const task of ROLE_MISSIONS[role]) scoring.mission(task.id);
  for(let second=0;second<30;second++)scoring.access(1,true);
  for(const type of ['closure','congestion','emergency'])scoring.respond(type,'acknowledge');
  scores[role]=scoring.snapshot().total;
 }
 return {scores,parity:scores.student===scores.safety,maximum:120};
}
export function evaluateObjectiveIntegrity(){
 return Object.entries(ROLE_MISSIONS).every(([role,tasks])=>tasks.length===3&&new Set(tasks.map(t=>t.id)).size===3&&
   tasks.every(t=>typeof t.label==='string'&&t.label.length>0)) ;
}
