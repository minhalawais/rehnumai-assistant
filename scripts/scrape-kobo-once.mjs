import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("https://ee.kobotoolbox.org/x/qwfnBGI6", { waitUntil: "networkidle", timeout: 120000 });
const fields = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll(".question").forEach(q => {
    const label =
      q.querySelector(".question-label")?.textContent?.trim() ||
      q.querySelector("legend")?.textContent?.trim() ||
      "";
    const inputs = q.querySelectorAll("input, select, textarea");
    const names = [...new Set([...inputs].map(el => el.getAttribute("name")).filter(Boolean))];
    const type = inputs[0]?.type || inputs[0]?.tagName?.toLowerCase();
    const choices = [];
    q.querySelectorAll("label.item-label, .option-wrapper label").forEach(l => {
      const t = l.textContent?.trim();
      if (t) choices.push(t);
    });
    const required = !!q.querySelector(".required-flag") || inputs[0]?.hasAttribute("required");
    const hidden = getComputedStyle(q).display === "none" || q.classList.contains("or-appearance-hide");
    if (label) out.push({ label, names, type, choices, required, hidden });
  });
  return out;
});
fs.writeFileSync(".tmp-kobo-scrape.json", JSON.stringify(fields, null, 2));
console.log("fields", fields.length);
await browser.close();
