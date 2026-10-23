import * as THREE from 'three';
import { createCrowdModel } from '../game/crowd.js';
import { createCrowdClock } from '../game/crowdClock.js';

export function createCrowd(scene, waypoints, count=48) {
 const model=createCrowdModel(waypoints,count);
 const clock=createCrowdClock(30,3);
 const geometry=new THREE.CapsuleGeometry(.19,.45,3,6);
 const material=new THREE.MeshStandardMaterial({color:'#f5c77d',roughness:.88});
 const mesh=new THREE.InstancedMesh(geometry,material,count);
 mesh.castShadow=false;
 mesh.receiveShadow=false;
 mesh.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,1,0),32);
 mesh.frustumCulled=true;
 mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
 scene.add(mesh);
 const dummy=new THREE.Object3D();
 function syncVisuals(){
  for(let i=0;i<model.agents.length;i++){
   const agent=model.agents[i];
   dummy.position.set(agent.x,.59,agent.z);
   dummy.rotation.y=0;
   dummy.scale.setScalar(1);
   dummy.updateMatrix();
   mesh.setMatrixAt(i,dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate=true;
 }
 function update(dt){
  const steps=clock.advance(dt,step=>model.update(step));
  if(steps)syncVisuals();
 }
 syncVisuals();
 return {
  update,
  reroute:model.reroute,
  setEvent:model.setEvent,
  reset:()=>{clock.reset();model.reset();syncVisuals();},
  snapshot:model.snapshot
 };
}
