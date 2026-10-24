// Server-only, dependency-free abuse limits and packet size guard.
export function createRateLimiter({now=()=>Date.now(),windowMs=1000,max=15}={}){
 const hits=new Map();
 function allow(sessionId){
  if(typeof sessionId!=='string'||!sessionId||sessionId.length>128)return false;
  const t=now(),item=hits.get(sessionId);
  if(!item||t-item.start>=windowMs){hits.set(sessionId,{start:t,count:1});return true;}
  if(item.count>=max)return false;
  item.count++;return true;
 }
 return {allow,clear:id=>hits.delete(id),prune:()=>{const t=now();for(const [id,v] of hits)if(t-v.start>=windowMs)hits.delete(id);},size:()=>hits.size};
}
export function safeIntentEnvelope(raw,maxBytes=512){
 if(typeof raw!=='string'||Buffer.byteLength(raw,'utf8')>maxBytes)return null;
 try{
  const packet=JSON.parse(raw);
  if(!packet||typeof packet!=='object'||Array.isArray(packet))return null;
  const keys=Object.keys(packet);
  if(keys.length!==5||!['v','type','seq','x','z'].every(k=>Object.hasOwn(packet,k)))return null;
  return packet;
 }catch{return null;}
}
