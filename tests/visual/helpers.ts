import type { Page } from '@playwright/test';

export const PAGES = [
  { name: 'home', path: '/' },
  { name: 'contracting', path: '/choral-contracting/' },
  { name: 'composition', path: '/composition/' },
  { name: 'performance', path: '/performance/' },
  { name: 'software', path: '/software/' },
];

// Desktop layouts start at 834px; these cover each breakpoint band.
export const DESKTOP_WIDTHS = [1440, 1280, 1024, 834];

// Parts of the page that come from other sites (YouTube stills, SoundCloud)
// and can change on their own. They're masked out of the comparison.
export const EXTERNAL = ['.watch-thumb', '.yt'];

// Loads a page into a steady state: no outside requests, fonts loaded, every
// image (lazy ones too) decoded, scrolled back to the top.
export async function settle(page: Page, path: string) {
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  await page.goto(path);
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.querySelectorAll('img')) img.loading = 'eager';
    await Promise.all(
      [...document.querySelectorAll('img')].map((img) =>
        img.complete
          ? null
          : new Promise((r) => {
              img.addEventListener('load', r, { once: true });
              img.addEventListener('error', r, { once: true });
            }),
      ),
    );
    // SVG <image> layers in the traced photos.
    await Promise.all(
      [...document.querySelectorAll('svg image')].map((im) => {
        const src = im.getAttribute('href');
        if (!src) return null;
        const probe = new Image();
        probe.src = src;
        return probe.decode().catch(() => null);
      }),
    );
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(250);
}
