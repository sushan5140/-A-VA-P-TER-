import {createSequenceGuard,validPlayerIntent} from './protocol.js';
// Server-side authoritative movement core; transport-independent.
export function createRoomSimulation(players,{speed=6,bounds=28,ttlSeconds=180}={}){
 const guard=createSequenceGuard(), actors=new Map();
 for(const p of players){if(actors.has(p.id))throw Error('Duplicate actor');actors.set(p.id,{id:p.id,role:p.role,x:0,z:0,dx:0,dz:0,connected:true});}
 let tick=0,remaining=ttlSeconds,phase='playing';
 function input(id,packet){
  const actor=actors.get(id);
  if(phase!=='playing'||!actor?.connected||!validPlayerIntent(packet)||!guard.accept(id,packet))return false;
  actor.dx=packet.x;actor.dz=packet.z;return true;
 }
 function step(dt){
  if(phase!=='playing'||!Number.isFinite(dt)||dt<=0)return;
  const delta=Math.min(dt,.1);remaining=Math.max(0,remaining-delta);
  for(const actor of actors.values()){
   if(!actor.connected)continue;
   actor.x=Math.max(-bounds,Math.min(bounds,actor.x+actor.dx*speed*delta));
   actor.z=Math.max(-bounds,Math.min(bounds,actor.z+actor.dz*speed*delta));
  }
  tick++;
  if(remaining===0)phase='results';
 }
 function disconnect(id){const a=actors.get(id);if(!a)return false;a.connected=false;a.dx=0;a.dz=0;return true;}
 function reconnect(id){const a=actors.get(id);if(!a||phase==='results')return false;a.connected=true;a.dx=0;a.dz=0;return true;}
 function snapshot(){return {tick,phase,remaining,players:[...actors.values()].map(({id,role,x,z,connected})=>({id,role,x,z,connected}))};}
 return {input,step,disconnect,reconnect,snapshot};
}
