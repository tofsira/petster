# AGENTS.md

Project guidance for coding agents working on `Petster`.

## Project Summary

`Petster` is a Thai-language brand + media website focused on trustworthy pet knowledge.

Phase 1 scope:

- Audience: dog and cat owners
- Language: Thai only
- Product type: read-only content website
- CMS: Payload CMS 3.x
- Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- Database: adapter switches by `DATABASE_URI`
  - `file:./petster.db` → SQLite (`@payloadcms/db-sqlite`, dev default)
  - `postgresql://…` → Postgres (`@payloadcms/db-postgres`, production)
- Media: local in dev, Vercel Blob in prod (auto-enabled when `BLOB_READ_WRITE_TOKEN` is set)
- Fonts: Prompt (display) + Sarabun (body) via `next/font/google`

## Repository Structure

```
pet _website/
├── legacy/              # Static HTML mock (reference only, do not edit)
│   ├── index.html
│   ├── dogs-health.html
│   ├── script.js
│   └── styles.css
└── petster-app/         # Main application — work here
    ├── src/
    │   ├── app/             # Next.js App Router
    │   │   ├── layout.tsx       # pass-through root layout
    │   │   ├── sitemap.ts, robots.ts
    │   │   ├── (site)/          # public routes — html/body + Petster CSS lives here
    │   │   └── (payload)/       # Payload admin (/admin) + REST/GraphQL (/api)
    │   ├── collections/     # Payload collections
    │   ├── globals/         # Payload globals
    │   ├── components/      # shared React components (site-chrome, reveal)
    │   ├── lib/             # payload client + URL helpers
    │   └── payload.config.ts
    ├── scripts/
    │   └── seed.ts          # upsert 4 categories + 10 articles
    ├── public/
    ├── .env                 # Copy from .env.example
    └── package.json
```

## Running the App

```bash
cd petster-app
npm install
cp ../.env.example .env   # edit PAYLOAD_SECRET
npm run dev               # http://localhost:3000
# Admin panel: http://localhost:3000/admin
npm run seed              # populate sample content (idempotent)
```

## Brand Direction

The product should feel:

- warm
- trustworthy
- contemporary
- editorial, not corporate

Avoid:

- cold hospital-like design
- childish pet-shop design
- generic SaaS dashboard aesthetics
- overly minimal Western-style empty layouts
- cluttered portal-style chaos

Target design style:

- friendly editorial
- organized density: medium
- information-rich, but easy to scan

## Homepage Goals

The homepage must build trust through structure and clarity first.

Recommended homepage order:

1. Hero with clear value proposition
2. Search input for dog and cat questions
3. Four main categories
4. Featured articles
5. Dog section
6. Cat section
7. Trust / editorial credibility section
8. Latest or popular articles

Primary CTA:

- `Start reading articles`

## Core Categories

Phase 1 primary categories:

- health
- food
- behavior
- daily-care

These categories apply to both dogs and cats.

## SEO Structure

Topic-based URL hierarchy — all implemented:

- `/` — homepage
- `/dogs`, `/cats` — animal hubs
- `/dogs/[category]`, `/cats/[category]` — category hubs (health / food / behavior / daily-care)
- `/[animal]/[category]/[slug]` — article detail
- `/principles` — editorial trust policy
- `/sitemap.xml`, `/robots.txt` — auto from CMS

URL convention: animal is stored singular in the DB (`dog`, `cat`) but routed plural (`/dogs`, `/cats`). Conversion lives in `src/lib/url.ts` — never hand-format URLs.

Avoid:

- `/blog/...`
- `/post/...`
- `/article/...`
- query-string article URLs

## Payload Collections

### Articles (`src/collections/Articles.ts`)

| Field | Type | Notes |
|---|---|---|
| `title` | text | required |
| `slug` | text | required, unique, English only, no spaces |
| `animal` | select | `"dog"` \| `"cat"` |
| `category` | relationship → categories | required |
| `excerpt` | textarea | max 240 chars, used in cards + meta |
| `heroImage` | upload → media | preferred when uploaded |
| `heroImageUrl` | text | external URL fallback while building content; remove after upload |
| `body` | richText (Lexical) | main article content |
| `sources` | array | `{ label, url }` — แหล่งอ้างอิง |
| `faq` | array | `{ question, answer }` |
| `author` | relationship → authors | optional |
| `publishedAt` | date | |
| `featured` | checkbox | default false — homepage hero picks latest `featured=true` |
| `seo.metaTitle` | text | |
| `seo.metaDescription` | textarea | |
| `seo.ogImage` | upload → media | |

### Categories (`src/collections/Categories.ts`)

