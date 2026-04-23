// ─────────────────────────────────────────────────────────────────────────────
//  SHOWREEL CAPTIONS
//
//  Add, remove, or edit caption entries freely.
//  `time`  — seconds into the video when this caption appears
//  `text`  — the caption string (supports italic via the CSS)
//  `label` — optional short label shown in the caption list (defaults to text)
// ─────────────────────────────────────────────────────────────────────────────

const CAPTIONS = [
  { time: 0,    text: "Which direction will art go.",           label: "Intro" },
  { time: 4,    text: "3D — form before texture.",              label: "3D Modelling" },
  { time: 10,   text: "Every shadow is a decision.",            label: "Lighting" },
  { time: 17,   text: "The concept shapes the camera.",         label: "Art Direction" },
  { time: 25,   text: "Cinema is a sequence of choices.",       label: "Cinematics" },
  { time: 33,   text: "Motion is the difference.",              label: "Animation" },
  { time: 41,   text: "Colour is memory before aesthetic.",     label: "Colour Grading" },
  { time: 48,   text: "The first mark is always the most honest.", label: "Illustration" },
  { time: 55,   text: "Reality is only a starting point.",      label: "Visual FX" },
  { time: 62,   text: "The work continues.",                    label: "End" }
];

// ── DOM refs ──────────────────────────────────────────────────────────────────
const video         = document.getElementById("showreel");
const playerWrap    = document.getElementById("playerWrap");
const playOverlay   = document.getElementById("playOverlay");
const playIcon      = document.getElementById("playIcon");
const pauseIcon     = document.getElementById("pauseIcon");
const captionText   = document.getElementById("captionText");
const progressBar   = document.getElementById("progressBar");
const progressFill  = document.getElementById("progressFill");
const progressThumb = document.getElementById("progressThumb");
const timeCurrent   = document.getElementById("timeCurrent");
const timeDuration  = document.getElementById("timeDuration");
const muteBtn       = document.getElementById("muteBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const captionList   = document.getElementById("captionList");
const cur           = document.getElementById("cursor");
const ring          = document.getElementById("cursor-ring");

/* ── Caption list — built once ─────────────────────────────────────────────────
CAPTIONS.forEach((c, i) => {
  const row = document.createElement("div");
  row.className = "caption-row";
  row.dataset.index = i;

  const timeEl = document.createElement("span");
  timeEl.className = "caption-row-time";
  timeEl.textContent = formatTime(c.time);

  const textEl = document.createElement("span");
  textEl.className = "caption-row-text";
  textEl.textContent = c.label || c.text;

  row.appendChild(timeEl);
  row.appendChild(textEl);
  captionList.appendChild(row);
});*/

const captionRows = captionList.querySelectorAll(".caption-row");

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function activeCaptionIndex(t) {
  let idx = -1;
  for (let i = 0; i < CAPTIONS.length; i++) {
    if (t >= CAPTIONS[i].time) idx = i;
    else break;
  }
  return idx;
}

// ── Caption update ────────────────────────────────────────────────────────────
//let lastCaptionIdx = -1;
//let captionFadeTO;

/*function updateCaption(idx) {
  if (idx === lastCaptionIdx) return;
  lastCaptionIdx = idx;

  // Fade out, swap, fade in
  captionText.classList.add("fade");
  clearTimeout(captionFadeTO);
  captionFadeTO = setTimeout(() => {
    captionText.textContent = idx >= 0 ? CAPTIONS[idx].text : "";
    captionText.classList.remove("fade");
  }, 200);

  // Highlight active row in the list
  captionRows.forEach((row, i) => {
    row.classList.toggle("active-caption", i === idx);
  });
}*/

// ── Play / pause ──────────────────────────────────────────────────────────────
function setPlayingState(playing) {
  playIcon.style.display  = playing ? "none"  : "block";
  pauseIcon.style.display = playing ? "block" : "none";
  playerWrap.classList.toggle("paused", !playing);
}

playOverlay.addEventListener("click", () => {
  video.paused ? video.play() : video.pause();
});

video.addEventListener("play",  () => setPlayingState(true));
video.addEventListener("pause", () => setPlayingState(false));
video.addEventListener("ended", () => setPlayingState(false));

// Start paused
setPlayingState(false);

// ── Progress ──────────────────────────────────────────────────────────────────
video.addEventListener("timeupdate", () => {
  if (!video.duration) return;
  const pct = (video.currentTime / video.duration) * 100;
  progressFill.style.width = pct + "%";
  progressThumb.style.left = pct + "%";
  timeCurrent.textContent  = formatTime(video.currentTime);
  updateCaption(activeCaptionIndex(video.currentTime));
});

video.addEventListener("loadedmetadata", () => {
  timeDuration.textContent = formatTime(video.duration);
});

// Click to seek
progressBar.addEventListener("click", e => {
  if (!video.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  video.currentTime = pct * video.duration;
});

// ── Mute ─────────────────────────────────────────────────────────────────────
muteBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  muteBtn.style.opacity = video.muted ? "0.35" : "1";
});

// ── Fullscreen ───────────────────────────────────────────────────────────────
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    playerWrap.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
});

// ── Cursor ───────────────────────────────────────────────────────────────────
let mX = innerWidth / 2, mY = innerHeight / 2;
let rX = mX, rY = mY;

window.addEventListener("mousemove", e => {
  mX = e.clientX; mY = e.clientY;
  cur.style.left = mX + "px"; cur.style.top = mY + "px";
});

playerWrap.addEventListener("mouseenter", () => ring.classList.add("over-player"));
playerWrap.addEventListener("mouseleave", () => ring.classList.remove("over-player"));

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
