# GEMINI.md

Project guidance for Gemini when helping shape `Petster`.

## What Petster Is

`Petster` is a Thai brand + media website for reliable dog and cat knowledge.

Phase 1:

- dogs and cats only
- Thai only
- read-only website
- modern editorial experience
- trust-first content

## Product Positioning

Think of Petster as:

- a trustworthy knowledge brand
- not a clinic website
- not a cute pet toy shop
- not a noisy content farm

The tone should be:

- warm
- trustworthy
- contemporary
- practical

## Strategic Direction

When helping with product, content, or UX decisions, optimize for:

1. trust
2. clarity
3. scanability
4. SEO structure
5. sustainable content operations

Do not optimize for:

- vanity complexity
- excessive member features in phase 1
- flashy trends that weaken trust

## UX Principles

Petster should feel like an Asian content product with good structure, not like an empty Western landing page.

Interpret this as:

- medium information density
- clear grouping
- visible navigation paths
- useful search
- strong sectioning
- enough content to feel valuable without looking chaotic

## Homepage Logic

The homepage should build confidence through:

- clear explanation of what the site is
- category structure
- featured articles
- separate pathways for dog and cat owners
- evidence that content is carefully curated

Recommended homepage blocks:

1. hero
2. search
3. category shortcuts
4. featured articles
5. dog section
6. cat section
7. editorial trust section
8. latest or popular content

## Content Strategy

Primary categories:

- health
- food
- behavior
- daily-care

Encourage topic clusters and internal linking around these categories.

Prefer structured, evergreen article ideas such as:

- symptom explainers
- daily care guides
- feeding basics
- behavior problem guides
- preventive care explainers

## SEO Strategy

Recommend hierarchical URLs that reflect animal + topic + intent.

Examples:

- `/dogs/health/dog-vomiting-causes`
- `/cats/food/best-food-for-indoor-cats`

Avoid generic blog-first structures when proposing architecture.

When giving SEO advice, prioritize:

- topical authority
- hub pages
- internal linking
- useful category intros
- FAQ opportunities

## Reference and Credibility Rules

Petster will use NotebookLM as a reference library.

That means:

- source material lives in NotebookLM
- published content lives in Payload
- summaries from AI are support material, not final truth

When helping draft or review content:

- encourage references
- encourage explicit disclaimers for health topics
- do not invent certainty
- prefer calm, practical wording over sensationalism

## Collaboration Style

When helping with plans or decisions:

- ask focused questions only when they affect real implementation
- avoid abstract brainstorming for too long
- help reduce ambiguity
- turn decisions into usable structures

When recommending UI:

- favor friendly editorial layouts
- keep density medium
- avoid default shadcn-looking patterns
- keep mobile reading comfort high

## Current Stack

Installed and running:

- Next.js 16 (App Router) + React 19
- Payload CMS 3.x
- TypeScript
- DB adapter switches by `DATABASE_URI`:
  - `file:./petster.db` → SQLite (`@payloadcms/db-sqlite`, default for dev)
  - `postgresql://...` → Postgres (`@payloadcms/db-postgres`, production)
- Tailwind CSS 4 + shadcn/ui
- Media storage: local in dev, Vercel Blob in prod (auto-enabled when `BLOB_READ_WRITE_TOKEN` is set)
- Fonts: Prompt (display) + Sarabun (body) via `next/font/google`

Monorepo (npm workspaces). The Payload **schema** (config, collections, globals,
types) lives once in `packages/shared` (`@petster/shared`); two apps consume it
through the Payload Local API:

- `apps/web` — public site, read-only, deploys to Vercel
- `apps/cms` — Payload admin + REST/GraphQL, the editing backend (e.g. Railway)

Both connect to the same database. Run `npm install` at the repo **root**. Static
HTML/CSS design experiments live in `design-lab/`.

## Running the App

```bash
npm install            # run at the repo ROOT (links @petster/shared into both apps)
npm run dev:cms        # Payload admin → http://localhost:3000/admin
npm run seed           # populate 4 categories + 10 sample articles (via cms)
npm run dev:web        # public site (use a second port, e.g. PORT=3001)
```

## Implemented Pages

| URL | Page | Data source |
|---|---|---|
| `/` | Homepage | featured article + categories + 3 dog + 3 cat articles |
| `/dogs`, `/cats` | Animal hub | categories + latest articles |
| `/dogs/[category]`, `/cats/[category]` | Category hub | articles in category × animal |
| `/[animal]/[category]/[slug]` | Article detail | full article + related (3 same category) |
| `/principles` | หลักการคัดข้อมูล | Settings global + static |
| `/sitemap.xml`, `/robots.txt` | SEO | auto-generated from CMS |
| `/admin/*`, `/api/*` | Payload | auto-routed |

## Key Files

```
packages/shared/src/           # @petster/shared — schema, shared by both apps
├── payload.config.ts          # DB adapter switch + Vercel Blob plugin
├── collections/
│   ├── Articles.ts            # title, slug, animal, category, excerpt, heroImage|heroImageUrl, body, sources, faq, seo
│   ├── Categories.ts          # name, slug, animal (dog/cat/both), intro, heroImage|heroImageUrl
│   ├── Authors.ts             # name, role, credentials, bio
│   ├── Media.ts               # upload (Vercel Blob in prod)
│   └── Users.ts               # admin auth
├── globals/Settings.ts        # siteName, healthDisclaimer
├── payload-types.ts           # generated — `npm run generate:types`
└── index.ts                   # exports config + types

apps/web/src/                  # public site (Local API reads) → Vercel
├── payload.config.ts          # 1-line re-export of @petster/shared/config
├── lib/
│   ├── payload.ts             # getPayloadClient()
│   └── url.ts                 # animal singular↔plural helpers
├── components/
│   ├── site-chrome.tsx        # SiteHeader, SiteFooter, BottomNav
│   └── reveal-on-scroll.tsx   # IntersectionObserver client component
└── app/
    ├── layout.tsx             # pass-through root
    ├── sitemap.ts, robots.ts
    └── (site)/                # public website routes
        ├── layout.tsx         # html/body + fonts + chrome
        ├── petster.css        # design system CSS
        ├── page.tsx           # homepage
        ├── principles/page.tsx
        └── [animal]/[category]/[slug]/page.tsx

apps/cms/src/                  # editing backend (Local API reads + writes) → Railway
├── payload.config.ts          # 1-line re-export of @petster/shared/config
└── app/(payload)/             # Payload admin (/admin) + API (/api), auto-generated
```

## Schema Notes

- **animal**: stored as singular (`dog` / `cat`), URL is plural (`/dogs`, `/cats`) — convert via `lib/url.ts`
- **heroImage** (upload) takes precedence over **heroImageUrl** (text) — fallback chain for transition off Unsplash placeholders
- **featured**: checkbox on Articles, homepage hero shows the latest featured

## Seed Script

`apps/cms/scripts/seed.ts` is upsert-safe (creates or updates). Re-run anytime to reset content:

```bash
npm run seed            # from repo root — runs in apps/cms
```

Run a custom one-off script from `apps/cms`: `npx tsx --env-file=.env scripts/your-script.ts`

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'
const payload = await getPayload({ config })

await payload.create({
  collection: 'articles',
  data: { title: '...', slug: '...', animal: 'dog', category: categoryId, ... }
})
```
