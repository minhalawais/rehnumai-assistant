/**
 * Validates curated index targets against PDF text (pdf.js).
 * Run: node scripts/verify-booklet-index.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pdfPath = join(root, "public", "migration-booklet.pdf");

/** Expected: index page -> unique substring that should appear on that PDF page (1-based). */
const CHECKS = [
  [2, "پیش لفظ"],
  [5, "مالزمت کے رجحانات"],
  [6, "غیر قانونی ہجرت"],
  [9, "بیرون ملک جانے کی پالننگ"],
  [12, "بی ای ا و ای"],
  [14, "خواتین مائیگرینٹس"],
  [17, "بیرون ملک روانگی"],
  [18, "سفر سے قبل"],
  [20, "بیرون ملک آمد"],
  [24, "کارکنان کے حقوق"],
  [33, "رق وم کی منتقلی"],
  [36, "پاکستان واپسی"],
  [43, "Rehnumai Centers"],
  [50, "Complaint Mechanisms"],
];

const data = new Uint8Array(readFileSync(pdfPath));
const doc = await getDocument({ data }).promise;
let failed = 0;

for (const [page, needle] of CHECKS) {
  const pdfPage = await doc.getPage(page);
  const text = (await pdfPage.getTextContent()).items.map(i => i.str).join(" ");
  if (!text.includes(needle)) {
    console.error(`FAIL page ${page}: missing "${needle}"`);
    failed += 1;
  } else {
    console.log(`OK page ${page}`);
  }
}

console.log(`PDF pages: ${doc.numPages}`);
process.exit(failed ? 1 : 0);
