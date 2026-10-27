import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.nathaniel-adams.com',
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
});
