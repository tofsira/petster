import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Authors } from "./collections/Authors";
import { Articles } from "./collections/Articles";
import { Settings } from "./globals/Settings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const normalizeEnv = (value?: string) => value?.trim().replace(/^["']|["']$/g, "");

const databaseUri =
  normalizeEnv(process.env.DATABASE_URI) ||
  normalizeEnv(process.env.DATABASE_URL_UNPOOLED) ||
  normalizeEnv(process.env.DATABASE_URL) ||
  "file:./petster.db";
const isPostgres =
  databaseUri.startsWith("postgres://") ||
  databaseUri.startsWith("postgresql://");
const allowSchemaPush =
  process.env.PAYLOAD_DB_PUSH === "true" ||
  (isPostgres ? process.env.NODE_ENV !== "production" : true);
const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      // apps/cms sets PAYLOAD_IMPORTMAP_BASEDIR so `generate:importmap` writes
      // into its own src/app/(payload)/admin. Default is harmless at runtime.
      baseDir: process.env.PAYLOAD_IMPORTMAP_BASEDIR
        ? path.resolve(process.env.PAYLOAD_IMPORTMAP_BASEDIR)
        : path.resolve(dirname, "../../apps/cms/src"),
    },
  },
  collections: [Users, Media, Categories, Authors, Articles],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: isPostgres
    ? postgresAdapter({
        pool: { connectionString: databaseUri },
        push: allowSchemaPush,
      })
    : sqliteAdapter({
        client: { url: databaseUri },
      }),
  plugins: hasBlobToken
    ? [
        vercelBlobStorage({
          enabled: true,
          collections: { media: true },
          token: process.env.BLOB_READ_WRITE_TOKEN || "",
          clientUploads: true,
        }),
      ]
    : [],
  sharp,
});
