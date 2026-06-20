import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections mirroring the WordPress (JetEngine) custom post types
 * from the original floridaclinicians.org install:
 *
 *   WP CPT                 -> Astro collection
 *   ----------------------    ------------------
 *   events                 -> events
 *   team-members           -> team
 *   the-resources          -> resources   (menu label "Education")
 *   partners               -> partners    (menu label "Our Funders")
 *   external-news(+_fcca)  -> news
 *   mailchimp-newsletter   -> newsletters
 *   page (privacy/terms)   -> pages
 */

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    region: z.string().optional(),
    registrationUrl: z.string().optional(),
    registrationText: z.string().default('Register'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    photo: z.string().optional(),
    group: z.string().default('The Leadership Team'),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    document: z.string().optional(),
    externalUrl: z.string().optional(),
    youtube: z.string().optional(),
    soundcloud: z.string().optional(),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/partners' }),
  schema: z.object({
    title: z.string(),
    logo: z.string().optional(),
    mission: z.string().optional(),
    grantDate: z.coerce.date().optional(),
    amount: z.string().optional(),
    status: z.string().default('Active'),
    draft: z.boolean().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    category: z.string().default('In the Press'),
    date: z.coerce.date().optional(),
    externalUrl: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const newsletters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletters' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    externalUrl: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { events, team, resources, partners, news, newsletters, pages };
