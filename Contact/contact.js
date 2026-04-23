// CURSOR
const cur = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");

let mX = innerWidth / 2, mY = innerHeight / 2;
let rX = mX, rY = mY;

window.addEventListener("mousemove", e => {
  mX = e.clientX;
  mY = e.clientY;

  cur.style.left = mX + "px";
  cur.style.top = mY + "px";
});

(function animate() {
  rX += (mX - rX) * 0.1;
  rY += (mY - rY) * 0.1;

  ring.style.left = rX + "px";
  ring.style.top = rY + "px";

  requestAnimationFrame(animate);
})();

// GRAIN
const canvas = document.getElementById("grain");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

(function draw() {
  const img = ctx.createImageData(canvas.width, canvas.height);

  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = v;
    img.data[i+1] = v;
    img.data[i+2] = v;
    img.data[i+3] = 255;
  }

  ctx.putImageData(img, 0, 0);
  requestAnimationFrame(draw);
})();