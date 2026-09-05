import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { hashPassword } from "../lib/password";

async function main() {
  const email = process.env.SEED_SUPERADMIN_EMAIL;
  const password = process.env.SEED_SUPERADMIN_PASSWORD;
  const name = process.env.SEED_SUPERADMIN_NAME ?? "Superadmin";

  if (!email || !password) {
    console.error(
      "Set SEED_SUPERADMIN_EMAIL and SEED_SUPERADMIN_PASSWORD environment variables before running the seed script.",
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL environment variable");
  }
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  const passwordHash = await hashPassword(password);

  await db
    .insert(schema.users)
    .values({
      name,
      email,
      passwordHash,
      role: "Superadmin",
    })
    .onConflictDoNothing({ target: schema.users.email });

  console.log(`Seeded Superadmin user: ${email}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
