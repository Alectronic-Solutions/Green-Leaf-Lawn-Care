// Converts public/images/*.png to .webp for smaller page weight. Static
// export (`output: "export"`) has no server-side image optimizer, so this is
// a build-time, repeatable substitute. Run: bun run optimize-images
//
// Only PNGs are converted: they hold the photographic source renders here
// and WebP shrinks them meaningfully. Existing JPEGs (e.g. the hero poster)
// are already lossy-compressed, so re-encoding them as WebP at a comparable
// quality tends to grow the file rather than shrink it — skip those.
import { readdir, unlink } from "node:fs/promises";
import { extname, join, basename } from "node:path";
import sharp from "sharp";

const imagesDir = join(import.meta.dirname, "..", "public", "images");

const files = await readdir(imagesDir);
const sourceFiles = files.filter((f) => extname(f).toLowerCase() === ".png");

for (const file of sourceFiles) {
  const srcPath = join(imagesDir, file);
  const destPath = join(imagesDir, `${basename(file, extname(file))}.webp`);

  await sharp(srcPath).webp({ quality: 72, effort: 6 }).toFile(destPath);
  await unlink(srcPath);

  console.log(`${file} -> ${basename(destPath)}`);
}
