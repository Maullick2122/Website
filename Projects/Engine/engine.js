// ── Placeholder canvas ────────────────────────────────────────────────────────
function makePlaceholder(colors, w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  const [c0, c1, c2, c3] = colors;

  const g = x.createLinearGradient(0, h, w, 0);
  g.addColorStop(0, c0); g.addColorStop(0.38, c1);
  g.addColorStop(0.72, c2); g.addColorStop(1, c3);
  x.fillStyle = g; x.fillRect(0, 0, w, h);

  x.strokeStyle = c3; x.lineWidth = 0.4; x.globalAlpha = 0.06;
  for (let i = -h; i < w + h; i += 11) {
    x.beginPath(); x.moveTo(i, h); x.lineTo(i + h, 0); x.stroke();
  }
  x.globalAlpha = 1;

  const vig = x.createRadialGradient(w/2, h/2, h*0.15, w/2, h/2, h*0.9);
  vig.addColorStop(0, "transparent");
  vig.addColorStop(1, "rgba(0,0,0,0.5)");
  x.fillStyle = vig; x.fillRect(0, 0, w, h);

  return c;
}

// ── Build a card preview element (always an image/canvas for the thumbnail) ───
function makeCardThumb(item) {
  if (item.type === "video") {
    // Use the poster image if provided, otherwise a dark placeholder canvas
    if (item.poster) {
      const img = document.createElement("img");
      img.src = item.poster; img.alt = ""; img.draggable = false;
      return { el: img, isVideo: true };
    }
    // No poster — dark placeholder with a centred play icon drawn on canvas
    const colors = ["#0c0a08","#181410","#2c2820","#484440"];
    return { el: makePlaceholder(colors, 600, 400), isVideo: true };
  }
  // Image item
  if (item.src) {
    const img = document.createElement("img");
    img.src = item.src; img.alt = ""; img.draggable = false;
    return { el: img, isVideo: false };
  }
  return { el: makePlaceholder(item.colors, 600, 400), isVideo: false };
}

