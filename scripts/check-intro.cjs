const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.goto(process.env.TEST_URL || 'http://localhost:3107', { waitUntil: 'networkidle' });
    for (const width of [1920, 1440, 1280, 1024, 768, 640, 390, 375]) {
      await page.setViewportSize({ width, height: 900 });
      const rows = await page.locator('section[aria-labelledby="intro-title"] ol li').evaluateAll(items => items.map(li => {
        const [before, after] = li.querySelectorAll('p');
        return {
          before: Math.round(before.getBoundingClientRect().width),
          after: Math.round(after.getBoundingClientRect().width),
          afterHeight: Math.round(after.getBoundingClientRect().height),
          column: getComputedStyle(after).gridColumnStart,
        };
      }));
      console.log(width, rows);
      assert.equal(rows.length, 3, `${width}px: expected three intro rows`);
      for (const row of rows) {
        if (width >= 640) assert.equal(row.column, '2', `${width}px: solution must use column 2`);
        assert.ok(row.after >= 200, `${width}px: solution paragraph only ${row.after}px wide`);
        assert.ok(row.afterHeight < 180, `${width}px: solution paragraph excessively tall`);
      }
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
