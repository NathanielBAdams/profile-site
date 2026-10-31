import { defineConfig, devices } from '@playwright/test';

// Desktop screenshot tests: they guard the dialed-in desktop design while
// the phone layout changes. Baselines live in tests/visual/__screenshots__
// and are made on Linux (in CI, or `npm run test:visual:docker` on a Mac),
// because fonts render slightly differently on each OS.
const PORT = 4400;

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      // A whisker of anti-aliasing noise is fine; a moved element is not.
      maxDiffPixelRatio: 0.001,
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  },
  webServer: {
    command: `npx astro build && npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
