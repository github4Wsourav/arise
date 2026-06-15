/** Dev-only visual check: capture the dashboard themed at several tiers. */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

await mkdir('screenshots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 400, height: 870 } });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.getByText('STATUS WINDOW').waitFor({ timeout: 15_000 });
await page.evaluate(async () => await window.arise.seed(8));
await page.getByText('DAILY QUESTS').waitFor({ timeout: 15_000 });

const tiers = [
  { i: 0, lvl: '001' },
  { i: 4, lvl: '041' },
  { i: 6, lvl: '061' },
  { i: 7, lvl: '071' },
  { i: 9, lvl: '100' },
];
for (const t of tiers) {
  await page.evaluate(
    ({ i, lvl }) => {
      window.arise.theme(i);
      const img = document.querySelector('.character-img');
      if (img) img.setAttribute('src', `/assets/characters/lvl_${lvl}.webp`);
    },
    t,
  );
  await page.waitForTimeout(900);
  await page.screenshot({ path: `screenshots/tier-${t.i + 1}.png`, fullPage: true });
  console.log(`captured tier ${t.i + 1}`);
}
await page.evaluate(async () => await window.arise.reset());
await browser.close();
console.log('done');
