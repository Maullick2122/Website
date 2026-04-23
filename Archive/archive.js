// ─────────────────────────────────────────────────────────────────────────────
//  ARCHIVE.JS
//  Requires: Matter.js (loaded before this script), archive_config.js
// ─────────────────────────────────────────────────────────────────────────────

// ── Wait for DOM ready ────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {

// ── Verify Matter.js loaded ───────────────────────────────────────────────────
if (typeof Matter === "undefined") {
  console.error("Matter.js failed to load");
  return;
}

const { Engine, Bodies, Body, Composite, Runner, Events } = Matter;

// ── Config shorthand ──────────────────────────────────────────────────────────
const CFG   = ARCHIVE_PHYSICS;
const MEDIA = ARCHIVE_MEDIA;

// ── DOM ───────────────────────────────────────────────────────────────────────
const worldEl     = document.getElementById("world");
const fsOverlay   = document.getElementById("fsOverlay");
const fsClose     = document.getElementById("fsClose");
const fsMediaWrap = document.getElementById("fsMediaWrap");
const fsLabel     = document.getElementById("fsLabel");
const motionHint  = document.getElementById("motionHint");
const cur         = document.getElementById("cursor");
const ring        = document.getElementById("cursor-ring");

// ── Dimensions ────────────────────────────────────────────────────────────────
let W = window.innerWidth;
let H = window.innerHeight;

// ── Placeholder colours ───────────────────────────────────────────────────────
const PH_COLORS = [
  ["#0d1a12","#2d6045","#5db888"],["#000818","#003080","#0060e0"],
  ["#1a1208","#806020","#d4a840"],["#0a0014","#500090","#c000ff"],
  ["#08141e","#104c70","#20a0d0"],["#1a0400","#a02000","#ff5800"],
  ["#100820","#503878","#c090e0"],["#0e1400","#486800","#90d000"],
  ["#001a1a","#008080","#00e0e0"],["#1a0008","#c0004a","#f07090"],
  ["#0d0d1a","#2e3a7a","#7090c0"],["#180404","#802020","#c86060"]
];

function makePlaceholder(w, h, idx) {
  const c   = document.createElement("canvas");
  c.width   = w * 2;   // 2× for sharpness
  c.height  = h * 2;
  c.style.width  = w + "px";
  c.style.height = h + "px";
  c.style.display = "block";

  const x = c.getContext("2d");
  const [c0, c1, c2] = PH_COLORS[idx % PH_COLORS.length];

  const g = x.createLinearGradient(0, c.height, c.width * 0.7, 0);
  g.addColorStop(0, c0); g.addColorStop(0.5, c1); g.addColorStop(1, c2);
  x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);

  x.strokeStyle = c2; x.lineWidth = 1; x.globalAlpha = 0.06;
  for (let i = -c.height; i < c.width + c.height; i += 20) {
    x.beginPath(); x.moveTo(i, c.height); x.lineTo(i + c.height, 0); x.stroke();
  }
  x.globalAlpha = 1;

  const vig = x.createRadialGradient(c.width/2,c.height/2,c.height*0.1,c.width/2,c.height/2,c.height*0.9);
  vig.addColorStop(0,"transparent"); vig.addColorStop(1,"rgba(0,0,0,0.45)");
  x.fillStyle = vig; x.fillRect(0,0,c.width,c.height);

  return c;
}

// ── Physics engine ────────────────────────────────────────────────────────────
const engine = Engine.create({ gravity: { x: 0, y: CFG.gravity, scale: 0.001 } });
const world  = engine.world;

// ── Walls and floor ───────────────────────────────────────────────────────────
const T = CFG.wallThickness;
const WALL = { isStatic: true, restitution: CFG.restitution, friction: CFG.friction };

let walls = [];
function rebuildWalls() {
  walls.forEach(w => Composite.remove(world, w));
  walls = [
    Bodies.rectangle(W/2,   H + T/2,  W + T*4, T,    WALL), // floor
    Bodies.rectangle(-T/2,  H/2,      T,        H*4,  WALL), // left
    Bodies.rectangle(W+T/2, H/2,      T,        H*4,  WALL), // right
    Bodies.rectangle(W/2,   -T/2,     W + T*4,  T,    WALL)  // ceiling
  ];
  Composite.add(world, walls);
}
rebuildWalls();

