# AGENTS.md

Project guidance for coding agents working on `Petster`.

## Project Summary

`Petster` is a Thai-language brand + media website focused on trustworthy pet knowledge.

Phase 1 scope:

- Audience: dog and cat owners
- Language: Thai only
- Product type: read-only content website
- CMS: Payload CMS 3.x
- Frontend: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui
- Database: SQLite (via `@payloadcms/db-sqlite`) — file at `petster-app/petster.db`

## Repository Structure

```
pet _website/
├── legacy/              # Static HTML mock (reference only, do not edit)
│   ├── index.html
│   ├── dogs-health.html
│   └── styles.css
└── petster-app/         # Main application — work here
    ├── src/
    │   ├── app/         # Next.js App Router
    │   ├── collections/ # Payload collections
    │   ├── globals/     # Payload globals
    │   └── payload.config.ts
    ├── public/
    ├── .env             # Copy from .env.example
    └── package.json
```

## Running the App

```bash
cd petster-app
npm install
cp ../.env.example .env   # edit PAYLOAD_SECRET
npm run dev               # http://localhost:3000
# Admin panel: http://localhost:3000/admin
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

Prefer topic-based URL hierarchy instead of generic blog URLs.

Use:

- `/`
- `/dogs`
- `/cats`
- `/dogs/health`
- `/dogs/food`
- `/dogs/behavior`
- `/dogs/daily-care`
- `/cats/health`
- `/cats/food`
- `/cats/behavior`
- `/cats/daily-care`
- `/dogs/health/dog-vomiting-causes`
- `/cats/food/cat-not-eating`

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
| `heroImage` | upload → media | |
| `body` | richText (Lexical) | main article content |
| `sources` | array | `{ label, url }` — แหล่งอ้างอิง |
| `faq` | array | `{ question, answer }` |
| `author` | relationship → authors | optional |
| `publishedAt` | date | |
| `featured` | checkbox | default false |
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

## Implementation Priorities

Build in this order unless the user changes direction:

1. project scaffold
2. design foundation
3. Payload schema
4. homepage
5. category pages
6. article template
7. search experience
8. SEO/supporting pages

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
