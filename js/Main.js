
    // RANDOM HOME MESSAGE
    const homeMessages = [
      "Erm, What the crappsta?!",
      "c0ne is a crappsta",
      "the next time you use c0ne is the next time i skin 53 children on august 3rd 2014",
      "Thanks for using c0ne you unwanted vile creature",
      "c0ne has unblocked x, if ykyk",
      "crodie is not sigma"
    ];

    function setRandomHomeMessage() {
      const msg = homeMessages[Math.floor(Math.random() * homeMessages.length)];
      document.getElementById("homeMessage").textContent = msg;
    }

    // PAGE SWITCHING
    function showPage(pageId) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const el = document.getElementById(pageId);
      if (!el) return;
      el.classList.add('active');

      if (pageId === "page-welcome") setRandomHomeMessage();
    }

    document.getElementById('btn1').addEventListener('click', () => showPage('page-games'));
    document.getElementById('btn2').addEventListener('click', () => showPage('page-search'));
    document.getElementById('homeBtn').addEventListener('click', () => showPage('page-welcome'));
    setRandomHomeMessage();
  </ >

  <!-- PARTICLE SYSTEM -->


const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const img = new Image();
img.src = "https://iili.io/KyiD18G.png";

// Configuration
const LAYERS = 8;
const PARTICLES_PER_LAYER = 10;
let particles = [];
let particleCache = []; // pre-rendered images

img.onload = () => {
  // pre-render particles for each layer
  for (let layer = 0; layer < LAYERS; layer++) {
    const depth = layer / (LAYERS - 1);
    particleCache[layer] = createParticleCache(depth);
  }

  // create particles
  for (let layer = 0; layer < LAYERS; layer++) {
    const depth = layer / (LAYERS - 1);
    for (let i = 0; i < PARTICLES_PER_LAYER; i++) {
      particles.push(makeParticle(depth, layer));
    }
  }

  animate();
};

function createParticleCache(depth) {
  const size = Math.ceil((12 + 4 + depth * 8) * 1.5);
  const offCanvas = document.createElement('canvas');
  offCanvas.width = size;
  offCanvas.height = size;
  const offCtx = offCanvas.getContext('2d');

  const brightness = 0.4 + 0.6 * depth;
  offCtx.save();
  offCtx.translate(size/2, size/2);
  offCtx.shadowBlur = 4 + 10 * depth;
  offCtx.shadowColor = `rgba(255,255,255,${0.25 + depth * 0.35})`;
  offCtx.globalAlpha = brightness;
  offCtx.drawImage(img, -size/2, -size/2, size, size);
  offCtx.restore();

  return offCanvas;
}

function makeParticle(depth, layer) {
  return {
    // More spread out: anywhere across full canvas width & height
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,

    depth: depth,
    layer: layer,

    baseSpeedX: (1 + Math.random() * 1.0) * (0.5 + depth) * 1.5,
    baseSpeedY: (0.2 + Math.random() * 0.4) * (0.5 + depth) * 1.5,

    t: Math.random() * 1000,
    tSpeed: 0.006 + Math.random() * 0.015,
    wobbleAmp: 0.8 + Math.random() * 1.5,
    wobbleFreq: 0.01 + Math.random() * 0.02,

    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02 * (0.5 + depth),

    flickerOffset: Math.random() * 5
  };
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    const wobbleX = Math.sin(p.t * p.wobbleFreq) * p.wobbleAmp;
    const wobbleY = Math.cos(p.t * p.wobbleFreq * 0.7) * (p.wobbleAmp * 0.6);

    const vx = p.baseSpeedX + wobbleX;
    const vy = p.baseSpeedY + wobbleY;

    p.x += vx;
    p.y += vy;
    p.t += p.tSpeed;
    p.angle += p.spin;

    // Horizontal wrapping
    if (p.x > canvas.width + 50) p.x = -50;
    if (p.x < -50) p.x = canvas.width + 50;

    // Vertical wrapping
    if (p.y > canvas.height + 50) p.y = -50;
    if (p.y < -50) p.y = canvas.height + 50;

    const flicker = 0.85 + Math.sin(p.t * 2 + p.flickerOffset) * 0.06;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = flicker;
    const cached = particleCache[p.layer];
    ctx.drawImage(cached, -cached.width/2, -cached.height/2);
    ctx.restore();
  });

  requestAnimationFrame(animate);
}
