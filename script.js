import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function initPhone() {
  const container = document.getElementById('phone-canvas');
  if (!container) return;
  if (window.innerWidth < 768) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
  camera.position.set(0, 0.3, 7);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404060, 0.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(5, 4, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8888ff, 1);
  fillLight.position.set(-4, 1, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.8);
  rimLight.position.set(0, -3, -5);
  scene.add(rimLight);

  const loader = new GLTFLoader();
  let phoneModel = null;

  loader.load(
    'iphone.glb',
    (gltf) => {
      phoneModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(phoneModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.2 / maxDim;
      phoneModel.scale.set(scale, scale, scale);
      phoneModel.position.y = -0.3;
      scene.add(phoneModel);
    },
    undefined,
    (err) => console.error('GLB load error:', err)
  );

  let rotationAngle = 0;

  function animate() {
    requestAnimationFrame(animate);
    rotationAngle += 0.003;
    if (phoneModel) {
      phoneModel.rotation.y = Math.sin(rotationAngle) * 0.3;
      phoneModel.position.y = -0.3 + Math.sin(rotationAngle * 1.5) * 0.04;
    }
    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w > 0 && h > 0) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  }

  window.addEventListener('resize', handleResize);
})();

(function scrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

(function tickerDuplication() {
  const track = document.querySelector('.ticker__track');
  if (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  }
})();

(function scrollToHoraires() {
  const btn = document.getElementById('btn-horaires');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('horaires');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();
