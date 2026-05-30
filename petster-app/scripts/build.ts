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
    const { seedDatabase } = await import("./seed");
    await seedDatabase();
  } else {
    console.log("Local build: using SQLite from DATABASE_URI or ./petster.db.");
  }

  execSync("next build", { stdio: "inherit", env: process.env });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
