# CLAUDE.md

Project guidance for Claude when helping shape Petster.

## What Petster Is

Petster is a Thai brand and media website for reliable dog and cat knowledge.

Phase 1:

- dogs and cats only
- Thai only
- read-only public website
- modern editorial experience
- trust-first content

## Product Direction

Think of Petster as:

- a trustworthy knowledge brand
- not a clinic website
- not a cute pet toy shop
- not a noisy content farm

Optimize for:

1. trust
2. clarity
3. scanability
4. SEO structure
5. sustainable content operations

Do not optimize for vanity complexity, excessive member features, or flashy UI
that weakens trust.

## Current Stack

- Monorepo with npm workspaces
- Next.js 16 App Router + React 19
- Payload CMS 3.x
- TypeScript
- Tailwind CSS 4
- Database adapter switches by `DATABASE_URI`
  - `file:./petster.db` -> SQLite dev default
  - `postgresql://...` -> Postgres production
- Media storage: local in dev, Vercel Blob in prod when
  `BLOB_READ_WRITE_TOKEN` is set
- Fonts: self-hosted Prompt and Sarabun in `apps/web/public/fonts`

## App Split

```txt
apps/web         Public Next.js website only.
apps/cms         Payload admin, API, GraphQL, seed scripts.
packages/shared  Payload schema source of truth.
design-lab       Static HTML/CSS experiments only.
```

Important:

- `apps/web` reads content through `CMS_URL` and Payload REST API.
- `apps/web` does not own `/admin` or `/api`.
- `apps/cms` owns `/admin`, `/api`, `/api/graphql`, database writes, media, and
  seed scripts.
- Edit Payload collections and globals in `packages/shared`.

## Running Locally

```bash
npm install
cp .env.example apps/cms/.env
npm run dev:cms
```

CMS admin: `http://localhost:3000/admin`

In another terminal:

```bash
$env:CMS_URL="http://localhost:3000"
$env:PORT="3001"
npm run dev:web
```

Public site: `http://localhost:3001`

Seed:

```bash
npm run seed
```

## Deploy

Use one Git repo with two Vercel projects:

| Project | App | Build command | Output directory |
|---|---|---|---|
| `cms` | `apps/cms` | `npm run build:cms` | `apps/cms/.next` |
| `web` | `apps/web` | `npm run build:web` | `apps/web/.next` |

Required env:

- CMS: `DATABASE_URI`, `PAYLOAD_SECRET`, optional `BLOB_READ_WRITE_TOKEN`
- Web: `CMS_URL`, `NEXT_PUBLIC_SITE_URL`

## Implemented Pages

| URL | Page | App |
|---|---|---|
| `/` | Homepage | web |
| `/dogs`, `/cats` | Animal hub | web |
| `/dogs/[category]`, `/cats/[category]` | Category hub | web |
| `/[animal]/[category]/[slug]` | Article detail | web |
| `/principles` | Editorial trust policy | web |
| `/sitemap.xml`, `/robots.txt` | SEO files | web |
| `/admin/*`, `/api/*`, `/api/graphql` | Payload | cms |

## Key Files

```txt
packages/shared/src/
  payload.config.ts
  collections/
  globals/
  payload-types.ts

apps/web/src/
  app/(site)/layout.tsx
  app/(site)/petster.css
  app/(site)/page.tsx
  app/(site)/[animal]/page.tsx
  app/(site)/[animal]/[category]/page.tsx
  app/(site)/[animal]/[category]/[slug]/page.tsx
  components/site-header.tsx
  components/site-footer.tsx
  components/bottom-nav.tsx
  components/reveal-on-scroll.tsx
  lib/cms.ts
  lib/cms-paths.ts
  lib/content-types.ts
  lib/url.ts

apps/cms/src/
  payload.config.ts
  app/(payload)/layout.tsx
  app/(payload)/admin/[[...segments]]/page.tsx
  app/(payload)/api/[...slug]/route.ts
  app/(payload)/api/graphql/route.ts
```

## Schema Notes

- `animal` is stored singular (`dog`, `cat`), but public URLs are plural
  (`/dogs`, `/cats`). Convert through `apps/web/src/lib/url.ts`.
- `heroImage` upload takes precedence over `heroImageUrl`.
- `featured` on Articles controls the homepage featured story.

## Content Strategy

Primary categories:

- health
- food
- behavior
- daily-care

Prefer evergreen Thai articles:

- symptom explainers
- daily care guides
- feeding basics
- behavior problem guides
- preventive care explainers

## SEO Strategy

Use hierarchical URLs that reflect animal, topic, and intent:

- `/dogs/health/dog-vomiting-causes`
- `/cats/food/best-food-for-indoor-cats`

Avoid generic blog-first structures.

Prioritize topical authority, hub pages, internal linking, useful category
intros, and FAQ opportunities.

## Trust Rules

- NotebookLM is a reference library, not the production CMS.
- Payload is the source of truth for published content.
- AI drafts must be reviewed by a human before publish.
- Health topics need references and a clear veterinary disclaimer.
- Do not invent certainty.
- Prefer calm, practical wording over sensationalism.

## UI Direction

Petster should feel warm, trustworthy, contemporary, and editorial.

Use medium density, clear grouping, visible navigation paths, useful search, and
strong sectioning. Keep mobile reading comfort high and avoid default-looking
shadcn pages.
