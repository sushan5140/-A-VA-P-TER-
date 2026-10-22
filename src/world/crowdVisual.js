import * as THREE from 'three';
import { createCrowdModel } from '../game/crowd.js';

export function createCrowd(scene, waypoints, count=48) {
 const model=createCrowdModel(waypoints,count);
 const geometry=new THREE.CapsuleGeometry(.19,.45,3,6);
 const material=new THREE.MeshStandardMaterial({color:'#f5c77d',roughness:.88});
 const mesh=new THREE.InstancedMesh(geometry,material,count);
 mesh.castShadow=false;
 mesh.receiveShadow=false;
 mesh.frustumCulled=false;
 scene.add(mesh);
 const dummy=new THREE.Object3D();
 function update(dt) {
  model.update(dt);
  model.agents.forEach((a,i)=>{
   dummy.position.set(a.x,.59,a.z);
   dummy.rotation.y=0;dummy.scale.set(1,1,1);
   dummy.updateMatrix();
   mesh.setMatrixAt(i,dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true;
 }
 update(0);
 return {update,reroute:model.reroute,setEvent:model.setEvent,snapshot:model.snapshot};
}
