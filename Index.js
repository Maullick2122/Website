// ── Constants ─────────────────────────────────────────────────────────────────
const NS      = "http://www.w3.org/2000/svg";
const OR      = 0.86;   // orbit radius (SVG units)
const TW      = 0.22;   // thumbnail width
const TH      = 0.135;  // thumbnail height
const RW      = 240;    // canvas render width (px)
const RH      = Math.round(RW * TH / TW);
const THRESH  = 18;     // degrees — angle window to activate a project
const PAUSE   = 105;    // frames to pause on each project during auto-rotate
const HOVER_R = 0.28;   // SVG units — hover detection radius around each orbit point
const PUPIL_T = 0.016;  // SVG units — pupil travel distance

// Collage tile layout: [dx, dy, rotation_deg, scale]
const TILES = [
  [ 0,      0,     -4,   1.0  ],
  [ 0.065,  0.038,  8,   0.88 ],
  [-0.072,  0.03,  -10,  0.91 ]
];

// ── DOM refs ──────────────────────────────────────────────────────────────────
const svg          = document.getElementById("clock-svg");
const handGroup    = document.getElementById("hand-group");
const thumbGroup   = document.getElementById("thumbnails");
const tickGroup    = document.getElementById("ticks");
const aLabel       = document.getElementById("activeLabel");
const aName        = document.getElementById("activeName");
const aSub         = document.getElementById("activeSub");
const aLink        = document.getElementById("activeLink");
const cur          = document.getElementById("cursor");
const ring         = document.getElementById("cursor-ring");
const eyePupil     = document.getElementById("eye-pupil");
const eyeGlint     = document.getElementById("eye-glint");
const videoWrap    = document.getElementById("video-wrap");
const previewVideo = document.getElementById("preview-video");
const scene        = document.getElementById("scene");

// ── Helpers ───────────────────────────────────────────────────────────────────
function d2r(deg) { return deg * Math.PI / 180; }
function norm(a)  { return ((a % 360) + 360) % 360; }
function shortDelta(f, t) { let d = norm(t - f); if (d > 180) d -= 360; return d; }
function adiff(a, b)      { return Math.abs(shortDelta(a, b)); }

// ── Video mask — circular hole punched through the wheel area ─────────────────
// The mask is computed in real pixels so it stays perfectly aligned on resize.
// Inside the clock circle: video hidden. Outside: video visible.
function updateVideoMask() {
  const s = Math.min(innerWidth, innerHeight) * 0.88; // scene size in px
  const r = Math.round(s * 0.43);                     // clock outer radius in px (= 0.86 / 2 * s)
  // radial-gradient: transparent inside clock = hides video; black outside = shows video
  const mask = `radial-gradient(circle ${r}px at 50% 50%, transparent 94%, black 100%)`;
  videoWrap.style.webkitMaskImage = mask;
  videoWrap.style.maskImage       = mask;
}
updateVideoMask();
window.addEventListener("resize", updateVideoMask);

// ── Video control — two-element crossfade, stale-callback-safe ───────────────
// Two <video> elements crossfade so there's never a blank frame between videos.
// A generation counter (videoGen) ensures that if the user moves to a new
// project before the previous video has loaded, the stale canplaythrough
// callback does nothing — it checks its captured gen against the current one.

const videoA = previewVideo;
const videoB = document.createElement("video");
videoB.muted      = true;
videoB.loop       = true;
videoB.playsinline = true;
videoB.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.45s ease;";
videoA.style.cssText += ";transition:opacity 0.45s ease;";
videoWrap.appendChild(videoB);

let activeVid       = videoA;
let inactiveVid     = videoB;
let currentVideoSrc = "";
let videoHideTimer  = null;
let videoGen        = 0;           // increments on every new load request

const VIDEO_HIDE_DELAY = 320;     // ms debounce before truly hiding

function swapVideos() {
  activeVid.style.opacity   = "0";
  inactiveVid.style.opacity = "1";
  [activeVid, inactiveVid]  = [inactiveVid, activeVid];
}

