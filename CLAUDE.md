# CLAUDE.md

Project guidance for Claude when helping shape GoodPet.

## What GoodPet Is

GoodPet is a Thai brand and media website for reliable dog and cat knowledge.

Phase 1:

- dogs and cats only
- Thai only
- read-only public website
- modern editorial experience
- trust-first content

## Product Direction

Think of GoodPet as:

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
  - `file:./goodpet.db` -> SQLite dev default
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
| `goodpet-cms` | `apps/cms` | `npm run build` | `.next` |
| `web` | `apps/web` | `npm run build` | `.next` |

Set each Vercel project's Root Directory to its app folder. Each app has its own
`vercel.json`; do not use one root `vercel.json` for both apps.

Required env:

- CMS: `DATABASE_URI`, `PAYLOAD_SECRET`, optional `BLOB_READ_WRITE_TOKEN`
- Web: `CMS_URL`, `NEXT_PUBLIC_SITE_URL`

Also enable **"Include files outside the root directory"** for both Vercel
projects in Settings → General.

## Deploy Gotchas

Lessons from first split deploy. Do not repeat these mistakes:

**1. Do not set `installCommand` in `vercel.json`.**
Vercel detects npm workspaces and runs `npm install` from the repo root
automatically. A custom `installCommand: "cd ../.. && npm install"` causes
`npm error Tracker "idealTree" already exists` because it conflicts with
Vercel's own npm process.

**2. Do not set `outputFileTracingRoot` in `apps/web/next.config.ts`.**
Web is prerendered (SSG with ISR: pages set `revalidate: 60`, so content
refreshes in the background and a CMS hiccup at runtime serves the last good
page instead of erroring). `outputFileTracingRoot` pointing
to the monorepo root causes Vercel to trace the entire repo and embed the
path in the output, resulting in a doubled path error:
`lstat '/vercel/path1/vercel/path1/.next/...'` and deployment failure.
The CMS app may keep `outputFileTracingRoot` if it ever needs standalone output.

**3. `CMS_URL` must be set in the `goodpet-app` Vercel project env before the first deploy.**
Without it the web build defaults to `localhost:3000`. As of the resilient
fetch layer (`lib/cms.ts` returns `{ ..., ok }` instead of throwing), a missing
or unreachable CMS no longer crashes the build — it logs `CMS <collection>:
fetch failed` and ships pages with a `<ConnectionNotice>` and empty
`generateStaticParams`. That is a silent-empty-site footgun: always confirm
`CMS_URL` is set and the build log is clean before promoting a deploy.

**4. Adding a new field to a Payload collection requires the DB column to exist first.**
`PAYLOAD_DB_PUSH=true` runs during CMS build, but the seed queries the
table before the push adds new columns, causing `column X does not exist`.
If a field is new and the DB is already populated, either run the CMS
deploy alone first (schema push before seed), or remove the field until
a proper migration is prepared.

**5. `apps/cms/postcss.config.mjs` must not exist.**
The CMS does not use Tailwind. Any leftover `postcss.config.mjs` from
the old pre-split `goodpet-app` will cause `Cannot find module @tailwindcss/postcss`
during the CMS build.

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
  app/(site)/goodpet.css
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

GoodPet should feel warm, trustworthy, contemporary, and editorial.

Use medium density, clear grouping, visible navigation paths, useful search, and
strong sectioning. Keep mobile reading comfort high and avoid default-looking
shadcn pages.
