// Street-grid-only crowd model. Edges run along x/z streets, never through buildings.
// Events may disable one street edge or slow crowd movement without trapping agents.
export function createCrowdModel(waypoints, count=48, seed=41) {
  let rng=seed>>>0;
  const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
  const points=waypoints.slice(0,9).map(([x,z])=>({x,z}));
  const edges=points.map((p,i)=>points.map((q,j)=>({j,axisAligned:Math.abs(p.x-q.x)<.01||Math.abs(p.z-q.z)<.01,d:Math.hypot(p.x-q.x,p.z-q.z)})).filter(e=>e.j!==i&&e.axisAligned&&e.d<=18.1).map(e=>e.j));
  const agents=Array.from({length:count},(_,id)=>{
    const node=Math.floor(random()*points.length);
    return {id,node,x:points[node].x,z:points[node].z,target:node,state:'wait',wait:.3+random()*2,speed:1+random()*.7};
  });
  let closedEdge=null, slowdown=1;
  const edgeKey=(a,b)=>[Math.min(a,b),Math.max(a,b)].join('-');
  function chooseTarget(a) {
    const options=edges[a.node].filter(j=>edgeKey(a.node,j)!==closedEdge);
    if(!options.length){a.state='wait';a.wait=.5;return;}
    a.target=options[Math.floor(random()*options.length)];
    a.state='travel';
  }
  function update(delta) {
    const dt=Math.max(0,Math.min(Number.isFinite(delta)?delta:0,.05));
    for(const a of agents){
      if(a.state!=='travel'){
        a.wait-=dt;
        if(a.wait<=0)chooseTarget(a);
        continue;
      }
      const to=points[a.target], dx=to.x-a.x,dz=to.z-a.z,dist=Math.hypot(dx,dz);
      if(dist<.14){a.x=to.x;a.z=to.z;a.node=a.target;a.state=random()<.3?'gather':'wait';a.wait=.5+random()*2.5;continue;}
      const step=Math.min(dist,a.speed*slowdown*dt);
      a.x+=dx/dist*step;a.z+=dz/dist*step;
    }
  }
  function reroute() {
    for(const a of agents){
      // Finish the current edge safely rather than teleport from mid-street.
      if(a.state!=='travel'){a.state='wait';a.wait=.1+random()*.8;}
    }
  }
  function setEvent(event) {
    closedEdge=event?.type==='closure'?'1-4':null;
    slowdown=event?.type==='congestion'?.4:1;
    reroute();
  }
  return {agents,update,reroute,setEvent,snapshot:()=>agents.map(({id,x,z,state})=>({id,x,z,state}))};
}
