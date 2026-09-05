import { and, eq, gte, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { environmentData } from "@/db/schema";

/**
 * Polled by the dashboard (~every few seconds) for live readings. Replaces
 * the original's Supabase Realtime `postgres_changes` subscription - Neon
 * has no equivalent push mechanism, so the frontend polls this instead.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const boxId = searchParams.get("boxId");
  const minutes = Number(searchParams.get("minutes") ?? "10");

  if (!boxId) {
    return Response.json({ error: "boxId is required" }, { status: 400 });
  }

  const cutoff = new Date(Date.now() - minutes * 60_000);

  const rows = await db
    .select()
    .from(environmentData)
    .where(and(eq(environmentData.boxId, boxId), gte(environmentData.createdAt, cutoff)))
    .orderBy(desc(environmentData.createdAt))
    .limit(1100);

  // Fallback: if nothing in the requested window, return the most recent
  // readings anyway so the dashboard doesn't look empty for a device that's
  // been offline a while.
  if (rows.length === 0) {
    const fallback = await db
      .select()
      .from(environmentData)
      .where(eq(environmentData.boxId, boxId))
      .orderBy(desc(environmentData.createdAt))
      .limit(100);
    return Response.json(fallback.reverse());
  }

  return Response.json(rows.reverse());
}
