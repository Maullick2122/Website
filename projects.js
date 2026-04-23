// ─────────────────────────────────────────────────────────────────────────────
//  PROJECTS CONFIG
//  Edit this file to add, remove, or reorder projects on the wheel.
//
//  Each entry needs:
//
//    label   — display name shown in the sidebar
//    sub     — subtitle / discipline tag
//    image   — path to your thumbnail image, e.g. "images/3d-thumb.jpg"
//              Recommended size: 400×250px landscape (matches the wheel ratio)
//              Leave as "" to use the generated colour placeholder instead
//    colors  — fallback colours used when image is "" [dark → light, 4 values]
//    pattern — fallback fill style when image is "":
//              "grid" | "radial" | "diagonal" | "horizontal" | "split"
//    href    — path to the project page (relative or absolute)
//    video   — path to a preview video file (mp4 recommended, can be "")
//
//  Angles around the wheel are distributed automatically — just
//  add or remove entries and everything repositions itself.
// ─────────────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    label:   "Cinematics & CGI",
    sub:     "Showreel",
    image:   "Renders/Cliff.png",                                          // e.g. "images/3d-thumb.jpg"
    colors:  ["#1a0f2e", "#3d2878", "#6b47c4", "#c4aaff"],
    pattern: "grid",
    href:    "Projects/Showreel/Project_Showreel.html",
    video:   "/Website/Projects/Background vids/Blackhole20001-0120 copy.mp4"
  },
  {
    label:   "Engines",
    sub:     "Graphics & Rendering",
    image:   "Projects/Engine/Engine Thumbnail.png",                                          // e.g. "images/lighting-thumb.jpg"
    colors:  ["#1a0800", "#6b2a00", "#d4580a", "#ffb347"],
    pattern: "radial",
    href:    "Projects/Engine/engine.html",
    video:   "Projects/Engine/Videos/PPT.mp4"
  },
  {
    label:   "Art Direction",
    sub:     "Environmental Storytelling",
    image:   "/Website/Renders/OneMoreDream.png",                                          // e.g. "images/art-direction-thumb.jpg"
    colors:  ["#001a12", "#004d38", "#008060", "#60ddb8"],
    pattern: "diagonal",
    href:    "Projects/Art Direction/environment_concepts.html",
    video:   "/Website/Projects/Background vids/0001-0230.mp4"
  },
  {
    label:   "3D scanning",
    sub:     "LiDar & Photogrammetry | GooseyMoo",
    image:   "Renders/Goosey.png",                                          // e.g. "images/cinematics-thumb.jpg"
    colors:  ["#0d0d1a", "#1a1a40", "#2e3a7a", "#7090c0"],
    pattern: "horizontal",
    href:    "https://www.fab.com/sellers/GooseyMoo",
    video:   "/Website/Projects/3D Scanning/Lidar.mp4"
  },
  {
    label:   "XR & Immersive",
    sub:     "VR | AR | MR",
    image:   "",                                          // e.g. "images/animation-thumb.jpg"
    colors:  ["#1a0020", "#500060", "#a020c0", "#e090f0"],
    pattern: "radial",
    href:    "/Website/Projects/Immersive/Immersive.html",
    video:   "/Website/Videos/Vuforia Prototype 2.mp4"
  },
  {
    label:   "Video editing",
    sub:     "Editing & Documentation",
    image:   "Myself/09.png",                                          // e.g. "images/colour-grading-thumb.jpg"
    colors:  ["#0a0a00", "#303000", "#707000", "#d4cc00"],
    pattern: "split",
    href:    "/Website/Placeholder/Placeholder.html",
    video:   "/Website/Projects/Background vids/ColourGrade.mp4"
  },
  {
    label:   "Client Work",
    sub:     "3D printing and Props",
    image:   "",                                          // e.g. "images/illustration-thumb.jpg"
    colors:  ["#1a0008", "#600020", "#c0004a", "#f07090"],
    pattern: "diagonal",
    href:    "/Website/Placeholder/Placeholder.html",
    video:   ""
  },
  {
    label:   "Archive",
    sub:     "Older works & Videos",
    image:   "",                                          // e.g. "images/vfx-thumb.jpg"
    colors:  ["#001a1a", "#004040", "#008080", "#00e0e0"],
    pattern: "grid",
    href:    "/Website/Archive/archive.html",
    video:   ""
  }
];

// Auto-distribute angles evenly — do not edit this line
PROJECTS.forEach((p, i) => { p.angle = Math.round(i * 360 / PROJECTS.length); });

// ─────────────────────────────────────────────────────────────────────────────
//  ROTATING HINT — bottom-right label on the index page.
//  Add, remove, or reorder strings freely.
//  HINT_INTERVAL : milliseconds between each change (default 3500)
// ─────────────────────────────────────────────────────────────────────────────
const HINTS = [
  "Start moving your cursor",
  "Hover to reveal",
  "Which direction will art go",
  "Flowers are my favourite pieces of art",
  "Did you know, Roses are related to apples and almonds.",
  "Tulip bulbs can be substituted for onions in a recipe",
  "Moon flowers bloom only at night, closing during the day",
  "Oh, you're still here",
  "Remember to watch some cool art in art direction",
  "Now then, where was I?",
  "Flowers are not just planted for their beauty but can be used as ‘companion plants’ to help the growth of other plants",
  "International Flower Day is January 19.",
  "Flowers can hear buzzing bees",
  "There are over 300,000 different species of flowering plants in the world!",
  "Flowers are art, that is one of natures direction of art"
];
 
const HINT_INTERVAL = 6000; // ms
