// ─────────────────────────────────────────────────────────────────────────────
//  ARCHIVE CONFIG
//  Two sections: MEDIA (what appears) and PHYSICS (how it behaves).
//
//  MEDIA items — add, remove, or reorder freely:
//    type    : "image" | "video"
//    src     : file path
//    width   : display width in px (height auto-preserves aspect ratio)
//              Use this to vary item sizes for visual interest.
//    label   : optional caption shown below item in fullscreen
//
//  PHYSICS — tune each value to change the simulation feel:
//    gravity         : downward pull strength (1 = Earth-like, 2 = heavier)
//    restitution     : bounciness 0–1  (0 = dead stop, 1 = perfectly elastic)
//    friction        : surface-to-surface friction (0 = ice, 1 = grippy)
//    frictionAir     : air resistance (0 = floats, 0.05 = sluggish)
//    frictionStatic  : resistance before an item starts sliding
//    density         : mass per unit area (heavier items need more force)
//    shakeThreshold  : device acceleration (m/s²) to trigger a shake event
//    shakeForce      : impulse magnitude applied to each item on shake
//    spawnDelay      : ms between each item being dropped in on load
//    spawnFrom       : "top" | "random"  — where items enter the scene
//    cornerRadius    : px rounding on each item (0 = sharp, 20 = pill-like)
//    wallThickness   : invisible wall thickness in px (keep ≥ 60)
// ─────────────────────────────────────────────────────────────────────────────

const ARCHIVE_MEDIA = [
  { type: "image", src: "/Website/RendersArchive/image1.jpg", width: 180, label: "" },
  { type: "image", src: "/Website/RendersArchive/image2.jpg", width: 220, label: "" },
  { type: "image", src: "/Website/RendersArchive/image3.jpg", width: 150, label: "" },
  { type: "image", src: "/Website/RendersArchive/image4.jpg", width: 200, label: "" },
  { type: "image", src: "/Website/RendersArchive/image5.jpg", width: 240, label: "" },
  { type: "image", src: "/Website/RendersArchive/image6.jpg", width: 160, label: "" },
  { type: "image", src: "/Website/RendersArchive/image7.jpg", width: 190, label: "" },
//  { type: "image", src: "/Website/RendersArchive/image8.jpg", width: 210, label: "" },
//  { type: "image", src: "/Website/RendersArchive/image22.jpg", width: 170, label: "Storyboard — frame 04" },
//  { type: "image", src: "/Website/RendersArchive/image10.jpg", width: 200, label: "Illustration — line work" },
//  { type: "image", src: "/Website/RendersArchive/image11.jpg", width: 230, label: "Showreel cut — cinematic" },
//  { type: "image", src: "/Website/RendersArchive/image12.jpg", width: 155, label: "Environment concept" }
];

const ARCHIVE_PHYSICS = {
  gravity:        1.2,    // downward pull
  restitution:    0.28,   // bounciness — M&M-like, not bouncy balls
  friction:       0.55,   // surface grip
  frictionAir:    0.015,  // air drag — low = floaty, high = sluggish
  frictionStatic: 0.5,    // how much force needed to start moving
  density:        0.003,  // mass density — affects how shake forces feel

  shakeThreshold: 12,     // m/s² — lower = more sensitive to shake
  shakeForce:     0.07,   // impulse on each item when shake detected

  spawnDelay:     80,     // ms between each item drop (staggered cascade)
  spawnFrom:      "top",  // "top" = fall from top edge, "random" = random x

  cornerRadius:   8,      // px — item border-radius
  wallThickness:  80      // px — invisible boundary walls
};
