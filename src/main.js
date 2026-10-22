import * as THREE from 'three';
import './style.css';
import { createWorld, SPAWN } from './world/paris.js';
import { createPlayer } from './character/player.js';
import { createMatch } from './game/match.js';
import { qualitySettings, recommendQuality, sampleFps } from './performance.js';

const mount = document.querySelector('#game');
const positionText = document.querySelector('#coords');
const errorText = document.querySelector('#error');
const zoneName = document.querySelector('#zone-name');
const zoneDistance = document.querySelector('#zone-distance');
const progressText = document.querySelector('#progress-text');
const progressBar = document.querySelector('#progress-bar');
const mapPlayer = document.querySelector('#map-player');
const mapDots = document.querySelector('#map-dots');
const help = document.querySelector('#help-panel');
const toggleHelp = document.querySelector('#help-toggle');
const closeHelp = document.querySelector('#help-close');
function setHelp(open) {
  help.hidden = !open;
  toggleHelp.setAttribute('aria-expanded', String(open));
  if (open) closeHelp.focus(); else toggleHelp.focus();
}
toggleHelp.addEventListener('click', () => setHelp(help.hidden));
closeHelp.addEventListener('click', () => setHelp(false));
window.addEventListener('keydown', event => { if (event.key === 'Escape' && !help.hidden) setHelp(false); });
const match = createMatch();
const panel = document.querySelector('#match-panel');
const message = document.querySelector('#match-message');
const roles = document.querySelector('#role-buttons');
const controls = document.querySelector('#match-controls');
const primary = document.querySelector('#match-primary');
const resetButton = document.querySelector('#match-reset');
const pauseButton = document.querySelector('#round-pause');
const timerText = document.querySelector('#round-timer');
const roleText = document.querySelector('#round-role');
function displayMatch() {
  const { phase, role, remaining } = match.snapshot();
  panel.hidden = phase === 'playing';
  roles.hidden = phase !== 'menu';
  controls.hidden = phase === 'menu';
  primary.hidden = phase === 'results';
  primary.textContent = phase === 'paused' ? 'Resume' : 'Start round';
  message.textContent = phase === 'menu' ? 'Choose a role for a three-minute exploration round.' :
    phase === 'ready' ? 'Ready to explore! Gameplay objectives arrive in L2.P2.' :
    phase === 'paused' ? 'Round paused.' : phase === 'results' ? 'Round finished. This prototype has no win scoring yet.' : '';
  roleText.textContent = role === 'student' ? 'Student Organizer' : role === 'safety' ? 'Civic Safety Officer' : 'No role selected';
  timerText.textContent = String(Math.floor(remaining / 60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
  pauseButton.disabled = phase !== 'playing';
}
roles.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => { match.select(button.dataset.role); displayMatch(); }));
primary.addEventListener('click', () => { if (match.snapshot().phase === 'paused') match.resume(); else match.start(); displayMatch(); });
resetButton.addEventListener('click', () => { match.reset(); displayMatch(); });
pauseButton.addEventListener('click', () => { match.pause(); displayMatch(); });
displayMatch();
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dbe7ed');
scene.fog = new THREE.Fog('#dbe7ed', 40, 100);

const camera = new THREE.OrthographicCamera(-14, 14, 8, -8, 0.1, 180);
let qualityMode = new URLSearchParams(location.search).get('quality') === 'low' ? 'low' : 'auto';
const renderer = new THREE.WebGLRenderer({ antialias: qualityMode !== 'low', powerPreference: 'default' });
renderer.setPixelRatio(qualitySettings(qualityMode,window.devicePixelRatio).pixelRatio);
renderer.shadowMap.enabled = qualitySettings(qualityMode,window.devicePixelRatio).shadows;
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
const visited = new Set();
const mapPos = n => `${((n + 32) / 64 * 100).toFixed(2)}%`;
for (const zone of world.zones) {
  const dot = document.createElement('div');
  dot.className = 'map-dot';
  dot.style.left = mapPos(zone.x);
  dot.style.top = mapPos(zone.z);
  dot.style.backgroundColor = zone.color;
  dot.title = zone.name;
  dot.dataset.zone = zone.id;
  mapDots.appendChild(dot);
}
function refreshHud(x,z) {
  const closest = world.zones.reduce((best, zone) => {
    const d = Math.hypot(x-zone.x,z-zone.z);
    return !best || d < best.distance ? { zone, distance:d } : best;
  },null);
  if (closest.distance < 2.5) visited.add(closest.zone.id);
  zoneName.textContent = closest.zone.name;
  zoneDistance.textContent = closest.distance < 2.5 ? 'Area discovered!' : `${closest.distance.toFixed(1)} units away · Follow the colored ring`;
  progressText.textContent = `${visited.size} / ${world.zones.length} areas visited`;
  progressBar.style.width = `${visited.size / world.zones.length * 100}%`;
  mapPlayer.style.left = mapPos(x);
  mapPlayer.style.top = mapPos(z);
  for (const dot of mapDots.children) dot.classList.toggle('visited',visited.has(dot.dataset.zone));
}
refreshHud(SPAWN.x,SPAWN.z);

