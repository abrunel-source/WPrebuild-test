---
title: "From WordPress to Astro: How the Theme Maps Over"
description: "A look at how the Hello Elementor theme's templates translate into Astro layouts, components, and pages."
pubDate: 2026-06-10
author: "Admin"
tags: ["astro", "wordpress", "guide"]
---

If you're coming from a WordPress theme, Astro's structure will feel familiar
once you see how the pieces line up.

## Template mapping

| WordPress (Hello Elementor) | Astro |
| --- | --- |
| `header.php` / `footer.php` | `src/layouts/BaseLayout.astro` |
| `template-parts/header.php` | `src/components/Header.astro` |
| Footer location | `src/components/Footer.astro` |
| `index.php` routing | file-based routing in `src/pages/` |
| `template-parts/archive.php` (the loop) | `src/pages/blog/index.astro` |
| `template-parts/single.php` | `src/pages/blog/[...slug].astro` |
| `template-parts/404.php` | `src/pages/404.astro` |
| `theme.json` tokens | CSS custom properties in `global.css` |
| `functions.php` menus | `src/data/site.ts` |

## The loop, reimagined

WordPress's `while ( have_posts() )` loop becomes a simple `getCollection('blog')`
call plus a `.map()` over the results. Same idea, far less boilerplate.

That's really the whole migration in a nutshell.
