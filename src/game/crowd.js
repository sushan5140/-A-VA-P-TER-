// Deterministic, lightweight fictional pedestrian simulation.
// Connected public streets only: no real-world route data.
export function createCrowdModel(waypoints, count=48, seed=41) {
  let rng=seed>>>0;
  const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
  const points=waypoints.map(([x,z])=>({x,z}));
  const agents=Array.from({length:count},(_,id)=>{
    const node=Math.floor(random()*points.length);
    return {id,x:points[node].x,z:points[node].z,target:node,state:'wait',wait:random()*2+0.3,speed:1+random()*.7};
  });
  function nearest(p) {
    return points.map((q,i)=>({i,d:Math.hypot(p.x-q.x,p.z-q.z)})).filter(x=>x.d>0.01&&x.d<=19).sort((a,b)=>a.d-b.d).slice(0,5);
  }
  function chooseTarget(a) {
    const possibilities=nearest(a);
    if(!possibilities.length)return;
    a.target=possibilities[Math.floor(random()*possibilities.length)].i;
    a.state='travel';
  }
  function update(dt) {
    dt=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.05));
    for(const a of agents) {
      if(a.state==='wait'||a.state==='gather') {
        a.wait-=dt;
        if(a.wait<=0)chooseTarget(a);
        continue;
      }
      const to=points[a.target];const dx=to.x-a.x,dz=to.z-a.z,dist=Math.hypot(dx,dz);
      if(dist<.14){a.x=to.x;a.z=to.z;a.state=random()<.3?'gather':'wait';a.wait=.5+random()*2.5;continue;}
      const step=Math.min(dist,a.speed*dt);a.x+=dx/dist*step;a.z+=dz/dist*step;
    }
  }
  function reroute() { for(const a of agents) {a.state='wait';a.wait=.1+random()*.8;} }
  return {agents,update,reroute,snapshot:()=>agents.map(({id,x,z,state})=>({id,x,z,state}))};
}
