import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const databaseUri = process.env.DATABASE_URI || "";
const isPostgres =
  databaseUri.startsWith("postgres://") ||
  databaseUri.startsWith("postgresql://");

async function main() {
  const envLines: string[] = [];
  const secret = process.env.PAYLOAD_SECRET;

  if (isPostgres) {
    if (!secret) {
      throw new Error("PAYLOAD_SECRET is required when DATABASE_URI is Postgres.");
    }
    process.env.PAYLOAD_DB_PUSH = "true";
    const { seedDatabase } = await import("./seed");
    await seedDatabase();
  } else if (process.env.VERCEL) {
    if (!secret) {
      throw new Error("PAYLOAD_SECRET is required on Vercel builds.");
    }

    const buildDb = `file:${join(tmpdir(), "petster-vercel-build.db")}`;
    process.env.DATABASE_URI = buildDb;
    envLines.push(`DATABASE_URI=${buildDb}`, `PAYLOAD_SECRET=${secret}`);
    const { seedDatabase } = await import("./seed");
    await seedDatabase();
  } else {
    console.log("Local build: using existing SQLite database.");
  }

  if (envLines.length > 0) {
    writeFileSync(".env.production.local", `${envLines.join("\n")}\n`);
    console.log("Wrote .env.production.local for build-time CMS access.");
  }

  execSync("next build", { stdio: "inherit", env: process.env });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
