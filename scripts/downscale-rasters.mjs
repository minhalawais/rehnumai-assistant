/**
 * Shrink oversized rasters in public/ and keep the same URL.
 * Skips SVG, the favicon/manifest icon ladder, and the Open Graph lockup.
 */
import { readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const BRAND_KEEP = new Set([
  "manzil-mark-16.png",
  "manzil-mark-32.png",
  "manzil-mark-48.png",
  "manzil-mark-64.png",
  "manzil-mark-96.png",
  "manzil-mark-128.png",
  "manzil-mark-180.png",
  "manzil-mark-192.png",
  "manzil-mark-512.png",
  "manzil-app-icon-192.png",
  "manzil-app-icon-512.png",
  "manzil-lockup.png",
]);

function capFor(rel) {
  const posix = rel.split(path.sep).join("/");
  if (posix.startsWith("fonts/") || posix.startsWith("cmaps/") || posix.startsWith("standard_fonts/") || posix.startsWith("pdfium/")) {
    return null;
  }
  if (posix.startsWith("brand/")) {
    const name = path.posix.basename(posix);
    if (BRAND_KEEP.has(name)) return null;
    return 640;
  }
  if (posix.startsWith("menu-icons/guide/")) return 512;
  if (posix.startsWith("menu-icons/")) return 1280;
  if (/^guide\/(apps|portals|remittance-brands|return-support)\//.test(posix)) return 256;
  if (posix.startsWith("guide/")) return 1280;
  if (posix.startsWith("support/")) return 256;
  if (!posix.includes("/")) return 256;
  return null;
}

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

async function downscale(file, cap) {
  const beforeStat = await stat(file);
  const before = await sharp(file).metadata();
  const width = before.width ?? 0;
  const height = before.height ?? 0;
  const longest = Math.max(width, height);
  if (!width || !height || longest <= cap) return false;

  const buffer = await sharp(file)
    .rotate()
    .resize({ width: cap, height: cap, fit: "inside", withoutEnlargement: true })
    .toBuffer();
  if (buffer.length >= beforeStat.size) {
    console.log(`${path.relative(PUBLIC, file)}  kept (${width}x${height}, resize was larger)`);
    return false;
  }

  const tmp = `${file}.tmp`;
  await writeFile(tmp, buffer);
  await rename(tmp, file);
  const after = await stat(file);
  console.log(`${path.relative(PUBLIC, file)}  ${width}x${height} -> ${Math.round(after.size / 1024)} KB`);
  return true;
}

const files = await walk(PUBLIC);
let changed = 0;
for (const file of files) {
  if (!RASTER.has(path.extname(file).toLowerCase())) continue;
  const cap = capFor(path.relative(PUBLIC, file));
  if (!cap) continue;
  if (await downscale(file, cap)) changed += 1;
}
console.log(`Downscaled ${changed} file(s).`);
