import * as THREE from 'three';

// Original fictional Paris-inspired blockout. No real protest routes or live geodata.
export const ZONES = Object.freeze([
  { id: 'campus', name: 'Campus Gate', x: -18, z: -16, color: '#3764c9' },
  { id: 'plaza', name: 'Place des Étudiants', x: 0, z: 0, color: '#f07162' },
  { id: 'services', name: 'Civic Services', x: 17, z: 16, color: '#5d9477' },
  { id: 'east-route', name: 'Rue de l’Est', x: 17, z: -12, color: '#f5c77d' },
  { id: 'west-route', name: 'Rue de l’Ouest', x: -17, z: 12, color: '#f5c77d' },
]);
export const WAYPOINTS = Object.freeze([
  [-18,-16],[-18,0],[-18,16],[0,-16],[0,0],[0,16],[18,-16],[18,0],[18,16],
  [-8,-8],[-8,8],[8,-8],[8,8],
]);
export const SPAWN = Object.freeze({ x: 0, z: 0 });
const bounds = 29;
const obstacles = [];
const mat = color => new THREE.MeshStandardMaterial({ color, roughness: .92 });

export function createWorld(scene) {
  function block(w,h,d,color,x,y,z,solid=false) {
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));
    m.position.set(x,y,z);
    m.castShadow=h>.4;
    m.receiveShadow=true;
    scene.add(m);
    if(solid)obstacles.push({x,z,halfW:w/2+.42,halfD:d/2+.42});
    return m;
  }
  block(64,.25,64,'#a5bea0',0,-.22,0);
  // Four connected arterial streets and a central gathering square.
  for(const x of [-18,0,18]) block(6,.045,60,'#707f8c',x,-.045,0);
  for(const z of [-16,0,16]) block(60,.045,6,'#707f8c',0,-.041,z);
  block(12,.065,12,'#dbcfb4',0,.012,0);
  for(const x of [-18,0,18]) {
    for(const z of [-16,0,16]) {
      if (x===0 && z===0) continue;
      block(5.5,.055,.18,'#e8e0d3',x,.009,z-3);
      block(5.5,.055,.18,'#e8e0d3',x,.009,z+3);
    }
  }
  // Campus west, civic service east, shops/residences around the diagonal.
  const buildings=[
    [-26,-25,8,6,5,'#b0c1d8'],[-9,-26,8,5,6,'#eed5b4'],
    [9,-26,8,5,5,'#e6bcb3'],[26,-25,6,7,7,'#e4d8bc'],
    [-26,-7,7,6,8,'#b3c7ca'],[-9,-8,7,6,5,'#e5c7a0'],
    [9,-8,7,6,5,'#f1d2b4'],[26,-7,7,6,6,'#bec4d8'],
    [-26,8,7,5,5,'#d8c4b0'],[-9,8,7,5,6,'#efd9af'],
    [9,8,7,5,7,'#e0bfb5'],[26,8,7,5,5,'#b9c9b1'],
    [-26,25,8,6,5,'#e8bfae'],[-9,25,8,5,7,'#c6cbd1'],
    [9,25,8,5,6,'#edc6ab'],[26,25,7,6,8,'#d8c4aa'],
  ];
  for(const [x,z,w,d,h,color] of buildings){
    block(w,h,d,color,x,h/2,z,true);
    block(w+.35,.25,d+.35,'#647484',x,h+.14,z);
    for(let i=-1;i<=1;i++){
      block(.65,.85,.07,'#607f9b',x+i*1.4,h*.63,z-d/2-.045);
      block(.65,.85,.07,'#607f9b',x+i*1.4,h*.63,z+d/2+.045);
    }
  }
  // Non-blocking markers deliberately indicate fictional gameplay zones.
  for(const zone of ZONES){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.9,.11,6,30),mat(zone.color));
    ring.rotation.x=-Math.PI/2;ring.position.set(zone.x,.07,zone.z);scene.add(ring);
  }
  // Decorative planters and street trees in non-traversal plots.
  for (const [x,z] of [[-22,-11],[-22,11],[22,-11],[22,11],[-5,22],[5,-22]]){
    block(.55,.45,.55,'#c6a48a',x,.22,z);
    const t=new THREE.Mesh(new THREE.CylinderGeometry(.12,.17,1.2,6),mat('#6d594b'));
    t.position.set(x,1.05,z);scene.add(t);
    const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.85,0),mat('#628d70'));
    leaf.position.set(x,2,z);leaf.castShadow=true;scene.add(leaf);
  }
  // Purposeful open route connectors, no barricades yet (gameplay comes in L2).
  function isBlocked(x,z,radius=.4){
    if(Math.abs(x)>bounds-radius||Math.abs(z)>bounds-radius)return true;
    return obstacles.some(o=>Math.abs(x-o.x)<o.halfW+radius-.4&&Math.abs(z-o.z)<o.halfD+radius-.4);
  }
  return {isBlocked,zones:ZONES,waypoints:WAYPOINTS,spawn:SPAWN,bounds};
}