| Field | Type | Notes |
|---|---|---|
| `name` | text | required |
| `slug` | text | required, unique — `health` / `food` / `behavior` / `daily-care` |
| `animal` | select | `"dog"` \| `"cat"` \| `"both"` |
| `intro` | textarea | |
| `heroImage` | upload → media | |
| `heroImageUrl` | text | external URL fallback |
| `seo.metaTitle` | text | |
| `seo.metaDescription` | textarea | |

### Authors (`src/collections/Authors.ts`)

| Field | Type | Notes |
|---|---|---|
| `name` | text | required |
| `role` | select | `veterinarian` \| `editor` \| `contributor` |
| `credentials` | text | เช่น DVM, M.Sc. |
| `bio` | textarea | |
| `avatar` | upload → media | |

### Settings (global, `src/globals/Settings.ts`)

| Field | Type | Notes |
|---|---|---|
| `siteName` | text | default "Petster" |
| `tagline` | text | |
| `healthDisclaimer` | textarea | shown on `/principles` and (planned) article footers |
| `socialLinks` | array | `{ platform, url }` |

## Creating Content via Local API (for seed scripts)

Use Payload's Local API to create content programmatically — no HTTP needed.

```typescript
// scripts/seed-article.ts
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// 1. หา category id ก่อน
const cats = await payload.find({ collection: 'categories', where: { slug: { equals: 'health' } } })
const categoryId = cats.docs[0].id

// 2. สร้างบทความ
await payload.create({
  collection: 'articles',
  data: {
    title: 'สุนัขอาเจียน เมื่อไรควรพาไปหาหมอ',
    slug: 'dog-vomiting-when-to-see-vet',
    animal: 'dog',
    category: categoryId,
    excerpt: 'อาเจียนครั้งเดียวอาจไม่อันตราย แต่มีสัญญาณบางอย่างที่บอกว่าต้องพบสัตวแพทย์โดยเร็ว',
    body: { root: { children: [] } }, // Lexical JSON
    sources: [{ label: 'VCA Hospitals', url: 'https://vcahospitals.com/...' }],
    faq: [{ question: 'สุนัขอาเจียนกี่ครั้งถึงควรพาไปหาหมอ', answer: '...' }],
    featured: false,
  },
})
```

รัน script ด้วย:
```bash
cd petster-app
npx tsx scripts/seed-article.ts
```

Phase 1 article rules:

- no visible public author needed yet
- show last updated date
- show references
- show medical / veterinary disclaimer where relevant

## Editorial Trust Rules

This website is knowledge-first. Never present medical-style claims casually.

Required:

- each important article should have references
- content should be written in clear Thai
- health content should include a disclaimer that it does not replace veterinary diagnosis
- copy should be practical, calm, and readable

## Design System Notes

Even when using `shadcn/ui`, do not ship default-looking shadcn pages.

Requirements:

- custom brand direction
- strong typography choices
- warm but modern palette
- clear hierarchy
- mobile-first responsiveness
- scan-friendly article cards and section layouts

Suggested visual direction:

- soft editorial
- light background
- calm teal / green-blue primary family
- restrained warm accent

## Implementation Status

Done:
1. ✅ Project scaffold (Next.js 16 + Payload 3 + Tailwind 4 + shadcn)
2. ✅ Design foundation (tokens, fonts, route groups, chrome components)
3. ✅ Payload schema (5 collections + 1 global)
4. ✅ Homepage (CMS-connected: featured + categories + dog/cat sections)
5. ✅ Category hubs (`/[animal]/[category]`)
6. ✅ Article template (`/[animal]/[category]/[slug]` + related)
7. ✅ Animal hubs (`/dogs`, `/cats`)
8. ✅ Principles page + sitemap + robots
9. ✅ Seed: 4 categories + 10 articles

Pending (next):
- Render Lexical richText body on article pages (currently bodies stored as plain strings in seed)
- Author display on articles
- JSON-LD (Article + FAQPage + Breadcrumb schema)
- Search experience
- Migrate Unsplash `heroImageUrl` placeholders to Media uploads (Vercel Blob)

## Agent Working Rules

- Keep the project root clean.
- Remove temporary inspection folders before finishing.
- Do not add throwaway files unless necessary.
- Prefer production-ready code over mockups.
- Preserve a clear separation between:
  - NotebookLM as reference storage
  - Payload as source of truth for published content

## NotebookLM Role

NotebookLM is for research and references, not for serving production content.

Use it for:

- storing source material
- summarizing trustworthy references
- helping draft research notes

Do not treat NotebookLM output as publish-ready without human review.
