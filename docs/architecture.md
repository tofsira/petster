# Petster Architecture

Petster is an npm-workspaces monorepo. As of Phase 2 the public site and the
Payload CMS are **separate apps** that share one schema and one database.

```txt
apps/
  web/          Next.js public site. Reads content via the Payload Local API.
                Deploys to Vercel. No /admin or /api routes.
  cms/          Payload admin (/admin) + REST/GraphQL (/api) — the editing
                backend. Deploys to a Node host (e.g. Railway).
  automation/   Google Sheet, MCP, and AI draft workflows (future).

packages/
  shared/       @petster/shared — the single source of truth for the Payload
                schema: payload.config.ts, collections, globals, payload-types.
                Both apps import it; the config is reached via "@payload-config".
  seo/          Shared SEO helpers (stub).
  prompts/      Shared AI writing and workflow rules (stub).
```

## How the split works

- The Payload schema lives **once** in `packages/shared`. Each app keeps a
  one-line `src/payload.config.ts` that re-exports `@petster/shared/config`, so
  the existing `@payload-config` alias keeps resolving. Next bundles the package
  via `transpilePackages: ["@petster/shared"]`.
- Both apps still use the **Payload Local API** (`getPayload`), so no page was
  rewritten to fetch over HTTP. `apps/web` reads; `apps/cms` reads + writes.
- Both apps connect to the **same database** (Neon Postgres in production). In
  dev with SQLite, point both `DATABASE_URI`s at one shared file
  (e.g. `apps/web/.env` → `file:../cms/petster.db`).

## Database & seeding

- `apps/cms` owns seeding and schema push. `apps/cms/scripts/build.ts` seeds
  Postgres on deploy, then runs `next build`. Run seeding from the CMS host.
- `apps/web` only reads, so its build is a plain `next build`.

## Workspaces

Root `package.json` declares
`workspaces: ["apps/cms", "apps/web", "packages/shared"]`.
Always run `npm install` at the repo root (this links `@petster/shared` into
both apps). Add any new package to that list — stub dirs without a
`package.json` (`packages/seo`, `packages/prompts`, `apps/automation`) are
intentionally left out until they have one.

## Deploy

- **web → Vercel.** Root `vercel.json` installs at the repo root and runs
  `npm run build --workspace petster-web`; output is `apps/web/.next`.
- **cms → Node host (Railway/Render).** Build with `npm run build --workspace
  petster-cms`; start with `npm run start --workspace petster-cms`.
- Both read `DATABASE_URI` (Neon Postgres) + `PAYLOAD_SECRET`. Set
  `BLOB_READ_WRITE_TOKEN` on `cms` for Vercel Blob media uploads.
