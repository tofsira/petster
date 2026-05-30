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

const databaseUri = process.env.DATABASE_URI || "file:./petster.db";
const isPostgres =
  databaseUri.startsWith("postgres://") ||
  databaseUri.startsWith("postgresql://");
const allowSchemaPush =
  process.env.PAYLOAD_DB_PUSH === "true" ||
  (isPostgres ? process.env.NODE_ENV !== "production" : true);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
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
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      clientUploads: true,
    }),
  ],
  sharp,
});
