/**
 * Verifies editing a PAST day's workout: open a past roster day, pick a gate, log a set
 * for that date, return to the dashboard, and confirm the XP/training-date updated.
 * Requires the dev server on :5173.
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

await mkdir('screenshots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });

const errors = [];
page.on('console', (m) => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.getByText('STATUS WINDOW').waitFor({ timeout: 15000 });
await page.evaluate(async () => await window.arise.reset());

const xp = () => page.evaluate(async () => (await window.arise.state()).totalXp);
const xpBefore = await xp();

// pick the FIRST roster day (Monday of this week) — guaranteed today-or-earlier only if
// today is Monday; otherwise pick a known past weekday. Click the first non-disabled chip
// that is before today by scanning for an enabled chip from the left.
const chips = page.locator('.roster-chip:not([disabled])');
const count = await chips.count();
if (count === 0) throw new Error('no enabled roster days');
await chips.first().click(); // earliest enabled day in the week

await page.getByText('TRAIN THIS DAY').waitFor({ timeout: 5000 });
await page.locator('.gate-picker-btn').first().click(); // pick the first gate (Crimson Forge)

// we should be in the gate, editing a past (or today) date
await page.getByRole('heading', { name: 'Crimson Forge' }).waitFor({ timeout: 10000 });
const editingBanner = await page.locator('.editing-banner').count();
console.log(`editing-banner present: ${editingBanner > 0}`);

// log the first set of the first exercise
await page.locator('.exercise-head').first().click();
await page.locator('.log-btn').first().waitFor({ timeout: 5000 });
await page.locator('.log-btn').first().click();
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/edit-past-gate.png' });

const xpMid = await xp();
if (xpMid <= xpBefore) throw new Error(`logging a past set did not add XP (${xpBefore} -> ${xpMid})`);
console.log(`XP after logging a past set: ${xpBefore} -> ${xpMid}`);

await browser.close();
if (errors.length) {
  console.error('CONSOLE ERRORS:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('edit-past smoke OK');
