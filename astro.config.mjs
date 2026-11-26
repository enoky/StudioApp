// @ts-check
import { defineConfig } from 'astro/config';
import { serviceWorker } from './integrations/service-worker.mjs';

// GitHub Pages serves this repo at https://<user>.github.io/<repo>/.
// The deploy workflow passes the real path in BASE_PATH, so forks work too.
const base = process.env.BASE_PATH || '/StudioApp';
const site = process.env.SITE_URL || 'https://enoky.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [serviceWorker()],
});
