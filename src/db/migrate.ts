import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { migrate as neonMigrate } from "drizzle-orm/neon-http/migrator";
import { Env } from "@/constants";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const isLocal =
  process.env.NODE_ENV === Env.DEVELOPMENT ||
  process.env.DATABASE_URL.includes("localhost") ||
  process.env.DATABASE_URL.includes("postgres:5432");

const main = async () => {
  try {
    if (isLocal) {
      const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
      const db = drizzle(sql);
      await migrate(db, { migrationsFolder: "src/db/migrations" });
      console.log("Migration completed (PostgreSQL)");
      await sql.end();
    } else {
      const sql = neon(process.env.DATABASE_URL!);
      const db = neonDrizzle(sql);
      await neonMigrate(db, { migrationsFolder: "src/db/migrations" });
      console.log("Migration completed (Neon)");
    }
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();
