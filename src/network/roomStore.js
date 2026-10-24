import {randomInt} from 'node:crypto';
import {ROOM_MAX_PLAYERS,ROLES,validateRoomStart} from './protocol.js';
// Server-side only. This module is deliberately not imported by the Vite UI.
const ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function generateCode() {
 return Array.from({length:6},()=>ALPHABET[randomInt(ALPHABET.length)]).join('');
}
export function createRoomStore({now=()=>Date.now(),codeFactory=generateCode,ttlMs=2*60*60*1000}={}) {
 const rooms=new Map();
 function get(code) {
  const room=rooms.get(code);
  if(!room)return null;
  if(now()-room.createdAt>=ttlMs){rooms.delete(code);return null;}
  return room;
 }
 function publicView(room){return {code:room.code,players:[...room.players.values()].map(({id,role,ready})=>({id,role,ready})),status:room.status,expiresAt:room.createdAt+ttlMs};}
 function create(hostId) {
  if(typeof hostId!=='string'||!/^[A-Za-z0-9_-]{8,64}$/.test(hostId))throw Error('Invalid host');
  let code;for(let i=0;i<20;i++){const candidate=codeFactory();if(/^[A-HJ-NP-Z2-9]{6}$/.test(candidate)&&!get(candidate)){code=candidate;break;}}
  if(!code)throw Error('Unable to allocate room code');
  const room={code,hostId,createdAt:now(),status:'lobby',players:new Map([[hostId,{id:hostId,role:null,ready:false}]])};
  rooms.set(code,room);return publicView(room);
 }
 function join(code,id){
  const room=get(code);
  if(!room||room.status!=='lobby')return {ok:false,error:'Room unavailable'};
  if(typeof id!=='string'||!/^[A-Za-z0-9_-]{8,64}$/.test(id))return {ok:false,error:'Invalid player'};
  if(!room.players.has(id)&&room.players.size>=ROOM_MAX_PLAYERS)return {ok:false,error:'Room full'};
  if(!room.players.has(id))room.players.set(id,{id,role:null,ready:false});
  return {ok:true,room:publicView(room)};
 }
 function choose(code,id,role) {
  const room=get(code),player=room?.players.get(id);
  if(!room||room.status!=='lobby'||!player||!ROLES.includes(role))return false;
  player.role=role;player.ready=false;return true;
 }
 function ready(code,id,value=true) {
  const room=get(code),player=room?.players.get(id);
  if(!room||room.status!=='lobby'||!player||!player.role)return false;
  player.ready=value===true;return true;
 }
 function start(code,id) {
  const room=get(code);
  if(!room||room.hostId!==id||room.status!=='lobby'||!validateRoomStart([...room.players.values()]))return false;
  room.status='playing';return true;
 }
 function leave(code,id) {
  const room=get(code);if(!room||!room.players.has(id))return false;
  room.players.delete(id);
  if(!room.players.size){rooms.delete(code);return true;}
  if(room.hostId===id)room.hostId=room.players.keys().next().value;
  return true;
 }
 return {create,join,choose,ready,start,leave,inspect:code=>{const r=get(code);return r?publicView(r):null;},size:()=>rooms.size};
}
