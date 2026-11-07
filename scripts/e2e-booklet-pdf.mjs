/**
 * Desktop (Chromium PDF iframe, toolbar hidden) + mobile (PDF.js canvas) smoke tests.
 * Requires dev server on PORT (default 3000).
 */
import { chromium } from "playwright";

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

async function dismissIntake(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("rehnumai_booklet_index_intro", "1");
    localStorage.setItem("rehnumai_public_intake_submitted", "1");
  });
}

const root = await waitForServer();

async function testDesktopNative(browser, base) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await dismissIntake(page);
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });

  const iframe = page.locator("iframe.booklet-viewer__native");
  await iframe.waitFor({ state: "visible", timeout: 120_000 });

  const src0 = await iframe.getAttribute("src");
  if (!src0?.includes("toolbar=0")) {
    throw new Error(`Desktop iframe should hide toolbar; src=${src0}`);
  }

  const travel = page.getByRole("button", { name: /Safe travel|محفوظ سفر/ });
  await travel.click();
  await page.waitForTimeout(1200);

  const src1 = await iframe.getAttribute("src");
  if (!src1?.includes("page=")) {
    throw new Error(`Desktop index should set page hash; src=${src1}`);
  }

  console.log("e2e-booklet-pdf: desktop native OK");
  await page.close();
}

async function testMobileCanvas(browser, base) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await dismissIntake(page);
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });

  const native = await page.locator("iframe.booklet-viewer__native").count();
  if (native > 0) throw new Error("Mobile must use PDF.js canvas, not iframe");

  const pages = page.locator(".booklet-viewer__pages");
  await pages.waitFor({ state: "visible", timeout: 120_000 });

  await page.waitForFunction(
    () => {
      const canvas = document.querySelector(".booklet-viewer__page");
      if (!canvas) return false;
      return canvas instanceof HTMLCanvasElement && canvas.width > 10 && canvas.height > 10;
    },
    { timeout: 120_000 },
  );

  const contents = page.getByRole("button", { name: /Booklet contents|کتابچے کی فہرست/ }).first();
  await contents.click();
  await page.locator(".booklet-index-panel--overlay").waitFor({ state: "visible", timeout: 15_000 });
  await page.getByRole("button", { name: /Preface|پیش لفظ/ }).click();
  await page.waitForTimeout(900);

  const scroll = page.locator(".booklet-viewer__scroll");
  const scrollTop = await scroll.evaluate(el => el.scrollTop);
  if (scrollTop < 30) {
    throw new Error(`Mobile index did not scroll PDF; scrollTop=${scrollTop}`);
  }

  console.log("e2e-booklet-pdf: mobile canvas OK");
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  await testDesktopNative(browser, root);
  await testMobileCanvas(browser, root);
  console.log("e2e-booklet-pdf: all checks passed");
} finally {
  await browser.close();
}