function setVideo(index) {
  clearTimeout(videoHideTimer);

  if (index < 0) {
    videoHideTimer = setTimeout(() => {
      videoWrap.classList.remove("active");
      videoA.pause(); videoB.pause();
      // Reset both so no stale frame sits buffered
      videoA.removeAttribute("src"); videoA.load();
      videoB.removeAttribute("src"); videoB.load();
      currentVideoSrc = "";
      videoGen++;   // invalidate any in-flight load
    }, VIDEO_HIDE_DELAY);
    return;
  }

  const src = PROJECTS[index].video || "";
  if (!src) {
    videoHideTimer = setTimeout(() => videoWrap.classList.remove("active"), VIDEO_HIDE_DELAY);
    return;
  }

  // Already playing the right video — just make sure wrap is visible
  if (src === currentVideoSrc) {
    videoWrap.classList.add("active");
    if (activeVid.paused) activeVid.play().catch(() => {});
    return;
  }

  // New source — increment gen so any previous pending callback is invalidated
  const myGen      = ++videoGen;
  currentVideoSrc  = src;

  // Abort whatever the inactive element was doing
  inactiveVid.pause();
  inactiveVid.removeAttribute("src");
  inactiveVid.load();
  inactiveVid.style.opacity = "0";
  inactiveVid.src            = src;
  inactiveVid.load();

  function onReady() {
    if (videoGen !== myGen) return;  // stale — user moved on, ignore
    inactiveVid.play().catch(() => {});
    videoWrap.classList.add("active");
    swapVideos();
  }

  inactiveVid.addEventListener("canplaythrough", onReady, { once: true });

  // If already buffered (cached src), canplaythrough may not re-fire
  if (inactiveVid.readyState >= 3) onReady();
}

// ── Thumbnail — returns image path if provided, falls back to generated canvas ─
function makeThumb(p) {
  if (p.image) return p.image;

  // Placeholder canvas — remove once all projects have real images
  const c = document.createElement("canvas");
  c.width = RW; c.height = RH;
  const x = c.getContext("2d");
  const [c0, c1, c2, c3] = p.colors;

  if (p.pattern === "radial") {
    const g = x.createRadialGradient(RW*.35, RH*.35, 0, RW*.5, RH*.5, RW*.7);
    g.addColorStop(0, c3); g.addColorStop(.4, c2); g.addColorStop(.75, c1); g.addColorStop(1, c0);
    x.fillStyle = g; x.fillRect(0, 0, RW, RH);

  } else if (p.pattern === "grid") {
    x.fillStyle = c0; x.fillRect(0, 0, RW, RH);
    const s = RW / 6;
    x.strokeStyle = c2; x.lineWidth = .5; x.globalAlpha = .45;
    for (let i = 0; i < RW; i += s) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, RH); x.stroke(); }
    for (let i = 0; i < RH; i += s) { x.beginPath(); x.moveTo(0, i); x.lineTo(RW, i); x.stroke(); }
    x.globalAlpha = 1;
    const g2 = x.createRadialGradient(RW*.5, RH*.5, 0, RW*.5, RH*.5, RW*.6);
    g2.addColorStop(0, c3 + "66"); g2.addColorStop(1, "transparent");
    x.fillStyle = g2; x.fillRect(0, 0, RW, RH);

  } else if (p.pattern === "diagonal") {
    const g = x.createLinearGradient(0, RH, RW, 0);
    g.addColorStop(0, c0); g.addColorStop(.4, c1); g.addColorStop(.75, c2); g.addColorStop(1, c3);
    x.fillStyle = g; x.fillRect(0, 0, RW, RH);
    x.strokeStyle = c3; x.lineWidth = .5; x.globalAlpha = .12;
    for (let i = -RH; i < RW + RH; i += 9) { x.beginPath(); x.moveTo(i, RH); x.lineTo(i + RH, 0); x.stroke(); }
    x.globalAlpha = 1;

  } else if (p.pattern === "horizontal") {
    const g = x.createLinearGradient(0, 0, RW, 0);
    g.addColorStop(0, c0); g.addColorStop(.5, c2); g.addColorStop(1, c1);
    x.fillStyle = g; x.fillRect(0, 0, RW, RH);
    x.strokeStyle = c3; x.lineWidth = .5; x.globalAlpha = .18;
    for (let i = 0; i < RH; i += 5) { x.beginPath(); x.moveTo(0, i); x.lineTo(RW, i); x.stroke(); }
    x.globalAlpha = 1;

  } else if (p.pattern === "split") {
    x.fillStyle = c0; x.fillRect(0, 0, RW, RH);
    const g = x.createLinearGradient(0, 0, 0, RH);
    g.addColorStop(0, c3); g.addColorStop(.5, c2); g.addColorStop(1, c1);
    x.fillStyle = g; x.fillRect(0, 0, RW / 2, RH);
    x.fillStyle = c1; x.fillRect(RW / 2, 0, RW / 2, RH);
    x.strokeStyle = c3 + "99"; x.lineWidth = 1;
    x.beginPath(); x.moveTo(RW / 2, 0); x.lineTo(RW / 2, RH); x.stroke();
  }

  return c.toDataURL();
}

