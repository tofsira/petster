# Petster CMS

Payload backend for Petster.

This app contains:

- Payload admin at `/admin`
- Payload REST API at `/api`
- Payload GraphQL endpoint at `/api/graphql`
- Seed scripts for sample content
- The runtime connection to the database and media storage

The schema itself lives in `packages/shared` and is imported through
`src/payload.config.ts`.

## Run Locally

Run from the repo root:

```bash
npm install
cp .env.example apps/cms/.env
npm run dev:cms
```

Open:

- Admin: `http://localhost:3000/admin`
- API: `http://localhost:3000/api`

## Seed Content

```bash
npm run seed
```

## Build

```bash
npm run lint --workspace petster-cms
npm exec --workspace petster-cms tsc -- --noEmit
npm run build:cms
```

## Deploy

Deploy as a separate Vercel project from the same Git repo.

Recommended project settings:

- Build command: `npm run build:cms`
- Output directory: `apps/cms/.next`
- Install command: `npm install`
- Required env: `DATABASE_URI`, `PAYLOAD_SECRET`
- Optional env: `BLOB_READ_WRITE_TOKEN` for Vercel Blob media uploads
