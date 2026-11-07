import { copyFileSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = join(root, "node_modules", "pdfjs-dist");
const src = join(pkg, "build", "pdf.worker.min.mjs");
const dest = join(root, "public", "pdf.worker.min.mjs");

if (!existsSync(src)) {
  console.warn("copy-pdf-worker: pdfjs-dist not installed, skipping");
  process.exit(0);
}

copyFileSync(src, dest);
for (const dir of ["cmaps", "standard_fonts"]) {
  const from = join(pkg, dir);
  const to = join(root, "public", dir);
  if (existsSync(from)) cpSync(from, to, { recursive: true, force: true });
}

