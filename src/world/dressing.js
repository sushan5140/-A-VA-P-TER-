import * as THREE from 'three';

// Original low-poly decorative art. Non-interactive: collision and routing
// remain exclusively controlled by the world blockout.
export function addParisDressing(scene, buildings) {
  const materials = new Map();
  function material(color) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.84, metalness: 0.02 }));
    return materials.get(color);
  }
  const cube = new THREE.BoxGeometry(1, 1, 1);
  function box(x, y, z, w, h, d, color, shadows = false) {
    const m = new THREE.Mesh(cube, material(color));
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = shadows;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }
  // Decorative mansard rooftops / cornices, window grids and restrained
  // French-inspired details. Shapes intentionally avoid registered walk lanes.
  for (const [x, z, w, d, h, color] of buildings) {
    box(x, h + .42, z, w * .88, .55, d * .88, '#4e6277', true);
    box(x, h + .76, z, w * .63, .18, d * .63, '#708495');
    const floors = Math.max(2, Math.floor(h / 2));
    for (let floor = 0; floor < floors; floor++) {
      const y = 1.3 + floor * 1.75;
      if (y > h - .65) continue;
      for (const side of [-1, 1]) {
        for (let i = -1; i <= 1; i++) {
          const wx = x + (i * Math.min(1.5, w / 4));
          const wz = z + side * (d / 2 + .06);
          box(wx, y, wz, .76, 1, .1, '#f4e5ce');
          box(wx, y, wz + side * .07, .58, .79, .09, '#6a97ad');
          box(wx, y, wz + side * .14, .07, .83, .05, '#ebddbe');
          box(wx, y + .43, wz + side * .16, .7, .06, .07, '#ebddbe');
        }
      }
    }
    box(x, .75, z + d / 2 + .065, 1.35, 1.5, .09, '#795f53');
    // Awning with curved-free low-poly silhouette; no external textures.
    box(x, 1.9, z + d / 2 + .5, 2.65, .12, .85, '#f07162');
  }
  // Plaza fountain at a deliberately non-blocking scale: leave centre open
  // for the player's original spawn. Place at the NE edge of the plaza.
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(.65, .73, .24, 10), material('#789ab1'));
  basin.position.set(4.2, .19, 4.2);
  scene.add(basin);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(.52, .52, .025, 10), material('#87cadd'));
  water.position.set(4.2, .32, 4.2);
  scene.add(water);
  // Lamp posts in setbacks near façades, not at junction centres.
  for (const [x,z] of [[-22,-20],[22,-20],[-22,20],[22,20],[-5,20],[5,-20]]) {
    box(x, 1.4, z, .12, 2.8, .12, '#394b5d');
    box(x, 2.78, z, .52, .22, .52, '#f9e8c9');
    box(x, 2.98, z, .65, .1, .65, '#394b5d');
  }
  // Thin, readable zone flags stay within safe spaces; gameplay markers
  // beneath these decorations remain unchanged.
  for (const [x,z,color] of [[-18,-16,'#3764c9'],[17,16,'#5d9477'],[0,0,'#f07162']]) {
    box(x + 2.5, 1.1, z, .1, 2.2, .1, '#394b5d');
    box(x + 2.96, 1.75, z, .85, .55, .05, color);
  }
}
