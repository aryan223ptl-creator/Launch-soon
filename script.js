import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.165.0/examples/jsm/controls/OrbitControls.js';

// ==========================================
// 1. SCENE, CAMERA, & RENDERER SETUP
// ==========================================
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08080c);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 4.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

if (container) {
  container.appendChild(renderer.domElement);
} else {
  document.body.appendChild(renderer.domElement);
}

// ==========================================
// 2. INTERACTIVE CONTROLS
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10;
controls.minDistance = 1.5;

// ==========================================
// 3. LIGHTING (PREVENTS BLACK MODEL ISSUE)
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
mainLight.position.set(5, 10, 7.5);
scene.add(mainLight);

const rimLight = new THREE.DirectionalLight(0x00ffcc, 2.5); // Cyberpunk accent light
rimLight.position.set(-5, 2, -5);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xff0055, 1.5, 10); // Red glow accent
fillLight.position.set(0, -2, 2);
scene.add(fillLight);

// ==========================================
// 4. LOAD 3D MODEL (.GLB / .GLTF)
// ==========================================
let dunkMesh = null;
const loader = new GLTFLoader();
const loadingIndicator = document.getElementById('loading');

// Path to your 3D model file
const MODEL_PATH = 'nike_dunk_low.glb';

loader.load(
  MODEL_PATH,
  (gltf) => {
    dunkMesh = gltf.scene;

    // Fix centering and scale automatically
    const box = new THREE.Box3().setFromObject(dunkMesh);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center model origin
    dunkMesh.position.sub(center);

    // Normalize model size so it fits the viewport
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const targetScale = 2.5 / maxDim;
      dunkMesh.scale.setScalar(targetScale);
    }

    scene.add(dunkMesh);

    // Hide loader HUD if present
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    console.log('3D Dunk Model loaded successfully!');
  },
  (xhr) => {
    if (xhr.total > 0 && loadingIndicator) {
      const percent = Math.round((xhr.loaded / xhr.total) * 100);
      loadingIndicator.innerText = `LOADING 3D DUNK... ${percent}%`;
    }
  },
  (error) => {
    console.error('Error loading 3D model:', error);
    if (loadingIndicator) {
      loadingIndicator.innerText = 'MODEL NOT FOUND (Check file path & local server)';
      loadingIndicator.style.color = '#ff0055';
    }
  }
);

// ==========================================
// 5. AUDIO TOGGLE SYSTEM (1 Click Play / 2 Clicks Stop)
// ==========================================
const bgAudio = new Audio('music.mp3');
bgAudio.loop = true;

let isPlaying = false;
const soundStatus = document.getElementById('sound-status');

window.addEventListener('click', (e) => {
  // Prevent audio toggle when typing in the email form input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
    return;
  }

  if (!isPlaying) {
    bgAudio
      .play()
      .then(() => {
        isPlaying = true;
        if (soundStatus) {
          soundStatus.innerText = 'ON';
          soundStatus.style.color = '#00ffcc';
        }
      })
      .catch((err) => {
        console.warn('Audio playback blocked or file missing:', err);
      });
  } else {
    bgAudio.pause();
    isPlaying = false;
    if (soundStatus) {
      soundStatus.innerText = 'OFF';
      soundStatus.style.color = '#ff0055';
    }
  }
});

// ==========================================
// 6. ANIMATION LOOP
// ==========================================
function animate() {
  requestAnimationFrame(animate);

  // Smooth ambient rotation
  if (dunkMesh) {
    dunkMesh.rotation.y += 0.006;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ==========================================
// 7. RESPONSIVE RESIZE HANDLER
// ==========================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
