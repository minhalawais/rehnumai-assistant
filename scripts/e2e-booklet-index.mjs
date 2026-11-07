/**
 * Browser smoke test for booklet index (requires dev or start server on PORT).
 * Run: node scripts/e2e-booklet-index.mjs
 */
import { chromium } from "playwright";

const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const port = Number(process.env.PORT ?? 3000);

async function waitForServer() {
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return url;
    } catch {
      /* retry */
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server not reachable at ${url}`);
}

const root = await waitForServer();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.addInitScript(() => {
  sessionStorage.setItem("rehnumai_booklet_index_intro", "1");
  localStorage.setItem("rehnumai_public_intake_submitted", "1");
});

await page.goto(`${root}/`, { waitUntil: "domcontentloaded" });
await page.locator(".booklet-viewer__pages").waitFor({ state: "visible", timeout: 120_000 });

const contentsBtn = page.getByRole("button", { name: /Booklet contents|کتابچے کی فہرست/ });
await contentsBtn.waitFor({ state: "visible", timeout: 30_000 });
await contentsBtn.click();
await page.locator(".booklet-index-panel--overlay").waitFor({ state: "visible", timeout: 15_000 });

const preface = page.getByRole("button", { name: /Preface|پیش لفظ/ });
await preface.click();

await contentsBtn.waitFor({ state: "visible", timeout: 10_000 });

const scroll = page.locator(".booklet-viewer__scroll");
await page.waitForFunction(
  el => el.scrollHeight > el.clientHeight + 80,
  await scroll.elementHandle(),
  { timeout: 90_000 },
);

const before = await scroll.evaluate(el => el.scrollTop);
await page.waitForTimeout(800);
const after = await scroll.evaluate(el => el.scrollTop);
if (after < 40 && before < 40) {
  throw new Error(`Expected scroll to preface (page 2); scrollTop=${after}`);
}

const scrollDelta = await scroll.evaluate(el => {
  const start = el.scrollTop;
  el.scrollTop = start + 220;
  return el.scrollTop - start;
});
if (scrollDelta < 50) {
  throw new Error("PDF viewer did not scroll after TOC jump");
}

await contentsBtn.click();
await page.locator(".booklet-index-panel--overlay").waitFor({ state: "visible" });
await page.getByRole("button", { name: /Close contents|فہرست بند کریں/ }).click();
await page.locator(".booklet-index-panel--overlay").waitFor({ state: "hidden" });

console.log("e2e-booklet-index: OK");
await browser.close();
