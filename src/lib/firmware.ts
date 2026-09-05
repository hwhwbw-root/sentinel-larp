import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { firmwareVersions } from "@/db/schema";

export async function getLatestFirmware() {
  const [latest] = await db
    .select()
    .from(firmwareVersions)
    .orderBy(desc(firmwareVersions.createdAt))
    .limit(1);
  return latest ?? null;
}
