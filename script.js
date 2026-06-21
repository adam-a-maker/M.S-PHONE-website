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
    rotationAngle += 0.008;
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



(function updateStatus() {
  const schedule = {
    1: { open: [9, 30], close: [20, 0], label: 'Lun-Ven' },
    2: { open: [9, 30], close: [20, 0], label: 'Lun-Ven' },
    3: { open: [9, 30], close: [20, 0], label: 'Lun-Ven' },
    4: { open: [9, 30], close: [20, 0], label: 'Lun-Ven' },
    5: { open: [9, 30], close: [20, 0], label: 'Lun-Ven' },
    6: { open: [9, 30], close: [20, 0], label: 'Sam' },
    0: { open: [10, 30], close: [19, 30], label: 'Dim' },
  };
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const now = new Date();
  const day = now.getDay();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const today = schedule[day];

  const statusText = document.querySelector('.footer__status-text');
  const dotEl = document.querySelector('.footer__status-dot');
  if (!statusText || !dotEl) return;

  const openMin = today.open[0] * 60 + today.open[1];
  const closeMin = today.close[0] * 60 + today.close[1];
  const isOpen = totalMinutes >= openMin && totalMinutes < closeMin;

  if (isOpen) {
    dotEl.className = 'footer__status-dot';
    statusText.textContent = `Ouvert aujourd'hui jusqu'à ${today.close[0]}h${String(today.close[1]).padStart(2, '0')}`;
  } else {
    dotEl.className = 'footer__status-dot footer__status-dot--closed';
    if (totalMinutes < openMin) {
      statusText.textContent = `Fermé — ouvre aujourd'hui à ${today.open[0]}h${String(today.open[1]).padStart(2, '0')}`;
    } else {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextDay = tomorrow.getDay();
      const next = schedule[nextDay];
      statusText.textContent = `Fermé — prochaine ouverture ${dayNames[nextDay]} ${next.open[0]}h${String(next.open[1]).padStart(2, '0')}`;
    }
  }
})();

(function loadVitrine() {
  const track = document.getElementById('vitrine-track');
  if (!track) return;

  const phones = [
    {"marque":"Apple","modele":"iPhone 15 Pro","specifications":"128 Go, Bleu Titane","prix":"760 €"},
    {"marque":"Apple","modele":"iPhone 15 Pro","specifications":"128 Go, Titane Naturel","prix":"760 €"},
    {"marque":"Apple","modele":"iPhone 14 Pro","specifications":"128 Go, Violet intense","prix":"650 €"},
    {"marque":"Apple","modele":"iPhone 14 Pro","specifications":"256 Go, Violet intense","prix":"710 €"},
    {"marque":"Apple","modele":"iPhone 14 Plus","specifications":"128 Go, Noir","prix":"510 €"},
    {"marque":"Apple","modele":"iPhone 14","specifications":"128 Go, Noir","prix":"510 €"}
  ];

  function imgFile(modele, specs) {
    const map = {
      'iPhone 15 Pro-Bleu Titane': 'iPhone 15 Pro-Bleu Titane.webp',
      'iPhone 15 Pro-Titane Naturel': 'iPhone 15 Pro-Titane Naturel.webp',
      'iPhone 14 Pro-Violet intense': 'iPhone 14 Pro-violet intense.webp',
      'iPhone 14 Plus-Noir': 'iPhone 14 Plus-noir.webp',
      'iPhone 14-Noir': 'iPhone 14-noir.webp',
    };
    const color = specs.replace(/^[^,]*,?\s*/, '');
    return map[`${modele}-${color}`] || null;
  }

  const colorMap = {
    noir: '#1a1a1a', 'violet intense': '#6b3fa0', 'bleu titane': '#2563eb',
    'titane naturel': '#a8a8a8', blanc: '#e8e4df', rouge: '#dc2626',
    vert: '#16a34a', bleu: '#2563eb',
  };

  function pickColor(specs) {
    const s = specs.toLowerCase();
    for (const [k, v] of Object.entries(colorMap)) {
      if (s.includes(k)) return v;
    }
    return '#666';
  }

  const groups = {};
  phones.forEach(p => {
    const brand = p.marque || 'Autre';
    if (!groups[brand]) groups[brand] = [];
    groups[brand].push(p);
  });

  const brandOrder = ['Apple'];

  brandOrder.forEach(brand => {
    const list = groups[brand];
    if (!list || !list.length) return;

    const section = document.createElement('div');
    section.className = 'vitrine__group';

    const heading = document.createElement('div');
    heading.className = 'vitrine__group-heading';
    heading.textContent = brand;
    section.appendChild(heading);

    const row = document.createElement('div');
    row.className = 'vitrine__track';

    list.forEach(p => {
      const img = imgFile(p.modele, p.specifications);
      if (!img) return;
      const card = document.createElement('div');
      card.className = 'vitrine__card';
      const c = pickColor(p.specifications);
      card.innerHTML = `
        <img class="vitrine__card-img" src="${img}" alt="${p.modele}" loading="lazy">
        <div class="vitrine__card-model">${p.modele}</div>
        <div class="vitrine__card-specs">${p.specifications}</div>
        <div class="vitrine__card-bottom">
          <span class="vitrine__card-color" style="background:${c};box-shadow:0 0 8px ${c}44"></span>
          <span class="vitrine__card-price">${p.prix}</span>
        </div>
      `;
      row.appendChild(card);
    });

    if (!row.children.length) return;
    section.appendChild(row);
    track.appendChild(section);
  });
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
