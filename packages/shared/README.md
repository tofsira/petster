# @petster/shared

The single source of truth for the Petster **Payload schema** — consumed by both
runtimes (`apps/cms` and `apps/web`).

Contains:

- `src/payload.config.ts` — Payload config (DB adapter switch + Vercel Blob plugin)
- `src/collections/` — Articles, Categories, Authors, Media, Users
- `src/globals/` — Settings
- `src/payload-types.ts` — generated types (`npm run generate:types`, run from `apps/cms`)
- `src/index.ts` — exports the config + types

Import the config via `@petster/shared/config`. Each app keeps a one-line
`src/payload.config.ts` that re-exports it, so the existing `@payload-config`
alias keeps resolving and Next bundles it through `transpilePackages`.

Edit collections and globals **here** — never inside an app. Lightweight shared
helpers (validation, URL helpers) may also live here later.
