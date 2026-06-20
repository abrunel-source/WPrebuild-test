// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Update `site` to the production domain before launch.
  site: 'https://floridaclinicians.org',
  // Static by default; API routes opt into on-demand rendering via `prerender = false`.
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
