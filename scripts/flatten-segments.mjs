// Post-build fix for Next 16 static export + client prefetching.
//
// The export writes route segment data as nested folders, for example
//   out/services/lawn-mowing/__next.!KHNpdGUp/services/$d$slug.txt
// but the client router requests a flat, dot-joined name:
//   out/services/lawn-mowing/__next.!KHNpdGUp.services.$d$slug.txt
// Static hosts like GitHub Pages then answer 404 and every link prefetch
// fails. This copies each nested segment file to the flat name the client
// asks for. Runs automatically after `npm run build`.
import { copyFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

const out = join(import.meta.dirname, "..", "out");

async function walk(dir, visit) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, visit);
    else await visit(p);
  }
}

let copied = 0;
async function flattenSegmentDir(segDir) {
  await walk(segDir, async (file) => {
    if (!file.endsWith(".txt")) return;
    const rel = relative(segDir, file).split(sep).join(".");
    const flat = join(dirname(segDir), `${segDir.split(sep).pop()}.${rel}`);
    await copyFile(file, flat);
    copied++;
  });
}

try {
  await stat(out);
} catch {
  console.log("flatten-segments: no out/ folder, skipping");
  process.exit(0);
}

// Find every "__next.<hash>" directory anywhere in the export.
async function findSegmentDirs(dir, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const p = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) found.push(p);
    else if (entry.name !== "_next") await findSegmentDirs(p, found);
  }
  return found;
}

for (const segDir of await findSegmentDirs(out)) await flattenSegmentDir(segDir);
console.log(`flatten-segments: ${copied} segment file${copied === 1 ? "" : "s"} flattened`);
