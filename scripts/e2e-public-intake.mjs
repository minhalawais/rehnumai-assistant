/**
 * Public intake smoke: modal submit shows reference and stays open until dismiss.
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

const base = await waitForServer();
const browser = await chromium.launch();

async function runMobilePotential() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem("rehnumai_booklet_index_intro", "1");
  });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });

  const start = page.getByRole("button", { name: /Start the form|فارم بھریں/ });
  await start.waitFor({ state: "visible", timeout: 30_000 });
  await start.click();

  await page.locator("label.mobile-choice").filter({ hasText: /Going abroad|بیرون ملک جانے والے/ }).click();
  await page.getByRole("button", { name: /Continue|آگے/ }).click();

  await page.locator("#mobile-full-name").fill("E2E Test Applicant");
  await page.getByRole("button", { name: /Continue|آگے/ }).click();

  await page.locator("#mobile-phone").fill("03001234567");
  await page.getByRole("button", { name: /Continue|آگے/ }).click();

  let safety = 0;
  while (safety < 30) {
    safety += 1;
    const submit = page.getByRole("button", { name: /Submit form|جمع کریں/ });
    if (await submit.isVisible().catch(() => false)) break;
    const next = page.getByRole("button", { name: /Continue|آگے/ });
    if (await next.isEnabled().catch(() => false)) await next.click();
    else break;
    await page.waitForTimeout(150);
  }

  const checkbox = page.getByRole("checkbox");
  if (await checkbox.isVisible().catch(() => false)) await checkbox.check();

  await page.getByRole("button", { name: /Submit form|جمع کریں/ }).click();

  const ref = page.getByText(/MIG-\d{2}-/);
  await ref.waitFor({ state: "visible", timeout: 60_000 });

  const modalDialog = page.locator(".intake-modal__dialog");
  await modalDialog.waitFor({ state: "visible" });

  await page.getByRole("button", { name: /Back to booklet|کتابچہ پر واپس/ }).click();
  await modalDialog.waitFor({ state: "hidden", timeout: 15_000 });

  await context.close();
  console.log("e2e-public-intake: mobile potential flow OK");
}

try {
  await runMobilePotential();
} finally {
  await browser.close();
}
