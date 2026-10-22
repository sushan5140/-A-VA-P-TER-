import * as THREE from 'three';

// Original low-poly prototype character. Animation uses inexpensive procedural
// transforms and can later be replaced by a rigged GLTF without changing input.
export function createPlayer() {
  const root = new THREE.Group();
  const facing = new THREE.Group();
  root.add(facing);
  const mat = color => new THREE.MeshStandardMaterial({ color, roughness: 0.82, flatShading: true });
  function part(geo, material, parent, x, y, z) {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  const torso = new THREE.Group();
  facing.add(torso);
  part(new THREE.CapsuleGeometry(.38, .62, 4, 8), mat('#3764c9'), torso, 0, 1.22, 0);
  const head = part(new THREE.SphereGeometry(.43, 12, 9), mat('#edc39d'), torso, 0, 2.06, 0);
  part(new THREE.SphereGeometry(.44, 12, 7, 0, Math.PI * 2, 0, Math.PI * .51), mat('#392e32'), torso, 0, 2.23, 0);
  // Tiny eyes keep the front direction legible at gameplay camera distance.
  const eyes = mat('#35292b');
  for (const x of [-.15, .15]) part(new THREE.SphereGeometry(.048, 6, 5), eyes, torso, x, 2.09, .398);
  const limbs = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(side * .46, 1.55, 0); torso.add(arm);
    part(new THREE.CapsuleGeometry(.12, .38, 3, 6), mat('#edc39d'), arm, side * .06, -.35, 0);
    const leg = new THREE.Group(); leg.position.set(side * .22, .75, 0); facing.add(leg);
    part(new THREE.CapsuleGeometry(.16, .36, 3, 7), mat('#25374d'), leg, 0, -.34, 0);
    part(new THREE.BoxGeometry(.38, .18, .54), mat('#f9e8c9'), leg, 0, -.68, .12);
    limbs.push({ arm, leg, side });
  }
  let phase = 0;
  let speed = 0;
  function update(dt, moving, angle) {
    const target = moving ? 1 : 0;
    speed += (target - speed) * (1 - Math.exp(-dt * 10));
    if (moving) phase += dt * 11;
    const stride = Math.sin(phase) * .48 * speed;
    for (const { arm, leg, side } of limbs) {
      leg.rotation.x = stride * side;
      arm.rotation.x = -stride * side * .7;
    }
    torso.position.y = Math.abs(Math.sin(phase)) * .07 * speed;
    torso.rotation.z = Math.sin(phase) * .04 * speed;
    const delta = Math.atan2(Math.sin(angle - facing.rotation.y), Math.cos(angle - facing.rotation.y));
    if (moving) facing.rotation.y += delta * (1 - Math.exp(-dt * 15));
  }
  return { root, update };
}
