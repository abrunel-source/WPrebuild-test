// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Update `site` to the production domain before launch.
  site: 'https://floridaclinicians.org',
  // Static by default; API routes opt into on-demand rendering via `prerender = false`.
  output: 'static',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
