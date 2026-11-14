import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "public", "brand", "Manzil Pakistan Migrant Workers App.png");
const BRAND = path.join(ROOT, "public", "brand");

const squareTargets = [
  ["manzil-mark-16.png", 16],
  ["manzil-mark-32.png", 32],
  ["manzil-mark-48.png", 48],
  ["manzil-mark-96.png", 96],
  ["manzil-mark-128.png", 128],
  ["manzil-mark-180.png", 180],
  ["manzil-app-icon-192.png", 192],
  ["manzil-app-icon-512.png", 512],
];

for (const [name, size] of squareTargets) {
  await sharp(SOURCE)
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9, palette: size <= 48 })
    .toFile(path.join(BRAND, name));
}

await sharp(SOURCE)
  .flatten({ background: "#ffffff" })
  .resize(640, 640, { fit: "contain" })
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toFile(path.join(BRAND, "manzil_logo.jpeg"));

const socialLogo = await sharp(SOURCE)
  .resize(570, 570, { fit: "contain" })
  .png()
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 4, background: "#f4f8f6" },
})
  .composite([{ input: socialLogo, left: 315, top: 30 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(BRAND, "manzil-lockup.png"));

await sharp(SOURCE).resize(512, 512, { fit: "contain" }).png({ compressionLevel: 9 }).toFile(path.join(ROOT, "src", "app", "icon.png"));
await sharp(SOURCE).resize(180, 180, { fit: "contain" }).png({ compressionLevel: 9 }).toFile(path.join(ROOT, "src", "app", "apple-icon.png"));

const faviconPng = await sharp(SOURCE).resize(48, 48, { fit: "contain" }).png({ palette: true }).toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(48, 6);
icoHeader.writeUInt8(48, 7);
icoHeader.writeUInt8(0, 8);
icoHeader.writeUInt8(0, 9);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile(path.join(ROOT, "public", "favicon.ico"), Buffer.concat([icoHeader, faviconPng]));

console.log("Generated Manzil logo assets from the new master PNG.");
