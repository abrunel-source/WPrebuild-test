# Florida Clinicians for Climate Action — Astro rebuild

A rebuild of [floridaclinicians.org](https://floridaclinicians.org) — originally
WordPress (Hello Elementor + Elementor Pro + JetEngine/Crocoblock) — as a fast,
static [Astro](https://astro.build) site with [Decap CMS](https://decapcms.org)
for editors and a few Vercel serverless functions for forms.

- **Hosting:** Vercel (static output + serverless API routes)
- **CMS:** Decap CMS at `/admin` (GitHub backend) — edits commit Markdown, which
  triggers a Vercel rebuild
- **Contact form:** `POST /api/contact` → Resend → `info@floridaclinicians.org`
- **Newsletter opt-in:** footer form → `POST /api/subscribe` → Mailchimp (double opt-in)
- **Secrets:** live in Vercel env vars only — never in the repo

## Content model (WordPress CPTs → Astro collections)

The original site used JetEngine custom post types. These were inventoried from
the WordPress database in the `.wpress` backup and mapped to Astro content
collections (`src/content.config.ts`):

| WordPress CPT             | Astro collection | Archive route   | Single route        |
| ------------------------- | ---------------- | --------------- | ------------------- |
| `events`                  | `events`         | `/events/`      | `/events/[slug]/`   |
| `team-members`            | `team`           | `/team/`        | `/team/[slug]/`     |
| `the-resources`           | `resources`      | `/education/`   | `/resources/[slug]/`|
| `partners`                | `partners`       | `/funders/`     | `/funders/[slug]/`  |
| `external-news`(+`_fcca`) | `news`           | `/news/`        | `/news/[slug]/`     |
| `mailchimp-newsletter`    | `newsletters`    | `/newsletters/` | (links out)         |
| `page` (privacy, terms)   | `pages`          | —               | `/privacy/`, `/terms/` |

Imported counts: 19 events, 14 team members, 26 resources, 3 funders, 13 news
items, 35 newsletters. Leftover Envato/Hello-Elementor demo content (cleaning
service blog posts, "test" resources) was intentionally excluded.

Page-builder pages (Home, About, Advocacy, Project C-HOT, Contact) were rebuilt
as bespoke Astro pages from the content extracted out of the Elementor data,
since rendered Elementor markup doesn't carry over cleanly.

## Brand / design system

Lifted from the original Elementor global kit (`src/styles/global.css`):

- Colors: primary `#016566`, secondary `#122D41`, text `#0B1727`, accent
  `#12EDC9`, muted `#B4CDCD`
- Fonts: Roboto (body) + Roboto Slab (headings)
- Logo: `public/media/2023/07/FCCA-logo.png`

## Media

Referenced images and documents from the WordPress uploads were copied into
`public/media/` (preserving the original `YYYY/MM/...` paths so links keep
working). Only files actually referenced by imported content were copied, not
the full 1.2 GB uploads tree.

## Project structure

```
src/
  components/    Header (with dropdowns + Donate), Footer (Mailchimp opt-in), EventCard
  content/       events, team, resources, partners, news, newsletters, pages (Markdown)
  content.config.ts   collection schemas
  data/site.ts   identity, nav menus, donate link
  layouts/       BaseLayout (head, fonts, header, footer)
  pages/         index, about, advocacy, project-c-hot, contact, privacy, terms,
                 events/, team/, education/, resources/, funders/, news/, newsletters/,
                 api/contact.ts, api/subscribe.ts
  styles/        global.css (brand tokens + components)
public/
  admin/         Decap CMS (index.html + config.yml)
  media/         imported WordPress media
```

## Environment variables (set in Vercel → Settings → Environment Variables)

Copy `.env.example` to `.env` for local dev only. **Never commit real values.**

| Variable                     | Used by              | Purpose                                  |
| ---------------------------- | -------------------- | ---------------------------------------- |
| `RESEND_API_KEY`             | `api/contact.ts`     | Send contact-form emails via Resend      |
| `CONTACT_TO_EMAIL`           | `api/contact.ts`     | Recipient (default `info@floridaclinicians.org`) |
| `MAILCHIMP_API_KEY`          | `api/subscribe.ts`   | Newsletter opt-in (datacenter auto-derived) |
| `MAILCHIMP_AUDIENCE_ID`      | `api/subscribe.ts`   | Mailchimp audience/list ID               |
| `OAUTH_GITHUB_CLIENT_ID`     | `api/auth.ts`        | Decap CMS GitHub login                   |
| `OAUTH_GITHUB_CLIENT_SECRET` | `api/callback.ts`    | Decap CMS GitHub login (server-side)     |

The contact form's `from:` address and the Resend domain must be a domain you've
verified in Resend (floridaclinicians.org).

## Decap CMS (`/admin`)

Uses the **GitHub backend** (git-gateway/Netlify Identity is not used on Vercel).
The OAuth handshake is served by this site's own serverless functions —
`src/pages/api/auth.ts` and `src/pages/api/callback.ts` — so no third-party
OAuth service is required. To finish setup:

1. Create a **GitHub OAuth App** (GitHub → Settings → Developer settings →
   OAuth Apps → New). Set the **Authorization callback URL** to
   `https://<your-site>/api/callback`.
2. Add `OAUTH_GITHUB_CLIENT_ID` and `OAUTH_GITHUB_CLIENT_SECRET` to the Vercel
   project's environment variables.
3. In `public/admin/config.yml`, set `backend.branch` to the production branch
   and `backend.base_url` to your production origin (already set to
   `https://floridaclinicians.org`).

Editors then sign in at `/admin` with GitHub (they need write access to the
repo). Saving commits Markdown, which triggers a Vercel redeploy.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build (static + serverless funcs)
npm run preview  # preview the build
```
