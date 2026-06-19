// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Update `site` to your production URL when deploying.
  site: 'https://example.com',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
