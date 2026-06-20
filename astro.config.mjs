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
  // Simple page-slug 301s live here; path-prefix wildcard redirects from the
  // old WordPress CPT URLs are in vercel.json (Vercel routing layer).
  redirects: {
    '/home': '/',
    '/privacy-policy': '/privacy',
    '/terms-and-conditions': '/terms',
    '/news-and-newsletters': '/news',
    '/team-members': '/team',
    '/partners': '/funders',
    '/c-hot': '/project-c-hot',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
