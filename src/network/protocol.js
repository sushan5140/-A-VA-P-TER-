// L4.P1 transport-independent multiplayer contract.
// Client packets are untrusted intent, never authoritative scores or world state.
export const PROTOCOL_VERSION = 1;
export const ROOM_MAX_PLAYERS = 8;
export const CLIENT_TICK_HZ = 10;
export const ROLES = Object.freeze(['student','safety']);
export function validRoomCode(code) {
 return typeof code==='string' && /^[A-Z2-9]{6}$/.test(code);
}
export function validPlayerIntent(packet) {
 if(!packet||typeof packet!=='object'||Array.isArray(packet))return false;
 if(packet.v!==PROTOCOL_VERSION||packet.type!=='move'||!Number.isSafeInteger(packet.seq)||packet.seq<0)return false;
 if(!Number.isFinite(packet.x)||!Number.isFinite(packet.z))return false;
 return Math.hypot(packet.x,packet.z)<=1.000001;
}
export function validateRoomStart(players) {
 if(!Array.isArray(players)||players.length<2||players.length>ROOM_MAX_PLAYERS)return false;
 const ids=new Set();
 for(const player of players) {
  if(!player||typeof player.id!=='string'||!/^[-a-zA-Z0-9_]{8,64}$/.test(player.id)||ids.has(player.id))return false;
  if(!ROLES.includes(player.role)||player.ready!==true)return false;
  ids.add(player.id);
 }
 return players.some(p=>p.role==='student')&&players.some(p=>p.role==='safety');
}
export function createSequenceGuard() {
 const last=new Map();
 return {
  accept(playerId,packet) {
   if(typeof playerId!=='string'||!validPlayerIntent(packet))return false;
   if(packet.seq<=(last.get(playerId)??-1))return false;
   last.set(playerId,packet.seq);return true;
  },
  reset(){last.clear();}
 };
}
