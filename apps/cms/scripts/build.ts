import { execSync } from "node:child_process";

const normalizeEnv = (value?: string) => value?.trim().replace(/^["']|["']$/g, "");

const databaseUri =
  normalizeEnv(process.env.DATABASE_URI) ||
  normalizeEnv(process.env.DATABASE_URL_UNPOOLED) ||
  normalizeEnv(process.env.DATABASE_URL) ||
  "";
const isPostgres =
  databaseUri.startsWith("postgres://") ||
  databaseUri.startsWith("postgresql://");

async function main() {
  if (process.env.VERCEL && !isPostgres) {
    throw new Error(
      "DATABASE_URI or DATABASE_URL must be a Postgres connection string on Vercel. " +
        "Add Neon Postgres and connect it to this project.",
    );
  }

  if (isPostgres && !process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is required when Postgres is configured.");
  }

  if (process.env.VERCEL && !process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is required on Vercel.");
  }

  if (isPostgres) {
    process.env.PAYLOAD_DB_PUSH = "true";

    // @payloadcms/db-postgres only runs pushDevSchema when NODE_ENV !== "production"
    // (see connect.js). On Vercel NODE_ENV is "production", so newly added schema
    // columns are never created and the seed then fails with "column ... does not
    // exist". Since this repo has no migrations and relies entirely on push, we
    // temporarily drop out of production mode so the schema push runs against the
    // production DB, then restore it before `next build`.
    //
    // This is safe re: data loss: pushDevSchema prompts on any destructive/data-loss
    // diff, and in CI (no TTY) that prompt resolves to "no" and exits without
    // applying. Additive nullable columns apply without a prompt.
    const prevNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    try {
      const { seedDatabase } = await import("./seed");
      await seedDatabase();
    } finally {
      if (prevNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = prevNodeEnv;
      }
    }
  } else {
    console.log("Local build: using SQLite from DATABASE_URI or ./goodpet.db.");
  }

  execSync("next build", { stdio: "inherit", env: process.env });
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
