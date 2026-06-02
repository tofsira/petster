/**
 * sync-content.ts
 *
 * One-way sync: Google Sheet -> Payload CMS (as DRAFTS only).
 *
 * Reads article rows from a Google Sheet, validates them, and upserts each one
 * into the `articles` collection as a draft. Published articles are never
 * touched (edit those in /admin). After each row is processed the script writes
 * `cms_id`, `synced_at`, and `sync_error` back to the sheet.
 *
 * See docs/content-ops/sheet-column-reference.md for the sheet contract.
 *
 * Required env (in apps/cms/.env):
 *   CONTENT_SHEET_ID               the spreadsheet id (from its URL)
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   service account email shared on the sheet
 *   GOOGLE_PRIVATE_KEY             service account private key (\n-escaped ok)
 * Optional:
 *   CONTENT_SHEET_RANGE            tab/range to read (default "Sheet1")
 *   GOOGLE_APPLICATION_CREDENTIALS path to a service account json (alt to the
 *                                  two GOOGLE_* vars above)
 *
 * Run: npm run sync:content --workspace petster-cms
 */
import { getPayload } from "payload";
import { GoogleAuth } from "google-auth-library";

const SHEET_ID = process.env.CONTENT_SHEET_ID;
const SHEET_RANGE = process.env.CONTENT_SHEET_RANGE || "Sheet1";
const SYNC_STATUS = "Ready for review";
const ANIMALS = new Set(["dog", "cat"]);
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Columns the script owns and writes back to. Everything else is writer-owned.
const WRITEBACK_COLUMNS = ["cms_id", "synced_at", "sync_error"] as const;

type Animal = "dog" | "cat";

type Row = {
  /** 1-based sheet row number, for write-back ranges */
  sheetRow: number;
  values: Record<string, string>;
};

