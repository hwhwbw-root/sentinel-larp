import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { AppUser } from "@/lib/types";

export async function getUsers(): Promise<AppUser[]> {
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .orderBy(asc(users.name));
  return rows;
}
