import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const meta = JSON.parse(await readFile("src/lib/image-meta.json", "utf8"));

async function walk(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, acc);
    else if (/\.(tsx|ts|json|css)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const pattern = /["'](\/[^"']+\.(?:png|jpe?g|webp|svg|ico))["']/g;
const missing = new Set();
for (const file of await walk("src")) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(pattern)) {
    const url = match[1];
    if (url.endsWith(".svg") || url.endsWith(".ico")) {
      try {
        await access(path.join("public", decodeURIComponent(url.slice(1))));
      } catch {
        missing.add(url);
      }
    } else if (!meta[url]) {
      missing.add(url);
    }
  }
}

if (missing.size) {
  console.log([...missing].sort().join("\n"));
  process.exitCode = 1;
} else {
  console.log("all referenced images resolve");
}
