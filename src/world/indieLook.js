import * as THREE from 'three';
// Stylized rendering preset. Uses built-in Three.js features only.
// Keep expensive fullscreen post effects off for low-end hardware.
export function applyIndieLook(renderer,scene,quality='auto'){
 const low=quality==='low';
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=low?1.05:1.18;
 renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 scene.background=new THREE.Color('#d6e5e3');
 scene.fog=new THREE.FogExp2('#d6e5e3',low?.009:.006);
}
export function decorateLandmarks(scene,zones){
 const palette=['#f6cf83','#f08e80','#85c5c2','#9ebbe3','#b0a1d9'];
 const sharedRing=new THREE.TorusGeometry(2.08,.065,4,32);
 const accentMaterials=palette.map(color=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.78,depthWrite:false}));
 const markers=[];
 zones.forEach((zone,i)=>{
  const ring=new THREE.Mesh(sharedRing,accentMaterials[i%accentMaterials.length]);
  ring.rotation.x=-Math.PI/2;
  ring.position.set(zone.x,.095,zone.z);
  scene.add(ring);markers.push(ring);
 });
 return {update(time){markers.forEach((ring,i)=>{ring.scale.setScalar(1+.028*Math.sin(time*2+i));});},dispose(){markers.forEach(x=>scene.remove(x));sharedRing.dispose();accentMaterials.forEach(m=>m.dispose());}};
}
