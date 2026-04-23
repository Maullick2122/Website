// ─────────────────────────────────────────────────────────────────────────────
//  ABOUT PAGE — IMAGE CONFIG
//
//  Replace each `src` with a real image path when you have final assets.
//  `label`    — large title shown below the image, optionally a clickable link
//  `href`     — where the title links (use "#" for no link)
//  `category` — small italic label shown above the image
//  `sub`      — small monospace date/context shown below the title
//  `bio`      — sentence shown bottom-right while this image is active
//
//  Add or remove entries freely — the cycling adapts automatically.
// ─────────────────────────────────────────────────────────────────────────────

const ABOUT_IMAGES = [
  {
    src:       "Myself/02.jpg",
    colors:   ["#1a0f2e","#3d2878","#8b68d8","#d4c4ff"],
    label:    "Art",
    // href:     "index.html",
  //  category: "Creative Direction",
   sub:      "Multimedia; Games and Film",
   bio:      "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/03.jpg",
    colors:   ["#1a0800","#7a3010","#d4580a","#ffd090"],
    label:    "Books",
   // href:     "projects/lighting.html",
   // category: "Lighting Design",
   sub:      "Currently reading : Meditations of the mind",
   bio:      "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/04.jpg",
    colors:   ["#001a12","#004d38","#00a070","#80ffe0"],
    label:    "Helio & Seleno",
   // href:     "projects/3d-modelling.html",
  //  category: "3D Modelling",
    sub:      "The sun adores the moon very much",
    bio:     "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/05.jpg",
    colors:   ["#0d0d1a","#1a1a40","#3860a0","#90b8f0"],
    label:    "Lemonade Enthusiast",
   // href:     "projects/cinematics.html",
   // category: "Cinematics",
   // sub:      "2023",
    bio:    "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/07.jpg",
    colors:   ["#1a0020","#500060","#c030e0","#f0a0ff"],
    label:    "CGI",
   // href:     "projects/animation.html",
   // category: "Animation",
   // sub:      "2022 — Present",
    bio:    "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/01.jpg",
    colors:   ["#0a0a00","#383800","#808000","#e0d840"],
    label:    "Art Direction",
   // href:     "projects/colour-grading.html",
  // category: "Colour Grading",
  //  sub:      "2021 — Present",
    bio:  "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/08.jpg",
    colors:   ["#1a0008","#600020","#d0005a","#ff80b0"],
    label:    "Cinematography",
   // href:     "projects/illustration.html",
    // category: "Illustration",
   // sub:      "2020 — 2023",
    bio: "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/09.png",
    colors:   ["#001a1a","#004848","#009090","#00e8e8"],
    label:    "Writing",
   // href:     "projects/visual-fx.html",
   // category: "Visual FX",
   // sub:      "2023 — 2024",
    bio:    "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  {
    src:      "Myself/06.jpg",
    colors:   ["#0a1a0a","#204820","#408040","#90d890"],
    label:    "Gaming",
    //href:     "projects/art-direction.html",
   // category: "Art Direction",
  //  sub:      "2022 — Present",
    bio: "Artist and philosopher at heart, story-telling nerd by soul and lecturer at work I strive to mean and to identify. Finding myself is the only true constant, for change is what I am most comfortable waking up to. Currently tackling the selfishness of giving."
  },
  
];

// ── DOM refs ──────────────────────────────────────────────────────────────────
const imageFrame    = document.getElementById("imageFrame");
const imageTrack    = document.getElementById("imageTrack");
const dragHint      = document.getElementById("dragHint");
const speedBar      = document.getElementById("speedBar");
const labelIndex    = document.getElementById("label-index");
const labelCategory = document.getElementById("label-category");
const labelTitleEl  = document.getElementById("labelTitle");
const labelTitleTxt = document.getElementById("labelTitleText");
const labelSub      = document.getElementById("labelSub");
const bioText       = document.getElementById("bioText");
const counterCur    = document.getElementById("counter-current");
const counterTot    = document.getElementById("counter-total");
const cur           = document.getElementById("cursor");
const ring          = document.getElementById("cursor-ring");

// ── Placeholder canvas generation ────────────────────────────────────────────
// Remove makeThumb and replace with real <img> elements when you have assets.
function makeThumb(entry, w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  const [c0, c1, c2, c3] = entry.colors;

  // Atmospheric gradient fill
  const g = x.createLinearGradient(0, 0, w * 0.6, h);
  g.addColorStop(0, c0);
  g.addColorStop(0.45, c1);
  g.addColorStop(0.78, c2);
  g.addColorStop(1, c3);
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  // Subtle noise lines
  x.strokeStyle = c3;
  x.lineWidth = 0.4;
  x.globalAlpha = 0.08;
  for (let i = 0; i < h; i += 6) {
    x.beginPath(); x.moveTo(0, i); x.lineTo(w, i + (Math.random() - 0.5) * 4); x.stroke();
  }
  x.globalAlpha = 1;

  // Vignette
  const vig = x.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.85);
  vig.addColorStop(0, "transparent");
  vig.addColorStop(1, "rgba(0,0,0,0.55)");
  x.fillStyle = vig;
  x.fillRect(0, 0, w, h);

  return c;
}

