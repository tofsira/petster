# Content sync — setup & run (dev/ops)

How to wire the Google Sheet to Payload and run the sync. For the writer-facing
sheet contract see [`sheet-column-reference.md`](./sheet-column-reference.md);
for the overall pipeline see [`../content-workflow.md`](../content-workflow.md).

The sync script is `apps/cms/scripts/sync-content.ts`. It reads the sheet,
upserts each `Ready for review` row into `articles` as a **draft**, uploads a
hero image when `image_url` is set, and writes `cms_id` / `synced_at` /
`sync_error` back to the sheet. It never modifies a published article.

## 1. Google service account (one time)

1. Google Cloud Console → create (or pick) a project → **APIs & Services →
   Enable APIs** → enable **Google Sheets API**.
2. **Credentials → Create credentials → Service account.** Name it e.g.
   `content-sync`. No project roles are needed.
3. Open the service account → **Keys → Add key → JSON** → download.
4. From the JSON copy `client_email` and `private_key`.
5. **Share the Google Sheet** with that `client_email` as **Viewer**
   (the script only reads cell values; the write-back uses the Sheets API on the
   same shared file, Viewer is enough for `values:batchUpdate` on a shared
   sheet — if write-back is denied, share as **Editor**).

## 2. Env vars

Add to `apps/cms/.env` (local) and/or `apps/cms/.env.prod-seed` (to target the
prod DB). See `.env.example`.

```
CONTENT_SHEET_ID=...          # the long id in the sheet URL: /spreadsheets/d/<ID>/edit
CONTENT_SHEET_RANGE=Sheet1    # tab name (optional, defaults to Sheet1)
GOOGLE_SERVICE_ACCOUNT_EMAIL=content-sync@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Notes:
- Keep the `private_key` on one line with literal `\n`; the script un-escapes it.
- Alternatively set `GOOGLE_APPLICATION_CREDENTIALS` to a JSON key file path
  instead of the two `GOOGLE_*` vars.
- Hero image upload needs a media storage adapter. In prod set
  `BLOB_READ_WRITE_TOKEN` (Vercel Blob) or image upload will fail and the row is
  still synced without a hero image.

## 3. Run

```bash
# against the local dev DB (apps/cms/.env)
npm run sync:content

# against the production DB (apps/cms/.env.prod-seed)
npm run sync:content:prod
```

Per-row console output shows created / updated / locked / invalid. A summary
line reports `created/updated/skipped/failed`. Errors for a row are also written
to its `sync_error` cell.

## Behaviour & guarantees

- Only rows with `status = "Ready for review"` are processed.
- Articles are created/updated as **drafts** (`_status: draft`,
  `contentStage: draft`). Publishing stays manual in `/admin`.
- A row is matched to an existing article by `cms_id` first, then by `slug`.
- If the matched article is already **published**, the row is skipped and its
  `sync_error` notes "edit in /admin" — the sheet never clobbers live content.
- Validation per row: `title`, `animal` (dog/cat), `category`, `body` required;
  `excerpt` ≤ 240 chars; `health` articles need ≥ 1 source. Invalid rows are
  reported in `sync_error` and skipped.
- A hero image is uploaded only when the target article has none yet, to avoid
  duplicate media on repeated syncs.

## Scheduling (later)

For now run manually. To automate, either run `npm run sync:content:prod` from a
GitHub Action / cron on a schedule, or add an authenticated route in `apps/cms`
that calls `syncContent()` and trigger it from the sheet (Apps Script button) or
a Vercel Cron.
