// Reconnection lifecycle; must be paired with server-authenticated session ownership.
export function createRecoveryManager({now=()=>Date.now(),graceMs=30000}={}){
 const pending=new Map();
 return {
  disconnect(id){if(typeof id!=='string'||!id)return false;pending.set(id,now()+graceMs);return true;},
  canResume(id){const expiry=pending.get(id);return expiry!==undefined && now()<=expiry;},
  resume(id){if(!this.canResume(id))return false;pending.delete(id);return true;},
  expired(){const ids=[];for(const [id,deadline] of pending)if(now()>deadline){ids.push(id);pending.delete(id);}return ids;},
  clear(id){pending.delete(id);},
  snapshot(){return [...pending].map(([id,deadline])=>({id,deadline}));}
 };
}