const character = createPlayer();
const player = character.root;
player.position.set(SPAWN.x, 0, SPAWN.z);
scene.add(player);

// Camera damping and angle are tuned for a legible indie-game overview.
const cameraFocus = new THREE.Vector3(SPAWN.x, 0, SPAWN.z);
const cameraOffset = new THREE.Vector3(12, 20, 16);
const cameraLook = new THREE.Vector3();

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
let lastX = player.position.x, lastZ = player.position.z;
let frameSamples = 0, sampleSeconds = 0, underTargetSamples = 0;
const perf = document.querySelector('#performance-status');
function applyQuality(mode) {
  qualityMode = mode;
  const settings = qualitySettings(mode, window.devicePixelRatio);
  renderer.shadowMap.enabled = settings.shadows;
  renderer.setPixelRatio(settings.pixelRatio);
  renderer.setSize(mount.clientWidth || innerWidth, mount.clientHeight || innerHeight, false);
  perf.textContent = mode === 'low' ? 'LOW GRAPHICS' : 'AUTO GRAPHICS';
}
document.querySelector('#graphics-toggle').addEventListener('click', () => applyQuality(qualityMode === 'low' ? 'auto' : 'low'));
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getDelta();
  const dt = Math.min(elapsed, .05);
  match.tick(dt);
  if (match.snapshot().phase === 'results' && panel.hidden) displayMatch();
  if (match.snapshot().phase === 'playing') timerText.textContent = String(Math.floor(match.snapshot().remaining / 60)).padStart(2,'0')+':'+String(match.snapshot().remaining%60).padStart(2,'0');
  frameSamples++;
  sampleSeconds += elapsed;
  if (sampleSeconds >= 1.0) {
    const fps = sampleFps(frameSamples, sampleSeconds);
    document.querySelector('#fps').textContent = fps + ' FPS';
    underTargetSamples = fps < 28 ? underTargetSamples + 1 : 0;
    const recommended = recommendQuality(fps, qualityMode, underTargetSamples);
    if (recommended !== qualityMode) applyQuality(recommended);
    frameSamples = 0;
    sampleSeconds = 0;
  }
  let dx = 0, dz = 0;
  if (keys.has('w') || keys.has('arrowup')) dz -= 1;
  if (keys.has('s') || keys.has('arrowdown')) dz += 1;
  if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
  if (keys.has('d') || keys.has('arrowright')) dx += 1;
  const length = Math.hypot(dx, dz);
  if (length && match.snapshot().phase === 'playing') {
    dx = dx / length * dt * 6;
    dz = dz / length * dt * 6;
    if (!blocked(player.position.x + dx, player.position.z)) player.position.x += dx;
    if (!blocked(player.position.x, player.position.z + dz)) player.position.z += dz;
    // Smooth character facing is applied to the visual rig.
  }
  const moved = Math.hypot(player.position.x - lastX, player.position.z - lastZ) > .0001;
  const heading = moved ? Math.atan2(player.position.x - lastX, player.position.z - lastZ) : 0;
  character.update(dt, moved, heading);
  lastX = player.position.x;
  lastZ = player.position.z;
  cameraFocus.lerp(player.position, 1 - Math.exp(-dt * 6));
  camera.position.copy(cameraFocus).add(cameraOffset);
  cameraLook.set(cameraFocus.x, .8, cameraFocus.z);
  camera.lookAt(cameraLook);
  if (clock.elapsedTime - last > .2) {
    positionText.textContent = 'Position: ' + player.position.x.toFixed(1) + ', ' + player.position.z.toFixed(1);
    refreshHud(player.position.x,player.position.z);
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
