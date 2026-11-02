import { defineConfig, devices } from '@playwright/test';

// Desktop screenshot tests: they guard the dialed-in desktop design while
// the phone layout changes.
//
// Fonts render a hair differently from one machine to the next, so each
// environment compares against baselines made in that same environment:
// - ci: GitHub Actions (Playwright's Linux image). These are committed, and
//   are the ones that count. `npm run test:visual:docker` runs the same image
//   on a Mac. To approve a desktop change, run the workflow by hand with
//   "update baselines" checked; it commits the new images.
// - local: any other machine (git-ignored). Made with test:visual:update.
const PORT = 4400;
const SET = process.env.CI ? 'ci' : 'local';

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: `{testDir}/__screenshots__/${SET}/{arg}{ext}`,
  fullyParallel: true,
  retries: 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]]
    : 'list',
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