// ── Item registry ─────────────────────────────────────────────────────────────
const items = [];

// ── Create one item ───────────────────────────────────────────────────────────
function createItem(media, index) {
  const iW  = media.width || 180;
  const iH  = Math.round(iW * 1.35);  // default 3:2 portrait — real images override via CSS
  const cr  = CFG.cornerRadius + "px";

  // ── Outer wrapper ──────────────────────────────────────────────
  const el = document.createElement("div");
  el.className = "archive-item";
  el.style.cssText = [
    `width:${iW}px`,
    `height:${iH}px`,
    `border-radius:${cr}`,
    "overflow:hidden",
    "position:absolute",
    "top:0",
    "left:0",
    "will-change:transform",
    "cursor:none",
    "box-shadow:0 3px 20px rgba(20,18,14,0.15),0 0 0 0.5px rgba(20,18,14,0.08)"
  ].join(";");

  // ── Media element ─────────────────────────────────────────────
  let mediaEl;
  if (!media.src) {
    mediaEl = makePlaceholder(iW, iH, index);
  } else if (media.type === "video") {
    mediaEl = document.createElement("video");
    mediaEl.src        = media.src;
    mediaEl.muted      = true;
    mediaEl.loop       = true;
    mediaEl.autoplay   = true;
    mediaEl.playsinline = true;
    mediaEl.style.cssText = `display:block;width:${iW}px;height:${iH}px;object-fit:cover;border-radius:${cr}`;
  } else {
    mediaEl = document.createElement("img");
    mediaEl.src = media.src;
    mediaEl.alt = media.label || "";
    mediaEl.style.cssText = `display:block;width:${iW}px;height:auto;min-height:${iH}px;object-fit:cover;border-radius:${cr}`;
    mediaEl.draggable = false;
  }

  el.appendChild(mediaEl);
  worldEl.appendChild(el);

  // ── Physics body — spawn above viewport ───────────────────────
  const spawnX = iW/2 + Math.random() * Math.max(0, W - iW);
 const spawnY = H / 2;
  const initAngle = (Math.random() - 0.5) * 0.5;

  const body = Bodies.rectangle(spawnX, spawnY, iW, iH, {
    restitution:    CFG.restitution,
    friction:       CFG.friction,
    frictionAir:    CFG.frictionAir,
    frictionStatic: CFG.frictionStatic,
    density:        CFG.density,
    angle:          initAngle,
    label:          "item"
  });

  Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
  Composite.add(world, body);

  items.push({ body, el, media, iW, iH });

  // ── Interaction ───────────────────────────────────────────────
  el.addEventListener("click",       () => openFullscreen(media));
  el.addEventListener("mouseenter",  () => ring.classList.add("over-item"));
  el.addEventListener("mouseleave",  () => ring.classList.remove("over-item"));
}

// ── Staggered spawn ───────────────────────────────────────────────────────────
MEDIA.forEach((media, i) => {
  setTimeout(() => createItem(media, i), i * CFG.spawnDelay);
});

// ── Physics runner ────────────────────────────────────────────────────────────
const runner = Runner.create();
Runner.run(runner, engine);

// ── Render loop — sync DOM positions to physics bodies ───────────────────────
function renderLoop() {
  for (let i = 0; i < items.length; i++) {
    const { body, el, iW, iH } = items[i];
    const { x, y } = body.position;
    el.style.transform = `translate(${(x - iW/2).toFixed(2)}px,${(y - iH/2).toFixed(2)}px) rotate(${body.angle.toFixed(4)}rad)`;
  }
  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

// ── Device orientation → gravity ──────────────────────────────────────────────
let motionActive = false;

function applyOrientation(gamma, beta) {
  engine.gravity.x = Math.sin((gamma || 0) * Math.PI / 180) * CFG.gravity;
  engine.gravity.y = Math.max(0.15, Math.cos((beta  || 0) * Math.PI / 180) * CFG.gravity);
}

function startMotion() {
  if (motionActive) return;
  motionActive = true;
  window.addEventListener("deviceorientation", e => applyOrientation(e.gamma, e.beta));
  setTimeout(() => motionHint.classList.add("hidden"), 1800);
}

// iOS 13+ needs explicit permission
if (typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function") {
  document.addEventListener("touchstart", () => {
    DeviceOrientationEvent.requestPermission()
      .then(s => { if (s === "granted") startMotion(); })
      .catch(() => {});
  }, { once: true });
} else {
  startMotion();
}

// ── Shake detection ───────────────────────────────────────────────────────────
let prevAcc   = null;
let shakeCool = false;

window.addEventListener("devicemotion", e => {
  const a = e.accelerationIncludingGravity;
  if (!a) return;
  if (prevAcc) {
    const d = Math.hypot(a.x - prevAcc.x, a.y - prevAcc.y, a.z - prevAcc.z);
    if (d > CFG.shakeThreshold && !shakeCool) {
      doShake();
      shakeCool = true;
      setTimeout(() => { shakeCool = false; }, 500);
    }
  }
  prevAcc = { x: a.x, y: a.y, z: a.z };
});

function doShake() {
  const F = CFG.shakeForce;
  items.forEach(({ body }) => {
    Body.applyForce(body, body.position, {
      x: (Math.random() - 0.5) * F * 2,
      y: -(Math.random() * F * 2.5)
    });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.35);
  });
}

