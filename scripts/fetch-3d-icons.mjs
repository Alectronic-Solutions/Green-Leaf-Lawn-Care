// Downloads the 3D icon set used across the site from Microsoft's Fluent
// Emoji (MIT licensed, https://github.com/microsoft/fluentui-emoji) and
// converts each render to a small WebP in public/icons/3d/.
//
// To add an icon: add a row below (site name -> Fluent folder name), run
// `npm run fetch-icons`, then add the name to the Icon3DName union in
// src/components/site/icon-3d.tsx.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ICONS = {
  seedling: "Seedling",
  leaf: "Leaf fluttering in wind",
  herb: "Herb",
  "fallen-leaf": "Fallen leaf",
  "maple-leaf": "Maple leaf",
  "sheaf": "Sheaf of rice",
  tree: "Deciduous tree",
  evergreen: "Evergreen tree",
  tulip: "Tulip",
  blossom: "Blossom",
  sun: "Sun",
  snowflake: "Snowflake",
  snowman: "Snowman without snow",
  ice: "Ice",
  droplet: "Droplet",
  bug: "Bug",
  broom: "Broom",
  house: "House with garden",
  phone: "Telephone receiver",
  mobile: "Mobile phone",
  chat: "Speech balloon",
  calendar: "Spiral calendar",
  shield: "Shield",
  star: "Star",
  "glowing-star": "Glowing star",
  pin: "Round pushpin",
  map: "World map",
  stopwatch: "Stopwatch",
  clock: "Alarm clock",
  paw: "Paw prints",
  receipt: "Receipt",
  repeat: "Counterclockwise arrows button",
  tractor: "Tractor",
  envelope: "Envelope",
  trophy: "Trophy",
  medal: "1st place medal",
  sparkles: "Sparkles",
  lock: "Locked",
  money: "Money bag",
  memo: "Memo",
  clipboard: "Clipboard",
  ruler: "Straight ruler",
  tools: "Hammer and wrench",
  bulb: "Light bulb",
  books: "Books",
  camera: "Camera with flash",
  briefcase: "Briefcase",
  id: "Identification card",
  gift: "Wrapped gift",
  party: "Party popper",
  flag: "Chequered flag",
  joystick: "Joystick",
  speaker: "Speaker high volume",
  muted: "Muted speaker",
  link: "Link",
  search: "Magnifying glass tilted left",
  rock: "Rock",
  dog: "Dog",
  hourglass: "Hourglass not done",
  "sun-cloud": "Sun behind small cloud",
  coin: "Coin",
  handshake: "Handshake",
  bell: "Bell",
  hundred: "Hundred points",
};

// Hue rotations (degrees) that pull off-palette renders into the site's
// earthy greens and warm golds, so every icon reads as one family.
const HUE_SHIFT = {
  shield: -120,
  phone: 150,
  repeat: -120,
  mobile: -130,
  speaker: -120,
  muted: -120,
  search: -120,
  id: -120,
  "maple-leaf": 55,
  pin: 45,
  chat: -150,
  envelope: -150,
};

const outDir = join(import.meta.dirname, "..", "public", "icons", "3d");
await mkdir(outDir, { recursive: true });

function sourceUrl(folder) {
  // Skin-toned emoji keep their 3D render under a "Default" subfolder.
  const file = `${folder.toLowerCase().replace(/ /g, "_")}_3d`;
  const enc = encodeURIComponent(folder);
  return [
    `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${enc}/3D/${file}.png`,
    `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${enc}/Default/3D/${file}_default.png`,
  ];
}

let failed = 0;
for (const [name, folder] of Object.entries(ICONS)) {
  let buf = null;
  for (const url of sourceUrl(folder)) {
    const res = await fetch(url);
    if (res.ok) {
      buf = Buffer.from(await res.arrayBuffer());
      break;
    }
  }
  if (!buf) {
    console.warn(`missing: ${name} (${folder})`);
    failed++;
    continue;
  }
  let img = sharp(buf);
  if (HUE_SHIFT[name]) img = sharp(await img.modulate({ hue: HUE_SHIFT[name] }).png().toBuffer());
  const webp = await img
    .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88, alphaQuality: 90, effort: 6 })
    .toBuffer();
  await writeFile(join(outDir, `${name}.webp`), webp);
  console.log(`${name}.webp  ${(webp.length / 1024).toFixed(1)} KB`);
}

if (failed) process.exitCode = 1;