// ── Build image elements ──────────────────────────────────────────────────────
const FW = 560, FH = 680; // match max frame size in CSS
const elements = [];

// Remove the placeholder canvas from HTML
imageTrack.innerHTML = "";

ABOUT_IMAGES.forEach((entry, i) => {
  let el;
  if (entry.src) {
    el = document.createElement("img");
    el.src = entry.src;
    el.alt = entry.label;
    el.draggable = false;
  } else {
    el = makeThumb(entry, FW, FH);
  }
  el.classList.add("about-img");
  if (i === 0) el.classList.add("active");
  imageTrack.appendChild(el);
  elements.push(el);
});

counterTot.textContent = String(ABOUT_IMAGES.length).padStart(2, "0");

// ── State ─────────────────────────────────────────────────────────────────────
let currentIndex  = 0;
let isDragging    = false;
let accumDist     = 0;        // accumulated drag distance since last image advance
let lastDragX     = 0;
let lastDragY     = 0;
let speed         = 0;        // px/frame smoothed
let lastMoveTime  = 0;
let hintHidden    = false;

// How many pixels of drag movement = one image advance.
// Smaller = faster cycling.  Speed multiplier reduces this threshold dynamically.
const BASE_THRESHOLD = 48;
const MIN_THRESHOLD  = 8;

// ── Label update ──────────────────────────────────────────────────────────────
function updateLabels(index, animate) {
  const entry = ABOUT_IMAGES[index];

  const flash = (el) => {
    if (!animate) return;
    el.classList.remove("label-flash");
    void el.offsetWidth; // reflow
    el.classList.add("label-flash");
  };

  labelIndex.textContent    = String(index + 1).padStart(2, "0");
  labelCategory.textContent = entry.category;
  labelTitleTxt.textContent = entry.label;
  labelTitleEl.href         = entry.href || "#";
  labelSub.textContent      = entry.sub;
  bioText.textContent       = entry.bio;
  counterCur.textContent    = String(index + 1).padStart(2, "0");

  flash(labelCategory);
  flash(labelTitleEl);
  flash(labelSub);
}

// ── Image advance ─────────────────────────────────────────────────────────────
function goTo(index) {
  if (index === currentIndex) return;
  elements[currentIndex].classList.remove("active");
  currentIndex = ((index % ABOUT_IMAGES.length) + ABOUT_IMAGES.length) % ABOUT_IMAGES.length;
  elements[currentIndex].classList.add("active");
  updateLabels(currentIndex, true);
}

// ── Drag handling ─────────────────────────────────────────────────────────────
imageFrame.addEventListener("mousedown", e => {
  isDragging = true;
  lastDragX  = e.clientX;
  lastDragY  = e.clientY;
  accumDist  = 0;
  ring.classList.add("dragging");
  dragHint.classList.add("hidden");
  hintHidden = true;
  e.preventDefault();
});

window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  ring.classList.remove("dragging");
  speed = 0;
  speedBar.style.width = "0%";
});

window.addEventListener("mousemove", e => {
  // Move custom cursor
  cur.style.left = e.clientX + "px";
  cur.style.top  = e.clientY + "px";

  if (!isDragging) return;

  const dx   = e.clientX - lastDragX;
  const dy   = e.clientY - lastDragY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Smooth speed (px per event, exponential moving average)
  speed = speed * 0.6 + dist * 0.4;

  lastDragX = e.clientX;
  lastDragY = e.clientY;

  // Dynamic threshold: faster drag = lower threshold = quicker cycling
  const speedFactor = Math.min(speed / 12, 1);           // 0–1
  const threshold   = BASE_THRESHOLD - (BASE_THRESHOLD - MIN_THRESHOLD) * speedFactor;

  accumDist += dist;

  while (accumDist >= threshold) {
    accumDist -= threshold;
    goTo(currentIndex + 1);
  }

  // Speed indicator bar (visual feedback)
  const barPct = Math.min(speed / 20, 1) * 100;
  speedBar.style.width = barPct + "%";
});

// ── Cursor ring follow ────────────────────────────────────────────────────────
let mX = innerWidth / 2, mY = innerHeight / 2;
let rX = mX, rY = mY;

window.addEventListener("mousemove", e => { mX = e.clientX; mY = e.clientY; });

(function animRing() {
  rX += (mX - rX) * 0.11;
  rY += (mY - rY) * 0.11;
  ring.style.left = rX + "px";
  ring.style.top  = rY + "px";
  requestAnimationFrame(animRing);
})();

// ── Film grain ────────────────────────────────────────────────────────────────
const gc = document.getElementById("grain");
const gx = gc.getContext("2d");

function resizeGrain() { gc.width = innerWidth; gc.height = innerHeight; }
resizeGrain();
window.addEventListener("resize", resizeGrain);

let gf = 0;
(function drawGrain() {
  if (++gf % 3 === 0) {
    const id = gx.createImageData(gc.width, gc.height);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 255;
    }
    gx.putImageData(id, 0, 0);
  }
  requestAnimationFrame(drawGrain);
})();

// ── Initialise labels ─────────────────────────────────────────────────────────
updateLabels(0, false);
