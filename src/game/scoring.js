// Role-specific, deterministic scoring; only recorded, demonstrated actions
// earn points. No injury, arrests, suppression or fictional outcomes score.
export const SCORE_WEIGHTS=Object.freeze({mission:20, safeAccess:10, eventResponse:10});
export function createScoring(role){
 if(!['student','safety'].includes(role))throw new Error('Invalid scoring role');
 const completed=new Set(),responded=new Set();let accessSeconds=0;
 return {
  mission(zone){completed.add(zone);},
  access(dt,active){if(active&&Number.isFinite(dt)&&dt>0)accessSeconds+=Math.min(dt,1);},
  respond(eventId,action){if(eventId&&action==='acknowledge')responded.add(eventId);},
  reset(){completed.clear();responded.clear();accessSeconds=0;},
  snapshot(){
   const missions=Math.min(completed.size,3)*SCORE_WEIGHTS.mission;
   const access=Math.min(30,Math.floor(accessSeconds/10)*SCORE_WEIGHTS.safeAccess);
   const events=Math.min(30,responded.size*SCORE_WEIGHTS.eventResponse);
   return {role,missions,access,events,total:missions+access+events,completed:completed.size};
  }
 };
}