// Mirrors seed.ts: split on blank lines into Lexical paragraphs.
function toRichText(text: string) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return {
    root: {
      type: "root",
      children: paragraphs.map((p) => ({
        type: "paragraph",
        children: [{ type: "text", text: p, format: 0, version: 1 }],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      })),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

/** "Label | URL" per line -> [{ label, url }] */
function parseSources(cell: string) {
  return splitLines(cell).map((line) => {
    const [label, url] = splitPair(line);
    return { label, url: url || undefined };
  });
}

/** "Question | Answer" per line -> [{ question, answer }] */
function parseFaq(cell: string) {
  return splitLines(cell)
    .map((line) => {
      const [question, answer] = splitPair(line);
      return { question, answer };
    })
    .filter((f) => f.question && f.answer);
}

function splitLines(cell: string) {
  return (cell || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

function splitPair(line: string): [string, string] {
  const idx = line.indexOf("|");
  if (idx === -1) return [line.trim(), ""];
  return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
}

function parseBool(value: string) {
  return /^(true|yes|1|y)$/i.test((value || "").trim());
}

function colLetter(index0: number) {
  let n = index0 + 1;
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// ── Google Sheets REST helpers ──────────────────────────────────────────────

async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const auth = new GoogleAuth({
    scopes: [SHEETS_SCOPE],
    credentials: email && key ? { client_email: email, private_key: key } : undefined,
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error("Failed to obtain Google access token");
  return token;
}

async function sheetsGetValues(token: string): Promise<string[][]> {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
    `/values/${encodeURIComponent(SHEET_RANGE)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Sheets read failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { values?: string[][] };
  return json.values || [];
}

type WriteBack = { range: string; values: [[string]] };

async function sheetsBatchUpdate(token: string, data: WriteBack[]) {
  if (data.length === 0) return;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
    `/values:batchUpdate`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ valueInputOption: "RAW", data }),
  });
  if (!res.ok) throw new Error(`Sheets write failed: ${res.status} ${await res.text()}`);
}

// ── Image upload ────────────────────────────────────────────────────────────

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

async function uploadHeroImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  slug: string,
  alt: string,
): Promise<string | number> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image fetch ${res.status}`);
  const contentType = (res.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
  if (!contentType.startsWith("image/")) throw new Error(`not an image (${contentType})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = MIME_EXT[contentType] || "jpg";
  const created = await payload.create({
    collection: "media",
    data: { alt },
    file: { data: buffer, mimetype: contentType, name: `${slug || "article"}-hero.${ext}`, size: buffer.length },
  });
  return created.id;
}

// ── Row -> validated article ────────────────────────────────────────────────

type ParsedArticle = {
  title: string;
  slug: string;
  animal: Animal;
  categorySlug: string;
  excerpt: string;
  body: string;
  sources: { label: string; url?: string }[];
  faq: { question: string; answer: string }[];
  imageUrl: string;
  featured: boolean;
  cmsId: string;
};

function parseRow(v: Record<string, string>): { article?: ParsedArticle; errors: string[] } {
  const errors: string[] = [];
  const title = (v.title || "").trim();
  const animal = (v.animal || "").trim().toLowerCase();
  const categorySlug = (v.category || "").trim().toLowerCase();
  const excerpt = (v.excerpt || "").trim();
  const body = (v.body || "").trim();
  const sources = parseSources(v.sources || "");

  if (!title) errors.push("title ว่าง");
  if (!ANIMALS.has(animal)) errors.push(`animal ต้องเป็น dog หรือ cat (พบ "${v.animal}")`);
  if (!categorySlug) errors.push("category ว่าง");
  if (!body) errors.push("body ว่าง");
  if (excerpt.length > 240) errors.push(`excerpt ยาวเกิน 240 ตัวอักษร (${excerpt.length})`);
  if (categorySlug === "health" && sources.length === 0)
    errors.push("บทความ health ต้องมีอย่างน้อย 1 source");

  if (errors.length) return { errors };

  return {
    errors,
    article: {
      title,
      slug: (v.slug || "").trim(),
      animal: animal as Animal,
      categorySlug,
      excerpt,
      body,
      sources,
      faq: parseFaq(v.faq || ""),
      imageUrl: (v.image_url || "").trim(),
      featured: parseBool(v.featured || ""),
      cmsId: (v.cms_id || "").trim(),
    },
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

export async function syncContent() {
  if (!SHEET_ID) throw new Error("CONTENT_SHEET_ID is required");

  const token = await getAccessToken();
  const grid = await sheetsGetValues(token);
  if (grid.length < 2) {
    console.log("Sheet has no data rows. Nothing to sync.");
    return;
  }

  const header = grid[0].map((h) => h.trim());
  const colIndex = new Map(header.map((name, i) => [name, i]));
  for (const required of ["status", "title", "animal", "category", "body", ...WRITEBACK_COLUMNS]) {
    if (!colIndex.has(required)) throw new Error(`Sheet missing column "${required}"`);
  }

  const rows: Row[] = grid.slice(1).map((cells, i) => {
    const values: Record<string, string> = {};
    for (const [name, idx] of colIndex) values[name] = cells[idx] ?? "";
    return { sheetRow: i + 2, values };
  });

  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });

  // category slug -> id
  const cats = await payload.find({ collection: "categories", limit: 100 });
  const categoryMap = new Map<string, string | number>(
    cats.docs.map((c) => [String((c as { slug?: string }).slug), c.id]),
  );

  const writeBacks: WriteBack[] = [];
  const queueWriteBack = (sheetRow: number, patch: Partial<Record<string, string>>) => {
    for (const [name, value] of Object.entries(patch)) {
      const idx = colIndex.get(name);
      if (idx === undefined) continue;
      writeBacks.push({ range: `${SHEET_RANGE}!${colLetter(idx)}${sheetRow}`, values: [[value ?? ""]] });
    }
  };

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const status = (row.values.status || "").trim();
    if (status !== SYNC_STATUS) {
      skipped++;
      continue;
    }

    const { article, errors } = parseRow(row.values);
    if (!article) {
      failed++;
      queueWriteBack(row.sheetRow, { sync_error: errors.join("; "), synced_at: new Date().toISOString() });
      console.log(`  row ${row.sheetRow}: INVALID - ${errors.join("; ")}`);
      continue;
    }

    const categoryId = categoryMap.get(article.categorySlug);
    if (!categoryId) {
      failed++;
      queueWriteBack(row.sheetRow, {
        sync_error: `ไม่พบ category "${article.categorySlug}"`,
        synced_at: new Date().toISOString(),
      });
      console.log(`  row ${row.sheetRow}: unknown category ${article.categorySlug}`);
      continue;
    }

    try {
      // Locate existing doc: prefer cms_id, fall back to slug.
      let existing: { id: string | number; _status?: string; heroImage?: unknown } | null = null;
      if (article.cmsId) {
        existing = (await payload
          .findByID({ collection: "articles", id: article.cmsId, draft: true })
          .catch(() => null)) as typeof existing;
      }
      if (!existing && article.slug) {
        const found = await payload.find({
          collection: "articles",
          where: { slug: { equals: article.slug } },
          draft: true,
          limit: 1,
        });
        existing = (found.docs[0] as typeof existing) || null;
      }

      // Never overwrite a published article from the sheet.
      if (existing && existing._status === "published") {
        skipped++;
        queueWriteBack(row.sheetRow, {
          cms_id: String(existing.id),
          synced_at: new Date().toISOString(),
          sync_error: "published แล้ว — แก้ที่ /admin (ไม่ sync ทับ)",
        });
        console.log(`  row ${row.sheetRow}: locked (published) ${article.slug}`);
        continue;
      }

      // Upload hero image only when the target has none yet (avoid dup media).
      let heroImageId: string | number | undefined;
      if (article.imageUrl && !(existing && existing.heroImage)) {
        try {
          heroImageId = await uploadHeroImage(payload, article.imageUrl, article.slug, article.title);
        } catch (err) {
          console.log(`  row ${row.sheetRow}: image upload failed - ${(err as Error).message}`);
        }
      }

      const data: Record<string, unknown> = {
        title: article.title,
        animal: article.animal,
        category: categoryId,
        excerpt: article.excerpt,
        body: toRichText(article.body),
        sources: article.sources,
        faq: article.faq,
        featured: article.featured,
        contentStage: "draft",
        _status: "draft",
      };
      if (article.slug) data.slug = article.slug;
      if (heroImageId !== undefined) data.heroImage = heroImageId;
      else if (article.imageUrl && !(existing && existing.heroImage)) data.heroImageUrl = article.imageUrl;

      let id: string | number;
      if (existing) {
        const doc = await payload.update({ collection: "articles", id: existing.id, data, draft: true });
        id = doc.id;
        updated++;
        console.log(`  row ${row.sheetRow}: updated draft ${doc.slug ?? id}`);
      } else {
        const doc = await payload.create({ collection: "articles", data, draft: true });
        id = doc.id;
        created++;
        console.log(`  row ${row.sheetRow}: created draft ${doc.slug ?? id}`);
      }

      queueWriteBack(row.sheetRow, {
        cms_id: String(id),
        synced_at: new Date().toISOString(),
        sync_error: "",
      });
    } catch (err) {
      failed++;
      queueWriteBack(row.sheetRow, {
        sync_error: `sync error: ${(err as Error).message}`,
        synced_at: new Date().toISOString(),
      });
      console.log(`  row ${row.sheetRow}: ERROR ${(err as Error).message}`);
    }
  }

  await sheetsBatchUpdate(token, writeBacks);

  console.log(
    `\nSync complete. created=${created} updated=${updated} skipped=${skipped} failed=${failed}`,
  );
}

const isDirectRun = process.argv[1]?.includes("sync-content");
if (isDirectRun) {
  syncContent()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
