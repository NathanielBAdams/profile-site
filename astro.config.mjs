import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO: update to the real custom domain once one is set up
export default defineConfig({
  site: 'https://nathaniel-adams.com',
  integrations: [react(), sitemap()],
});