// ── Build project clusters ────────────────────────────────────────────────────
PROJECTS.forEach((p) => {
  const rad  = d2r(p.angle - 90);
  const cx   = Math.cos(rad) * OR;
  const cy   = Math.sin(rad) * OR;
  // Use real image path if supplied, otherwise generate a canvas placeholder
  const data = p.image ? p.image : makeThumb(p);

  const cluster = document.createElementNS(NS, "g");

  // Single image — fades in during auto-rotate, stays pinned after hover-out
  const single = document.createElementNS(NS, "image");
  single.setAttribute("href", data);
  single.setAttribute("x", cx - TW / 2);
  single.setAttribute("y", cy - TH / 2);
  single.setAttribute("width", TW);
  single.setAttribute("height", TH);
  single.setAttribute("preserveAspectRatio", "xMidYMid slice");
  single.style.opacity    = "0";
  single.style.transition = "opacity 0.45s ease";
  cluster.appendChild(single);

  // Collage tiles — pop in on hover
  p._tiles = [];
  TILES.forEach(([dx, dy, rot, sc]) => {
    const tx = cx + dx, ty = cy + dy;
    const g  = document.createElementNS(NS, "g");
    g.setAttribute("transform",
      `translate(${tx},${ty}) rotate(${rot}) scale(${sc}) translate(${-TW / 2},${-TH / 2})`);
    g.style.opacity         = "0";
    g.style.transformBox    = "fill-box";
    g.style.transition      = "opacity 0.05s, transform 0.17s cubic-bezier(0.34,1.56,0.64,1)";
    g.style.transformOrigin = `${TW / 2}px ${TH / 2}px`;

    const img = document.createElementNS(NS, "image");
    img.setAttribute("href", data);
    img.setAttribute("x", 0); img.setAttribute("y", 0);
    img.setAttribute("width", TW); img.setAttribute("height", TH);
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    g.appendChild(img);

    const border = document.createElementNS(NS, "rect");
    border.setAttribute("x", 0); border.setAttribute("y", 0);
    border.setAttribute("width", TW); border.setAttribute("height", TH);
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", "rgba(247,245,240,0.5)");
    border.setAttribute("stroke-width", "0.004");
    g.appendChild(border);

    cluster.appendChild(g);
    p._tiles.push(g);
  });

  // Tick mark at orbit ring
  const tick = document.createElementNS(NS, "line");
  tick.setAttribute("x1", Math.cos(rad) * 0.795); tick.setAttribute("y1", Math.sin(rad) * 0.795);
  tick.setAttribute("x2", Math.cos(rad) * 0.815); tick.setAttribute("y2", Math.sin(rad) * 0.815);
  tick.setAttribute("stroke", "rgba(20,18,14,0.13)");
  tick.setAttribute("stroke-width", "0.003");
  tick.setAttribute("stroke-linecap", "round");
  tickGroup.appendChild(tick);

  p._single = single;
  p._ox     = cx;
  p._oy     = cy;

  // Click anywhere on the cluster navigates to the project page
  cluster.style.cursor = "none";
  cluster.addEventListener("click", () => {
    if (p.href) window.location.href = p.href;
  });

  thumbGroup.appendChild(cluster);
});

