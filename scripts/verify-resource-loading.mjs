import { chromium } from "playwright";

const base = process.env.PORT ? `http://127.0.0.1:${process.env.PORT}` : "http://127.0.0.1:3001";

function track(page, bag) {
  page.on("response", async (response) => {
    const url = response.url();
    if (!/woff2|_next\/image|FaizLahori|menu-icons|\/guide\//.test(url)) return;
    const len = Number(response.headers()["content-length"] || 0);
    bag.push({ url: url.slice(0, 180), status: response.status(), bytes: len });
  });
}

const browser = await chromium.launch();
const bag = [];

const guide = await browser.newPage({ viewport: { width: 390, height: 844 } });
track(guide, bag);
await guide.goto(`${base}/guide/rights`, { waitUntil: "domcontentloaded", timeout: 120_000 });
await guide.waitForSelector(".guide__title", { state: "attached", timeout: 60_000 });
await guide.waitForTimeout(1500);
const resources = await guide.evaluate(() =>
  performance.getEntriesByType("resource").map((entry) => ({
    name: entry.name.slice(0, 200),
    size: entry.transferSize,
  })),
);
await guide.evaluate(() => {
  document.querySelector(".app-splash")?.remove();
  document.querySelector(".app-intro")?.remove();
  document.querySelector(".app-launch-gate__behind")?.classList.remove("app-launch-gate__behind");
});
await guide.locator(".guide__title").screenshot({ path: "scripts/verify-guide-title.png" });
const fontName = await guide.evaluate(() => getComputedStyle(document.querySelector(".guide__title")).fontFamily);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.addInitScript(() => {
  sessionStorage.setItem("rehnumai_booklet_index_intro", "1");
});
await mobile.goto(`${base}/booklet`, { waitUntil: "domcontentloaded", timeout: 120_000 });
await mobile.waitForSelector(".booklet-viewer__page-wrap", { state: "attached", timeout: 90_000 });
await mobile.waitForTimeout(1500);
const booklet = await mobile.evaluate(() => ({
  wraps: document.querySelectorAll(".booklet-viewer__page-wrap").length,
  canvases: document.querySelectorAll("canvas.booklet-viewer__page").length,
  native: document.querySelectorAll("iframe.booklet-viewer__native").length,
}));

const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await desktop.goto(`${base}/booklet`, { waitUntil: "domcontentloaded", timeout: 60_000 });
await desktop.waitForSelector("iframe.booklet-viewer__native", { state: "attached", timeout: 30_000 });
const desktopNative = await desktop.locator("iframe.booklet-viewer__native").count();
const desktopCanvas = await desktop.locator("canvas.booklet-viewer__page").count();

await browser.close();

const fonts = resources.filter((row) => row.name.includes("woff2"));
const images = resources.filter((row) => row.name.includes("/_next/image"));
const faiz = resources.filter((row) => row.name.includes("Faiz"));
console.log(JSON.stringify({ fontName, booklet, desktopNative, desktopCanvas, imageCount: images.length, faiz }, null, 2));
