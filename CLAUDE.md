# CLAUDE.md

Project guidance for Claude when helping shape `Petster`.

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

- Next.js 16 (App Router)
- Payload CMS 3.x
- TypeScript
- SQLite (`petster-app/petster.db`) — migrate to PostgreSQL for production
- Tailwind CSS 4
- shadcn/ui

App lives in `petster-app/`. Static HTML mocks are in `legacy/` for reference only.

## Running the App

```bash
cd petster-app
npm run dev        # http://localhost:3000
                   # Admin: http://localhost:3000/admin
```

## Key Files

```
petster-app/src/
├── payload.config.ts          # Payload config — collections + DB
├── collections/
│   ├── Articles.ts            # title, slug, animal, category, excerpt, body, sources, faq, seo
│   ├── Categories.ts          # name, slug, animal (dog/cat/both), intro
│   ├── Authors.ts             # name, role, credentials
│   ├── Media.ts
│   └── Users.ts
├── globals/Settings.ts
└── app/
    ├── page.tsx               # Homepage (to be built)
    └── (payload)/             # Payload admin routes (auto-generated)
```

## Creating Content via Script

Use Payload Local API — no HTTP needed:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'
const payload = await getPayload({ config })

await payload.create({
  collection: 'articles',
  data: { title: '...', slug: '...', animal: 'dog', category: categoryId, ... }
})
```

Run with: `npx tsx scripts/your-script.ts` from inside `petster-app/`
