# GoodPet Web

Public frontend for GoodPet.

This app contains only the read-only website:

- Homepage, animal hubs, category hubs, article pages, principles page
- SEO routes: `/sitemap.xml` and `/robots.txt`
- Local Prompt + Sarabun font files in `public/fonts`
- CMS reads through `CMS_URL` and Payload REST API

It does not contain Payload admin or Payload API routes. Those live in
`apps/cms`.

## Run Locally

Run from the repo root:

```bash
npm install
$env:CMS_URL="http://localhost:3000"
$env:PORT="3001"
npm run dev:web
```

Open:

- Site: `http://localhost:3001`

## Build

```bash
npm run lint --workspace goodpet-web
npm exec --workspace goodpet-web tsc -- --noEmit
npm run build:web
```

## Deploy

Deploy as a separate Vercel project from the same Git repo.

Recommended project settings:

- Root directory: `apps/web`
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`
- Required env: `CMS_URL`, `NEXT_PUBLIC_SITE_URL`
