import {randomBytes,timingSafeEqual,createHash} from 'node:crypto';
import {createRateLimiter,safeIntentEnvelope} from './abuseGuards.js';
// Server-side session gateway: caller must obtain verified identity at join time.
// Never accept client-provided actor IDs for gameplay messages.
export function createSessionGateway(coordinator,{now=()=>Date.now(),maxMessages=15}={}){
 const sessions=new Map();
 const limiter=createRateLimiter({now,max:maxMessages});
 const digest=value=>createHash('sha256').update(value).digest();
 function issue(roomCode,actorId){
  if(!coordinator.inspect(roomCode).room?.players.some(p=>p.id===actorId))return null;
  const token=randomBytes(32).toString('base64url');
  const key=digest(token).toString('hex');
  sessions.set(key,{roomCode,actorId});
  return token;
 }
 function lookup(token){
  if(typeof token!=='string'||token.length>128)return null;
  const key=digest(token).toString('hex');
  // Fixed size hash keys; compare with timing-safe equality before exposing state.
  for(const [stored,session] of sessions){
   if(timingSafeEqual(Buffer.from(stored,'hex'),Buffer.from(key,'hex')))return {key,session};
  }
  return null;
 }
 function move(token,raw){
  const entry=lookup(token);if(!entry)return false;
  if(!limiter.allow(entry.key))return false;
  const packet=safeIntentEnvelope(raw);if(!packet)return false;
  return coordinator.intent(entry.session.roomCode,entry.session.actorId,packet);
 }
 function disconnect(token){
  const entry=lookup(token);if(!entry)return false;
  return coordinator.disconnect(entry.session.roomCode,entry.session.actorId);
 }
 function resume(token){
  const entry=lookup(token);if(!entry)return null;
  if(!coordinator.reconnect(entry.session.roomCode,entry.session.actorId))return null;
  // Rotate the secret; invalidate old credential immediately.
  sessions.delete(entry.key);limiter.clear(entry.key);
  return issue(entry.session.roomCode,entry.session.actorId);
 }
 function revoke(token){const entry=lookup(token);if(!entry)return false;sessions.delete(entry.key);limiter.clear(entry.key);return true;}
 return {issue,move,disconnect,resume,revoke,activeCount:()=>sessions.size};
}
