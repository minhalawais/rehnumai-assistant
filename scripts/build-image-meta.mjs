/**
 * Write intrinsic pixel sizes for public rasters so next/image can reserve
 * the right aspect ratio. SVG is omitted; those stay on a plain img.
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const OUT = path.resolve("src/lib/image-meta.json");
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function displayedSize(meta) {
  let width = meta.width ?? 0;
  let height = meta.height ?? 0;
  const orientation = meta.orientation ?? 1;
  if (orientation >= 5) [width, height] = [height, width];
  return { width, height };
}

const meta = {};
for (const file of await walk(PUBLIC)) {
  if (!RASTER.has(path.extname(file).toLowerCase())) continue;
  const info = displayedSize(await sharp(file).metadata());
  if (!info.width || !info.height) continue;
  const rel = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
  meta[rel] = info;
}

const keys = Object.keys(meta).sort();
const ordered = {};
for (const key of keys) ordered[key] = meta[key];
await writeFile(OUT, JSON.stringify(ordered, null, 2) + "\n");
console.log(`Wrote ${keys.length} image sizes to ${path.relative(process.cwd(), OUT)}`);
