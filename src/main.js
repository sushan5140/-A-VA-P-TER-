import * as THREE from 'three';
import './style.css';
import { createWorld, SPAWN } from './world/paris.js';

const mount = document.querySelector('#game');
const positionText = document.querySelector('#coords');
const errorText = document.querySelector('#error');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dbe7ed');
scene.fog = new THREE.Fog('#dbe7ed', 40, 100);

const camera = new THREE.OrthographicCamera(-14, 14, 8, -8, 0.1, 180);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight('#fffaf0', '#778a9a', 2.1));
const sun = new THREE.DirectionalLight('#fff1d3', 2.9);
sun.position.set(-10, 18, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -28;
sun.shadow.camera.right = 28;
sun.shadow.camera.top = 28;
sun.shadow.camera.bottom = -28;
scene.add(sun);

const world = createWorld(scene);

const player = new THREE.Group();
const coat = new THREE.Mesh(new THREE.CapsuleGeometry(.43, .9, 5, 8), new THREE.MeshStandardMaterial({ color: '#3764c9', roughness: .75 }));
coat.position.y = 1;
coat.castShadow = true;
player.add(coat);
const head = new THREE.Mesh(new THREE.SphereGeometry(.43, 12, 8), new THREE.MeshStandardMaterial({ color: '#f0c59c', roughness: .85 }));
head.position.y = 1.91;
head.castShadow = true;
player.add(head);
const hair = new THREE.Mesh(new THREE.SphereGeometry(.44, 10, 6, 0, Math.PI * 2, 0, Math.PI * .5), new THREE.MeshStandardMaterial({ color: '#382d31' }));
hair.position.y = 2.09;
player.add(hair);
player.position.set(SPAWN.x, 0, SPAWN.z);
scene.add(player);

const keys = new Set();
window.addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
  keys.add(e.key.toLowerCase());
});
window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());

function blocked(x, z) { return world.isBlocked(x, z); }
function resize() {
  const width = mount.clientWidth || innerWidth;
  const height = mount.clientHeight || innerHeight;
  const aspect = width / height;
  const size = 10.5;
  camera.left = -size * aspect;
  camera.right = size * aspect;
  camera.top = size;
  camera.bottom = -size;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
let last = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), .05);
  let dx = 0, dz = 0;
  if (keys.has('w') || keys.has('arrowup')) dz -= 1;
  if (keys.has('s') || keys.has('arrowdown')) dz += 1;
  if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
  if (keys.has('d') || keys.has('arrowright')) dx += 1;
  const length = Math.hypot(dx, dz);
  if (length) {
    dx = dx / length * dt * 6;
    dz = dz / length * dt * 6;
    if (!blocked(player.position.x + dx, player.position.z)) player.position.x += dx;
    if (!blocked(player.position.x, player.position.z + dz)) player.position.z += dz;
    player.rotation.y = Math.atan2(dx, dz);
  }
  const target = new THREE.Vector3(player.position.x + 14, 19, player.position.z + 17);
  camera.position.lerp(target, Math.min(1, dt * 4));
  camera.lookAt(player.position.x, 0, player.position.z);
  if (clock.elapsedTime - last > .2) {
    positionText.textContent = 'Position: ' + player.position.x.toFixed(1) + ', ' + player.position.z.toFixed(1);
    last = clock.elapsedTime;
  }
  renderer.render(scene, camera);
}
renderer.domElement.addEventListener('webglcontextlost', e => {
  e.preventDefault();
  errorText.hidden = false;
  errorText.textContent = 'Graphics context lost. Please reload the page.';
});
animate();