// ── Desktop fallback: mouse x tilts gravity ───────────────────────────────────
window.addEventListener("mousemove", e => {
  if (motionActive) return;
  engine.gravity.x = ((e.clientX / W) - 0.5) * CFG.gravity * 0.5;
});

// ── Fullscreen ────────────────────────────────────────────────────────────────
function openFullscreen(media) {
  fsMediaWrap.innerHTML = "";
  fsLabel.textContent   = media.label || "";

  let el;
  if (!media.src) {
    const pw = Math.min(W * 0.88, 860);
    const ph = Math.round(pw * 1.35);
    el = makePlaceholder(pw, ph, MEDIA.indexOf(media));
    el.style.width  = pw + "px";
    el.style.height = ph + "px";
  } else if (media.type === "video") {
    el = document.createElement("video");
    el.src         = media.src;
    el.controls    = true;
    el.autoplay    = true;
    el.loop        = true;
    el.playsinline = true;
    el.style.cssText = "max-width:90vw;max-height:80vh;object-fit:contain;display:block;border-radius:2px;";
  } else {
    el = document.createElement("img");
    el.src = media.src;
    el.alt = media.label || "";
    el.style.cssText = "max-width:90vw;max-height:80vh;object-fit:contain;display:block;border-radius:2px;";
  }

  fsMediaWrap.appendChild(el);
  fsOverlay.classList.add("open");
  fsOverlay.setAttribute("aria-hidden","false");
}

function closeFullscreen() {
  fsOverlay.classList.remove("open");
  fsOverlay.setAttribute("aria-hidden","true");
  const vid = fsMediaWrap.querySelector("video");
  if (vid) { vid.pause(); vid.src = ""; }
  setTimeout(() => { fsMediaWrap.innerHTML = ""; }, 350);
}

fsClose.addEventListener("click", closeFullscreen);
fsOverlay.addEventListener("click", e => { if (e.target === fsOverlay) closeFullscreen(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeFullscreen(); });

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener("resize", () => {
  W = window.innerWidth;
  H = window.innerHeight;
  rebuildWalls();
});

// ── Custom cursor ─────────────────────────────────────────────────────────────
let mX = W/2, mY = H/2, rX = mX, rY = mY;

window.addEventListener("mousemove", e => {
  mX = e.clientX; mY = e.clientY;
  cur.style.left = mX + "px"; cur.style.top = mY + "px";
});

(function animRing() {
  rX += (mX - rX) * 0.11; rY += (mY - rY) * 0.11;
  ring.style.left = rX + "px"; ring.style.top = rY + "px";
  requestAnimationFrame(animRing);
})();

// ── Film grain ────────────────────────────────────────────────────────────────
const gc = document.getElementById("grain");
const gctx = gc.getContext("2d");
function resizeGrain() { gc.width = innerWidth; gc.height = innerHeight; }
resizeGrain();
window.addEventListener("resize", resizeGrain);
let gf = 0;
(function drawGrain() {
  if (++gf % 3 === 0) {
    const id = gctx.createImageData(gc.width, gc.height);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      id.data[i] = id.data[i+1] = id.data[i+2] = v; id.data[i+3] = 255;
    }
    gctx.putImageData(id, 0, 0);
  }
  requestAnimationFrame(drawGrain);
})();

}); // end DOMContentLoaded