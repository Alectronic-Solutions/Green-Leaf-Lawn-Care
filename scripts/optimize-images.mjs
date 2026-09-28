// Build-time image pipeline for the static export (there is no image server
// on GitHub Pages).
//
// 1. Converts any PNG dropped into public/images/ to WebP (and removes the
//    PNG), so you can add photos straight from a camera or design tool.
// 2. Renders every photo at each width next/image can request into
//    public/images/_w/ (git-ignored, regenerated on every build).
//    src/lib/image-loader.ts points <Image> at those files.
//
// Runs automatically before `dev` and `build`. Existing outputs that are
// newer than their source are skipped, so repeat runs are fast.
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

// Must match images.deviceSizes + images.imageSizes in next.config.ts.
const WIDTHS = [96, 256, 384, 640, 960, 1280, 1920];

const imagesDir = join(import.meta.dirname, "..", "public", "images");
const outDir = join(imagesDir, "_w");
await mkdir(outDir, { recursive: true });

async function mtime(path) {
  try {
    return (await stat(path)).mtimeMs;
  } catch {
    return 0;
  }
}

// Step 1: PNG sources -> WebP.
for (const file of await readdir(imagesDir)) {
  if (extname(file).toLowerCase() !== ".png") continue;
  const src = join(imagesDir, file);
  const dest = join(imagesDir, `${basename(file, extname(file))}.webp`);
  await sharp(src).webp({ quality: 78, effort: 6 }).toFile(dest);
  await unlink(src);
  console.log(`converted ${file} -> ${basename(dest)}`);
}

// Step 2: responsive widths.
let made = 0;
for (const file of await readdir(imagesDir)) {
  const ext = extname(file).toLowerCase();
  if (![".webp", ".jpg", ".jpeg"].includes(ext)) continue;
  const src = join(imagesDir, file);
  const srcTime = await mtime(src);
  const name = basename(file, extname(file));
  for (const width of WIDTHS) {
    const dest = join(outDir, `${name}-${width}.webp`);
    if ((await mtime(dest)) > srcTime) continue;
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 384 ? 70 : 74, effort: 5 })
      .toFile(dest);
    made++;
  }
}
console.log(`optimize-images: ${made} responsive image${made === 1 ? "" : "s"} written`);
