import { test, expect } from '@playwright/test';
import { PAGES, DESKTOP_WIDTHS, EXTERNAL, settle } from './helpers';

// Every page, full length, at each desktop width.
for (const width of DESKTOP_WIDTHS) {
  for (const p of PAGES) {
    test(`${p.name} at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await settle(page, p.path);
      await expect(page).toHaveScreenshot(`${p.name}-${width}.png`, {
        fullPage: true,
        mask: EXTERNAL.map((s) => page.locator(s)),
      });
    });
  }
}

// The hover moments, at 1440.
test.describe('hover states at 1440', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('home: hovering the name draws the line to the photo', async ({ page }) => {
    await settle(page, '/');
    await page.locator('[data-me-name="title"]').hover();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('hover-home-name.png');
  });

  test('contracting: hovering Hans lights up both of them', async ({ page }) => {
    await settle(page, '/choral-contracting/');
    const photo = page.locator('[data-photo="hans-zimmer"] .traced');
    await photo.scrollIntoViewIfNeeded();
    const box = (await photo.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.65);
    await page.waitForTimeout(300);
    await expect(photo).toHaveScreenshot('hover-hans.png');
  });

  test('contracting: hovering a credit draws the line to its photo', async ({ page }) => {
    await settle(page, '/choral-contracting/');
    const credit = page.locator('.productions [data-shows="carnegie-hall"] .production-name');
    await credit.scrollIntoViewIfNeeded();
    await credit.hover();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('hover-credit.png');
  });

  test('home: hovering the staff shows the half note', async ({ page }) => {
    await settle(page, '/');
    const staff = page.locator('canvas.staff');
    const box = (await staff.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.76, box.y + box.height * 0.5);
    await page.waitForTimeout(300);
    await expect(page.locator('.hero')).toHaveScreenshot('hover-note.png');
  });

  test('composition: hovering Watch the performance', async ({ page }) => {
    await settle(page, '/composition/');
    const watch = page.locator('.watch').first();
    await watch.scrollIntoViewIfNeeded();
    await watch.hover();
    await page.waitForTimeout(300);
    await expect(watch).toHaveScreenshot('hover-watch.png', { mask: [page.locator('.watch-thumb img')] });
  });

  test('nav: hovering a link moves the underline', async ({ page }) => {
    await settle(page, '/composition/');
    await page.locator('.nav-links a', { hasText: 'Software' }).hover();
    await page.waitForTimeout(300);
    await expect(page.locator('.nav')).toHaveScreenshot('hover-nav.png');
  });
});
