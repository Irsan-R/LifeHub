import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = process.env.LIFEHUB_BASE_URL ?? 'http://localhost:3000';

test('Today responsive layout and interactions', async () => {
  const browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  try {
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 960 : 844 }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      await page.goto(`${base}/today?demo=1`);
      await page.waitForSelector('h1');
      const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
      assert.ok(metrics.scrollWidth <= metrics.clientWidth, `horizontal overflow at ${width}: ${JSON.stringify(metrics)}`);
      const visibleNav = width <= 800 ? '.bottom-nav' : '.side-nav';
      assert.equal(await page.locator(`${visibleNav} .nav-link`).count(), 4);
      if (width === 1440) await page.screenshot({ path: 'docs/design/today-desktop-implementation.png' });
      if (width === 390) {
        await page.screenshot({ path: 'docs/design/today-mobile-implementation.png' });
        const geometry = await page.evaluate(() => ({ fab: document.querySelector('.mobile-capture').getBoundingClientRect().bottom, tabs: document.querySelector('.bottom-nav').getBoundingClientRect().top }));
        assert.ok(geometry.fab < geometry.tabs, 'capture button overlaps bottom navigation');
        await page.getByRole('button', { name: 'Search', exact: true }).click();
        await page.getByLabel('Search across your connected objects').fill('internet');
        assert.equal(await page.getByRole('dialog').getByRole('link', { name: /Internet bill/ }).count(), 1);
        await page.keyboard.press('Escape');
        await page.getByRole('checkbox', { name: 'Complete Review the weekly plan' }).click();
        assert.equal(await page.getByRole('checkbox', { name: 'Reopen Review the weekly plan' }).getAttribute('aria-checked'), 'true');
        await page.getByRole('button', { name: 'Quick capture' }).click();
        await page.getByLabel('Capture text').fill('Call the dentist');
        await page.getByRole('button', { name: 'Review', exact: true }).click();
        await page.getByRole('button', { name: 'Save to preview Inbox' }).click();
        assert.equal(await page.getByText('Saved in preview').count(), 1);
        await page.getByRole('button', { name: 'Done' }).click();
        await page.locator('.bottom-nav').getByRole('link', { name: 'Inbox' }).click();
        await page.getByText('Call the dentist').waitFor();
      }
      await context.close();
    }
    const page = await browser.newPage();
    await page.goto(`${base}/today?demo=1&state=empty`);
    assert.equal(await page.getByText('Needs attention').count(), 0);
    assert.equal(await page.getByText('Nothing on your priority list').count(), 1);
    await page.goto(`${base}/today?state=error`);
    assert.equal(await page.getByText('Today is not connected yet').count(), 1);
    await page.close();
  } finally { await browser.close(); }
});
