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
    title:  "MR Showcase",
    sub:    "VR Courtroom | Mixed reality | Quest 3 | Unity",
    media: [
      { type: "video", src: "/Website/Projects/Immersive/Videos/Crimshowcase.MP4",},
  
    ]
  },
 {
    title:  "Vr Environment Showcase",
    sub:    "Environment | Quest 1 & 2 | Custom Models | VR",
    media: [
    { type: "video", src: "/Website/Projects/Immersive/Videos/Vr.MP4",},
  ]
  },
  
];