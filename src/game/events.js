export const EVENTS=Object.freeze([
 {type:'closure',title:'Temporary street closure',detail:'One street connection is closed; pedestrians use alternate streets.'},
 {type:'congestion',title:'Busy pedestrian crossing',detail:'Foot traffic slows temporarily near a junction.'},
 {type:'emergency',title:'Emergency access priority',detail:'Keep public-service access clear while the crowd reorganizes.'},
]);
export function createEventDirector(interval=30,duration=12){
 let elapsed=0,activeElapsed=0,index=0,active=null;
 return {
  update(dt) {
   dt=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.05));
   if(active){
    activeElapsed+=dt;
    if(activeElapsed>=duration){active=null;activeElapsed=0;elapsed=0;return {changed:true,event:null};}
   } else {
    elapsed+=dt;
    if(elapsed>=interval){active=EVENTS[index%EVENTS.length];index++;elapsed=0;activeElapsed=0;return {changed:true,event:active};}
   }
   return {changed:false,event:active};
  },
  reset(){elapsed=0;activeElapsed=0;index=0;active=null;},
  snapshot(){return active;},
 };
}
