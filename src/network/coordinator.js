import {createRoomStore} from './roomStore.js';
import {createRoomSimulation} from './roomSimulation.js';
import {createRecoveryManager} from './recovery.js';

// Testable authoritative room coordinator. The caller must authenticate each
// session and resolve actor IDs server-side, never trust IDs in network payloads.
export function createRoomCoordinator({now=()=>Date.now(),codeFactory}={}){
 const store=createRoomStore({now,codeFactory});
 const games=new Map();
 const recovery=createRecoveryManager({now});
 function create(hostId){return store.create(hostId);}
 function join(code,id){return store.join(code,id);}
 function choose(code,id,role){return store.choose(code,id,role);}
 function ready(code,id,value){return store.ready(code,id,value);}
 function start(code,hostId){
  const room=store.inspect(code);
  if(!room||!store.start(code,hostId))return false;
  games.set(code,createRoomSimulation(room.players));
  return true;
 }
 function intent(code,id,packet){
  return games.get(code)?.input(id,packet)??false;
 }
 function disconnect(code,id){
  const game=games.get(code);
  if(!game||!game.disconnect(id))return false;
  recovery.disconnect(code+':'+id);
  return true;
 }
 function reconnect(code,id){
  const key=code+':'+id,game=games.get(code);
  if(!game||!recovery.canResume(key)||!game.reconnect(id))return false;
  recovery.resume(key);return true;
 }
 function tick(code,dt){
  const game=games.get(code);
  if(!game)return null;
  game.step(dt);
  for(const key of recovery.expired()){
   // Timeout keeps the actor disconnected; no arbitrary guest rejoin.
   if(key.startsWith(code+':'))game.disconnect(key.slice(code.length+1));
  }
  return game.snapshot();
 }
 function inspect(code){return {room:store.inspect(code),game:games.get(code)?.snapshot()??null};}
 return {create,join,choose,ready,start,intent,disconnect,reconnect,tick,inspect};
}
