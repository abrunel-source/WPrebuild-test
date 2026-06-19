# WPrebuild — WordPress → Astro

A rebuild of a WordPress site (originally running the **Hello Elementor** theme)
as a fast, static [Astro](https://astro.build) site. It preserves the original
theme's structure and design system while shipping zero JavaScript by default.

## Why a rebuild instead of a port?

The uploaded WordPress files were the Hello Elementor *theme* — the scaffolding
(`header.php`, `index.php`, `functions.php`, `theme.json`). The actual page
content of an Elementor site lives in the WordPress database, not in these files,
so what's reconstructable is the theme's **structure and design tokens**. Those
have been recreated faithfully in Astro, with representative content you can
replace.

## How the WordPress theme maps to Astro

| WordPress (Hello Elementor)            | Astro |
| -------------------------------------- | ----- |
| `header.php` + footer location         | `src/layouts/BaseLayout.astro` |
| `template-parts/header.php`            | `src/components/Header.astro` |
| Footer menu location                   | `src/components/Footer.astro` |
| `index.php` template routing           | file-based routing in `src/pages/` |
| `template-parts/archive.php` (loop)    | `src/pages/blog/index.astro` |
| `template-parts/single.php`            | `src/pages/blog/[...slug].astro` |
| `template-parts/search.php`            | `src/pages/search.astro` |
| `template-parts/404.php`               | `src/pages/404.astro` |
| `theme.json` design tokens             | CSS custom properties in `src/styles/global.css` |
| `functions.php` `register_nav_menus()` | `src/data/site.ts` |
| `title-tag` + description meta support | `<head>` in `BaseLayout.astro` |
| "Skip to content" link                 | skip link in `BaseLayout.astro` |

### Design tokens carried over from `theme.json`

- `layout.contentSize` `800px` → `--content-size`
- `layout.wideSize` `1200px` → `--wide-size`
- Custom colors, typography, and spacing scales

## Project structure

```
src/
  components/    Header, Footer, PostCard, FormattedDate
  content/blog/  Markdown blog posts (the "loop" content)
  data/site.ts   Site identity + header/footer menus
  layouts/       BaseLayout (head, header, footer, skip link)
  pages/         index, blog/, about, contact, privacy, search, 404
  styles/        global.css (reset + design tokens)
public/          favicon and static assets
```

## Editing content

- **Blog posts** — add Markdown files to `src/content/blog/`. Frontmatter:
  `title`, `description`, `pubDate`, optional `author`, `tags`, `updatedDate`, `draft`.
- **Menus & site identity** — `src/data/site.ts`.
- **Design tokens / styling** — `src/styles/global.css`.

## Develop

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

## Deploy

`npm run build` outputs static files to `dist/`, which can be hosted on any
static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.). Update the
`site` value in `astro.config.mjs` to your production URL before deploying.
