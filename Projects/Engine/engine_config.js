// ─────────────────────────────────────────────────────────────────────────────
//  ENVIRONMENT CONCEPTS — GALLERY CONFIG
//
//  Edit this file to manage all collections. Each entry:
//
//    title   — main label shown below the collection card
//    sub     — short description / subtitle beneath the title
//    media   — array of media items. Each item can be an IMAGE or a VIDEO:
//
//      IMAGE item:
//        { type: "image", src: "images/my-shot.jpg", colors: [...] }
//        src    — path to the image file. Leave "" for a placeholder.
//        colors — 4-stop gradient [dark→light] used when src is "".
//
//      VIDEO item:
//        { type: "video", src: "videos/my-clip.mp4", poster: "images/thumb.jpg" }
//        src    — path to the video file (mp4 recommended).
//        poster — optional thumbnail shown before the video plays. Can be "".
//        loop   — optional boolean, defaults to true.
//
//    The card always previews the FIRST item in the media array.
//    For a video-first card, the card thumbnail uses the poster image (or a
//    play-icon placeholder if poster is also empty).
//
//  To add a collection: copy any entry and append it to the array.
//  To remove one: delete its entry.
//  To reorder: drag entries up or down in the array.
//  Collections flow 3 per row automatically.
// ─────────────────────────────────────────────────────────────────────────────

const GALLERY_COLLECTIONS = [
  {
    title:  "Unity HDRP | Tape Mechanic",
    sub:    "Volumetics & Rendering | Mac M1 Optimisation | 3D modelling & texturing",
    media: [
       { type: "video", src: "/Website/Projects/Engine/VCR/Tape_Mechanic.mp4", caption: "HDRP Mac study — interior scene" },
      { type: "image", src: "/Website/Projects/Engine/VCR/Concepts.png" },
      { type: "video", src: "/Website/Projects/Engine/VCR/Model view.mov" },
      { type: "image", src: "/Website/Projects/Engine/VCR/Blender_Concept.png", caption: "Blender look test" },
      { type: "image", src: "/Website/Projects/Engine/VCR/Render_1.png" },
      { type: "image", src: "/Website/Projects/Engine/VCR/Render_2_Reflections.png", caption: "Reflection probe testing"},
    ]

  },
 {
    title:  "Unity HDRP | Outdoor Scene",
    sub:    "Environment | Custom Models | Volumetrics",
    media: [
    { type: "video", src: "/Website/Projects/Engine/Videos/HDRP_Practice.mp4" },
    { type: "image", src: "/Website/Projects/Engine/Project images/Pillar1.png", caption: "Reflection probe testing"},
    { type: "image", src: "/Website/Projects/Engine/Project images/Pillar2.png", caption: "Reflection probe testing"},
  ]
  },

  {
    title:  "2.5D",
    sub:    "Prototype | Rendering study | Blender | Animation",
    media: [
      { type: "image", src: "/Website/Renders/Emotion Engine/Rival.png" },
      { type: "image", src: "/Website/Renders/Emotion Engine/City render.png" },
      { type: "image", src: "/Website/Renders/Emotion Engine/Gun_Annotations.png" },
      { type: "video", src: "/Website/Renders/Emotion Engine/0001-0048.mp4" }, 
      { type: "image", src: "/Website/Renders/Emotion Engine/Gun3.png" },
      { type: "video", src: "/Website/Renders/Emotion Engine/Intro_2.mov" },
      { type: "image", src: "/Website/Renders/Emotion Engine/depth.png" },
    ]
  },
  {
    title:  "Unity HDRP | Indoor scene",
    sub:    "Lighting Study | Ray tracing | Photogrammetry ",
    media: [
      { type: "video", src: "/Website/Projects/Engine/Videos/Sunshine_On_My_Bed 2.mp4" },
      { type: "image", src: "/Website/Projects/Engine/Project images/Room1.png", caption: "Reflection probe testing"},
      { type: "image", src: "/Website/Projects/Engine/Project images/Room2.png", caption: "Reflection probe testing"},
      { type: "image", src: "/Website/Projects/Engine/Project images/Room3.png", caption: "Reflection probe testing"},
      { type: "image", src: "/Website/Projects/Engine/Project images/Room3.5.png", caption: "Reflection probe testing"},
    ]
  },
  
  {
    title:  "Live Link Unity",
    sub:    "Motion capture | Unity",
    media: [
        { type: "video", src: "/Website/Projects/Engine/Videos/live_link_unity.mp4" },
    ]
  },
  {
    title:  "Unity URP | Level Design | Game development",
    sub:    "University Project | Game design | 6-week project",
    media: [
      { type: "video", src: "/Website/Projects/Engine/Videos/Big_Little_problems_V.1.2_(Web).mp4" },
    ]
  },
];