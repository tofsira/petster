# @goodpet/shared

Single source of truth for the GoodPet Payload schema.

Contains:

- `src/payload.config.ts` - Payload config, DB adapter switch, Vercel Blob plugin
- `src/collections/` - Articles, Categories, Authors, Media, Users
- `src/globals/` - Settings
- `src/payload-types.ts` - generated types (`npm run generate:types`)
- `src/index.ts` - exports config and types

The CMS app imports this package through `@goodpet/shared/config`.

Edit collections and globals here, not inside `apps/cms` or `apps/web`.
Lightweight shared validation helpers can live here later.