// ── Build a lightbox media element ────────────────────────────────────────────
function makeLightboxEl(item) {
  if (item.type === "video") {
    const wrap = document.createElement("div");
    wrap.className = "lb-video-item";
    wrap.style.cssText = "flex-shrink:0;width:100%;display:flex;align-items:center;justify-content:center;background:#000;";

    const vid = document.createElement("video");
    vid.src = item.src || "";
    vid.poster = item.poster || "";
    vid.loop   = item.loop !== false;
    vid.muted  = false;
    vid.playsinline = true;
    vid.preload = "metadata";
    vid.controls = true;
    vid.style.cssText = "max-width:100%;max-height:80vh;display:block;";
    wrap.appendChild(vid);
    return wrap;
  }

  // Image
  if (item.src) {
    const img = document.createElement("img");
    img.src = item.src; img.alt = ""; img.draggable = false;
    img.style.cssText = "flex-shrink:0;width:100%;height:auto;max-height:80vh;object-fit:contain;display:block;";
    return img;
  }

  const c = makePlaceholder(item.colors, 600, 400);
  c.style.cssText = "flex-shrink:0;width:100%;height:auto;max-height:80vh;display:block;";
  return c;
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
const galleryMain      = document.getElementById("galleryMain");
const collectionCount  = document.getElementById("collectionCount");
const lightbox         = document.getElementById("lightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lbClose          = document.getElementById("lbClose");
const lbPrev           = document.getElementById("lbPrev");
const lbNext           = document.getElementById("lbNext");
const lbImageTrack     = document.getElementById("lbImageTrack");
const lbTitle          = document.getElementById("lbTitle");
const lbSub            = document.getElementById("lbSub");
const lbCurrent        = document.getElementById("lbCurrent");
const lbTotal          = document.getElementById("lbTotal");
const lbDots           = document.getElementById("lbDots");
const cur              = document.getElementById("cursor");
const ring             = document.getElementById("cursor-ring");

// ── Build gallery cards ───────────────────────────────────────────────────────
collectionCount.textContent = `${GALLERY_COLLECTIONS.length} collections`;

GALLERY_COLLECTIONS.forEach((col, colIdx) => {
  const card = document.createElement("div");
  card.className = "collection-card";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");

  const wrap = document.createElement("div");
  wrap.className = "card-image-wrap";

  const { el: thumbEl, isVideo } = makeCardThumb(col.media[0]);
  wrap.appendChild(thumbEl);

  // Play icon overlay if the first item is a video
  if (isVideo) {
    const playBadge = document.createElement("div");
    playBadge.className = "card-play-badge";
    playBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="6,3 20,12 6,21" fill="currentColor"/></svg>`;
    wrap.appendChild(playBadge);
  }

  // Media count badge
  const badge = document.createElement("span");
  badge.className = "card-badge";
  const imgCount = col.media.filter(m => m.type === "image").length;
  const vidCount = col.media.filter(m => m.type === "video").length;
  const parts = [];
  if (imgCount) parts.push(`${imgCount} image${imgCount > 1 ? "s" : ""}`);
  if (vidCount) parts.push(`${vidCount} video${vidCount > 1 ? "s" : ""}`);
  badge.textContent = parts.join(" · ");
  wrap.appendChild(badge);

  // Hover scrim
  const scrim = document.createElement("div");
  scrim.className = "card-scrim";
  wrap.appendChild(scrim);

  card.appendChild(wrap);

  // Labels
  const labels = document.createElement("div");
  labels.className = "card-labels";

  const title = document.createElement("span");
  title.className = "card-title";
  title.textContent = col.title;

  const sub = document.createElement("span");
  sub.className = "card-sub";
  sub.textContent = col.sub;

  labels.appendChild(title);
  labels.appendChild(sub);
  card.appendChild(labels);

  const open = () => openLightbox(colIdx);
  card.addEventListener("click", open);
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") open(); });

  card.addEventListener("mouseenter", () => ring.classList.add("over-card"));
  card.addEventListener("mouseleave", () => ring.classList.remove("over-card"));

  galleryMain.appendChild(card);
});

// ── Lightbox state ────────────────────────────────────────────────────────────
let lbCollection = null;
let lbIndex      = 0;

function stopAllVideos() {
  lbImageTrack.querySelectorAll("video").forEach(v => { v.pause(); v.currentTime = 0; });
}

function buildLightboxMedia(col) {
  lbImageTrack.innerHTML = "";
  lbDots.innerHTML = "";

  col.media.forEach((item, i) => {
    const el = makeLightboxEl(item);
    lbImageTrack.appendChild(el);

    const dot = document.createElement("div");
    dot.className = "lb-dot" + (i === 0 ? " active" : "");
    lbDots.appendChild(dot);
  });
}

function goTo(idx) {
  const total = lbCollection.media.length;

  // Pause video on the slide we're leaving
  const current = lbImageTrack.children[lbIndex];
  if (current) { const v = current.querySelector("video") || (current.tagName === "VIDEO" ? current : null); if (v) { v.pause(); v.currentTime = 0; } }

  lbIndex = ((idx % total) + total) % total;
  lbImageTrack.style.transform = `translateX(-${lbIndex * 100}%)`;
  lbCurrent.textContent = String(lbIndex + 1);

  lbDots.querySelectorAll(".lb-dot").forEach((d, i) => {
    d.classList.toggle("active", i === lbIndex);
  });

  // Auto-play video if the new slide is a video item with a src
  const next = lbImageTrack.children[lbIndex];
  if (next) {
    const v = next.querySelector("video");
    if (v && v.src) v.play().catch(() => {});
  }
}

function openLightbox(colIdx) {
  lbCollection = GALLERY_COLLECTIONS[colIdx];
  lbIndex = 0;

  buildLightboxMedia(lbCollection);
  lbTitle.textContent = lbCollection.title;
  lbSub.textContent   = lbCollection.sub;
  lbTotal.textContent = String(lbCollection.media.length);
  goTo(0);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  stopAllVideos();
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lbCollection = null;
}

// ── Lightbox controls ─────────────────────────────────────────────────────────
lbClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", e => { e.stopPropagation(); goTo(lbIndex - 1); });
lbNext.addEventListener("click", e => { e.stopPropagation(); goTo(lbIndex + 1); });

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape")     closeLightbox();
  if (e.key === "ArrowLeft")  goTo(lbIndex - 1);
  if (e.key === "ArrowRight") goTo(lbIndex + 1);
});

// Touch swipe
let swipeX = null;
lightbox.addEventListener("touchstart", e => { swipeX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend",   e => {
  if (swipeX === null) return;
  const dx = e.changedTouches[0].clientX - swipeX;
  if (Math.abs(dx) > 40) goTo(lbIndex + (dx < 0 ? 1 : -1));
  swipeX = null;
}, { passive: true });

// ── Custom cursor ─────────────────────────────────────────────────────────────
let mX = innerWidth / 2, mY = innerHeight / 2, rX = mX, rY = mY;

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
const gc = document.getElementById("grain"), gx = gc.getContext("2d");
function resizeGrain() { gc.width = innerWidth; gc.height = innerHeight; }
resizeGrain();
window.addEventListener("resize", resizeGrain);
let gf = 0;
(function drawGrain() {
  if (++gf % 3 === 0) {
    const id = gx.createImageData(gc.width, gc.height);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      id.data[i] = id.data[i+1] = id.data[i+2] = v; id.data[i+3] = 255;
    }
    gx.putImageData(id, 0, 0);
  }
  requestAnimationFrame(drawGrain);
})();