// ── Gear polygon ──────────────────────────────────────────────────────────────
(function buildGear() {
  const N = 20, rO = 0.066, rI = 0.053;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const a0 = (i / N)          * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.35) / N) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 0.65) / N) * Math.PI * 2 - Math.PI / 2;
    const a3 = ((i + 1)    / N) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${(Math.cos(a0) * rI).toFixed(4)},${(Math.sin(a0) * rI).toFixed(4)}`);
    pts.push(`${(Math.cos(a1) * rO).toFixed(4)},${(Math.sin(a1) * rO).toFixed(4)}`);
    pts.push(`${(Math.cos(a2) * rO).toFixed(4)},${(Math.sin(a2) * rO).toFixed(4)}`);
    pts.push(`${(Math.cos(a3) * rI).toFixed(4)},${(Math.sin(a3) * rI).toFixed(4)}`);
  }
  document.getElementById("eye-gear").setAttribute("points", pts.join(" "));
})();

// ── State ─────────────────────────────────────────────────────────────────────
let handAngle     = 0;
let autoRotate    = true;
let autoStep      = 0;
let pauseCount    = 0;
let lastActive    = -1;
let lastHover     = -1;
let labelTO;
let targetAngle   = 0;
let mX = innerWidth / 2, mY = innerHeight / 2;
let rX = mX, rY = mY;

let svgRect = svg.getBoundingClientRect();
window.addEventListener("resize", () => {
  svgRect = svg.getBoundingClientRect();
  updateVideoMask();
});

// ── Coordinate helpers ────────────────────────────────────────────────────────
function toSVG(clientX, clientY) {
  return {
    x: (clientX - svgRect.left) / svgRect.width  * 2 - 1,
    y: (clientY - svgRect.top)  / svgRect.height * 2 - 1
  };
}

function angleFromMouse(clientX, clientY) {
  const cx = svgRect.left + svgRect.width  / 2;
  const cy = svgRect.top  + svgRect.height / 2;
  return Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI + 90;
}

// ── Label helper ──────────────────────────────────────────────────────────────
function showLabel(index) {
  const p = PROJECTS[index];
  aName.textContent = p.label;
  aSub.textContent  = p.sub;
  aLink.href        = p.href || "#";
  clearTimeout(labelTO);
  aLabel.classList.add("visible");
}

function hideLabel(delay = 300) {
  labelTO = setTimeout(() => aLabel.classList.remove("visible"), delay);
}

// ── Stagger timer management ──────────────────────────────────────────────────
const staggerTimers = [];

function clearStaggerTimers() {
  staggerTimers.forEach(id => clearTimeout(id));
  staggerTimers.length = 0;
}

// ── Hide all thumbnails and video ─────────────────────────────────────────────
function hideAll() {
  clearStaggerTimers();
  clearTimeout(videoHideTimer);
  PROJECTS.forEach(p => {
    p._single.style.opacity = "0";
    p._tiles.forEach(t => { t.style.opacity = "0"; });
  });
  videoWrap.classList.remove("active");
  activeVid.pause();
  inactiveVid.pause();
  currentVideoSrc = "";
  ring.classList.remove("over-cluster");
  lastActive = -1;
  lastHover  = -1;
}

// ── Auto-rotate mode: single image fades, video plays ────────────────────────
function updateAuto(ang) {
  let closest = -1, minD = 999;
  PROJECTS.forEach((p, i) => {
    const df = adiff(ang, p.angle);
    if (df < minD) { minD = df; closest = i; }
  });
  const active = minD < THRESH ? closest : -1;
  if (active === lastActive) return;

  if (lastActive >= 0) PROJECTS[lastActive]._single.style.opacity = "0";
  lastActive = active;

  if (active >= 0) {
    PROJECTS[active]._single.style.opacity = "1";
    showLabel(active);
  } else {
    hideLabel();
    setVideo(-1);
  }
}

// ── Mouse mode: collage pop, video plays, single stays pinned ────────────────
function updateHover(clientX, clientY) {
  const { x, y } = toSVG(clientX, clientY);
  let nearest = -1, minD = 999;
  PROJECTS.forEach((p, i) => {
    const dist = Math.hypot(x - p._ox, y - p._oy);
    if (dist < minD) { minD = dist; nearest = i; }
  });
  const newHover = minD < HOVER_R ? nearest : -1;
  if (newHover === lastHover) return;

  clearStaggerTimers();

  // Leaving a project — hide everything
  if (lastHover >= 0) {
    PROJECTS[lastHover]._tiles.forEach(t => { t.style.opacity = "0"; });
    PROJECTS[lastHover]._single.style.opacity = "0";
  }

  lastHover = newHover;

  if (newHover >= 0) {
    const p = PROJECTS[newHover];
    p._single.style.opacity = "1";

    // Staggered collage pop
    p._tiles.forEach((t, ti) => {
      const id = setTimeout(() => { t.style.opacity = "1"; }, ti * 45);
      staggerTimers.push(id);
    });

    showLabel(newHover);
    setVideo(newHover);

    // Expand cursor ring to signal the cluster is clickable
    ring.classList.add("over-cluster");
  } else {
    hideLabel(200);
    setVideo(-1);
    ring.classList.remove("over-cluster");
  }
}

// ── Events ────────────────────────────────────────────────────────────────────
window.addEventListener("mousemove", e => {
  mX = e.clientX; mY = e.clientY;
  cur.style.left = mX + "px"; cur.style.top = mY + "px";
  if (autoRotate) { hideAll(); autoRotate = false; }
  targetAngle = angleFromMouse(e.clientX, e.clientY);
  updateHover(e.clientX, e.clientY);
});

window.addEventListener("touchmove", e => {
  const t = e.touches[0];
  if (autoRotate) { hideAll(); autoRotate = false; }
  targetAngle = angleFromMouse(t.clientX, t.clientY);
  updateHover(t.clientX, t.clientY);
}, { passive: true });

document.addEventListener("mouseleave", () => {
  hideAll();
  aLabel.classList.remove("visible");
  setTimeout(() => { autoRotate = true; }, 800);
});

document.addEventListener("mouseenter", () => { /* autoRotate disabled on first mousemove */ });

// ── Custom cursor ─────────────────────────────────────────────────────────────
(function animCursor() {
  rX += (mX - rX) * 0.11;
  rY += (mY - rY) * 0.11;
  ring.style.left = rX + "px";
  ring.style.top  = rY + "px";
  requestAnimationFrame(animCursor);
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

// ── Rotating hint ─────────────────────────────────────────────────────────────
// HINTS array and HINT_INTERVAL are defined in projects.js
(function cycleHint() {
  const el = document.getElementById("cornerHint");
  if (!el || typeof HINTS === "undefined" || HINTS.length < 2) return;

  let idx = 0;

  setInterval(() => {
    // Fade out
    el.style.opacity = "0";
    setTimeout(() => {
      idx = (idx + 1) % HINTS.length;
      el.textContent = HINTS[idx];
      // Fade back in
      el.style.opacity = "1";
    }, 420); // slightly longer than the CSS transition (0.4s)
  }, HINT_INTERVAL);
})();

// ── Main animation loop ───────────────────────────────────────────────────────
(function loop() {
  requestAnimationFrame(loop);

  if (autoRotate) {
    const target = norm(PROJECTS[autoStep].angle);
    const delta  = shortDelta(norm(handAngle), target);
    if (Math.abs(delta) < 0.4) {
      if (++pauseCount > PAUSE) {
        pauseCount = 0;
        autoStep   = (autoStep + 1) % PROJECTS.length;
      }
    } else {
      handAngle += delta * 0.028;
    }
    updateAuto(norm(handAngle));
  } else {
    const delta = shortDelta(norm(handAngle), norm(targetAngle));
    handAngle += delta * 0.18;
  }

  handGroup.setAttribute("transform", `rotate(${handAngle})`);

  // Pupil follows the needle
  const rad = (handAngle - 90) * Math.PI / 180;
  const px  = (Math.cos(rad) * PUPIL_T).toFixed(4);
  const py  = (Math.sin(rad) * PUPIL_T).toFixed(4);
  eyePupil.setAttribute("cx", px);
  eyePupil.setAttribute("cy", py);
  eyeGlint.setAttribute("cx", (+px + 0.01).toFixed(4));
  eyeGlint.setAttribute("cy", (+py - 0.014).toFixed(4));
})();