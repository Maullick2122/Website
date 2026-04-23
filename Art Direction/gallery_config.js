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
    title:  "Gelid Yuth",
    sub:    "Environment Concept | Character design | Prop Design | Cloth design | Volumetics & Rendering",
    media: [
      { type: "image", src: "/Website/Renders/Gelid/Render_2.png",},
      { type: "video", src: "/Website/Renders/Gelid/gelid yuth.mp4",},
      { type: "image", src: "/Website/Renders/Gelid/Render_1.png",},
      { type: "image", src: "/Website/Renders/Gelid/12.png",},
      { type: "image", src: "/Website/Renders/Gelid/Texture_Showcase.png",},
      { type: "image", src: "/Website/Renders/Gelid/1.png",},
      { type: "image", src: "/Website/Renders/Gelid/3.png",},
      { type: "video", src: "/Website/Renders/Gelid/2.mov",},
    ]
  },
 {
    title:  "Change",
    sub:    "Environment | Cloth | Custom Models | Volumetrics",
    media: [
    { type: "image", src: "/Website/Renders/Change/showcase4.png" },
    { type: "image", src: "/Website/Renders/Change/2.png" },
    { type: "image", src: "/Website/Renders/Change/3.png" },
    { type: "image", src: "/Website/Renders/Change/Annotation.png" },
    { type: "image", src: "/Website/Renders/Change/Cloth annotation.png" },
    { type: "image", src: "/Website/Renders/Change/Particles.png" },
    { type: "video", src: "/Website/Renders/Change/Iridecence.mp4" },
    { type: "video", src: "/Website/Renders/Change/Change.mp4" },
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
    title:  "Artroom",
    sub:    "Lighting Study | Basic Modelling | Environment Concept | Volumetics & Rendering",
    media: [
      { type: "image", src: "/Website/Renders/Artroom/Artroom1.JPEG"},
      { type: "image", src: "/Website/Renders/Artroom/Artroom2.JPEG"},
      { type: "image", src: "/Website/Renders/Artroom/Artroom3.JPEG"},
      { type: "image", src: "/Website/Renders/Artroom/Lighting.png"},
      { type: "image", src: "/Website/Renders/Artroom/Artroom-Clay.png"},
      { type: "video", src: "/Website/Renders/Artroom/Environment Showcase.mp4"},
    ]
  },
  
  {
    title:  "Just Some Props",
    sub:    "Prop Modelling | Concepts | Blender | Substance Painter",
    media: [
      { type: "image", src: "/Website/Renders/Just some props/gun4(PS).png", },
      { type: "image", src: "/Website/Renders/Just some props/Wow.jpg", },
      { type: "image", src: "/Website/Renders/Just some props/ID.png", },
      { type: "image", src: "/Website/Renders/Just some props/Alt_1.png", },
      { type: "image", src: "/Website/Renders/Just some props/Gun3.png", },
      { type: "image", src: "/Website/Renders/Just some props/Prop.png", },
    ]
  },
  {
    title:  "Final Major Project",
    sub:    "University Project | Short animated film (2023-24)",
    href:   "https://youtu.be/icCwZnxJMOE",
    media: [
      { type: "image", src: "", colors: ["#1a0400","#480c00","#a02000","#ff5800"] },
      { type: "video", src: "", poster: "" },
      { type: "image", src: "", colors: ["#1c0600","#500e00","#a82200","#ff6000"] }
    ]
  },
  {
    title:  "Open Up",
    sub:    "3D Scanning | Photorealism | Fisheye | Mandella Catalogue style",
    media: [
      { type: "image", src: "/Website/Renders/Open up/Fisheye-post.png"},
      { type: "image", src: "/Website/Renders/Open up/Fisheye-1.png"},
      { type: "image", src: "/Website/Renders/Open up/Fisheye-clay.png"},
      { type: "video", src: "/Website/Renders/Open up/Showcase.mp4"},
    ]
  },
  {
    title:  "Haiku",
    sub:    "Ghost of Tsushima inpired | Environment art | Blender | Photoshop ",
    media: [
      { type: "image", src: "/Website/Renders/Haiku/Kurosawa Insp Tree Haiku 1@2x.png",},
      { type: "image", src: "/Website/Renders/Haiku/Kurosawa Insp Tree Haiku 2@2x.png",},
      { type: "image", src: "/Website/Renders/Haiku/Kurosawa Insp Tree Haiku 3@2x.png",},
      { type: "image", src: "/Website/Renders/Haiku/Showcase4.png",},
      { type: "image", src: "/Website/Renders/Haiku/Showcase5.png",},
      
    ]
  },
  {
    title:  "Hunters Dream",
    sub:    "Remake of Hunters dream | Bloodborne | Architecture Modelling | Remake ",
    media: [
      { type: "image", src: "", colors: ["#0e1400","#202e00","#486800","#90d000"] },
      { type: "image", src: "", colors: ["#0c1200","#1e2c00","#446400","#88c800"] },
      { type: "image", src: "", colors: ["#101600","#223000","#4a6c00","#98d800"] }
    ]
  },
  {
    title:  "Mitski Collection",
    sub:    "Poster made for Songs",
    media: [
      { type: "image", src: "/Website/Renders/Mitski Posters/Heaven.png",},
      { type: "image", src: "/Website/Renders/Mitski Posters/TheFrost.png",},
      { type: "image", src: "/Website/Renders/Mitski Posters/The deal.png",},
      { type: "image", src: "/Website/Renders/Mitski Posters/MoonLight1@3x.png",},
      { type: "image", src: "/Website/Renders/Mitski Posters/I dont like my mind (bonus track).png",},
    ]
  },
  {
    title:  "Grace of the Sun",
    sub:    "Animation | Snow | Particles | Robe",
    media: [
      { type: "image", src: "/Website/Renders/Sun/Grace of the Sun@2x.png"},
      { type: "image", src: "/Website/Renders/Sun/Grace of the Sun 2@2x.png"},
      { type: "image", src: "/Website/Renders/Sun/Grace of the Sun 3@2x.png"},
      { type: "image", src: "/Website/Renders/Sun/Grace of the Sun 4@2x.png"},
      { type: "video", src: "/Website/Renders/Sun/With you.mp4"},
    ]
  },
  {
    title:  "Walking Home",
    sub:    "Draconic Environment | Dragon Rig | Dragon Texture | Jagged rock modelling | Cloud volumetrics",
    media: [
      { type: "image", src: "/Website/Renders/Walking Home/03.png", },
      { type: "image", src: "/Website/Renders/Walking Home/01.png", },
      { type: "image", src: "/Website/Renders/Walking Home/02.png", },
      { type: "image", src: "/Website/Renders/Walking Home/Walk-1-Annotation.png", },
      { type: "image", src: "/Website/Renders/Walking Home/Walk-1.png", },
    
    ]
  }
];