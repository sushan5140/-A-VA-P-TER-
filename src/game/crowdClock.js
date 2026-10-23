// Fixed-frequency simulation clock to keep crowd updates independent of
// rendering FPS. An accumulator preserves partial time across frames.
export function createCrowdClock(hz=30,maxSteps=3) {
 if (!Number.isFinite(hz)||hz<=0||!Number.isInteger(maxSteps)||maxSteps<1) throw new Error('Invalid crowd clock');
 const step=1/hz;
 let pending=0;
 return {
  advance(dt,callback) {
   if(!Number.isFinite(dt)||dt<=0)return 0;
   pending+=Math.min(dt,.1);
   let steps=0;
   while(pending+1e-9>=step&&steps<maxSteps){
    callback(step);pending-=step;steps++;
   }
   // Avoid a backlog causing sustained catch-up on low-end devices.
   if(steps===maxSteps)pending=Math.min(pending,step);
   return steps;
  },
  reset(){pending=0;},
  get step(){return step;}
 };
}
