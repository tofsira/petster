# Petster Architecture

Petster is an npm-workspaces monorepo. The public website and Payload CMS are
separate apps that share one repository and one Payload schema.

```txt
apps/
  web/          Next.js public site. Reads content from CMS_URL through
                Payload REST API. No /admin or /api routes.
  cms/          Payload admin (/admin) + REST/GraphQL (/api). Owns writes,
                seed scripts, database connection, and media uploads.
  automation/   Google Sheet, MCP, and AI draft workflows (future).

packages/
  shared/       @petster/shared. The single source of truth for the Payload
                schema: payload.config.ts, collections, globals, payload-types.
  seo/          Shared SEO helpers (stub).
  prompts/      Shared AI writing and workflow rules (stub).

design-lab/     Static HTML/CSS design experiments only.
```

## Separation

- `apps/cms` owns Payload admin, API routes, Local API writes, seeding, DB
  adapter selection, and media storage.
- `apps/web` owns only the public SEO website. It fetches content through
  `CMS_URL` using Payload REST endpoints.
- `packages/shared` owns the schema. Edit collections and globals there, not
  inside either app.
- Google Sheet and MCP automation are planned for `apps/automation`; automation
  must create drafts only.

## Database

- Local dev can use SQLite through `DATABASE_URI=file:./petster.db`.
- Production should use Postgres through `DATABASE_URI=postgresql://...`.
- Payload is the layer that reads/writes the database. The public web app reads
  Payload, not the database directly.

## Fonts

The web app self-hosts Prompt and Sarabun in `apps/web/public/fonts` and declares
them in `apps/web/src/app/(site)/petster.css`. Do not reintroduce
`next/font/google` unless the deployment environment can reach Google Fonts at
build time.

## Workspaces

Root `package.json` declares:

```json
{
  "workspaces": ["apps/cms", "apps/web", "packages/shared"]
}
```

Always run `npm install` at the repo root so workspace links and the lockfile
stay consistent.

## Deploy

Use one Git repo with two Vercel projects:

| Vercel project | App | Build command | Output directory |
|---|---|---|---|
| `petster-cms` | `apps/cms` | `npm run build` | `.next` |
| `web` | `apps/web` | `npm run build` | `.next` |

Set each Vercel project's Root Directory to its app folder. Each app has its own
`vercel.json`; do not use one root `vercel.json` for both apps.

Required production env:

- CMS: `DATABASE_URI`, `PAYLOAD_SECRET`, optional `BLOB_READ_WRITE_TOKEN`
- Web: `CMS_URL`, `NEXT_PUBLIC_SITE_URL`
