import { and, eq, gte, lte, asc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { environmentData } from "@/db/schema";

/** Used by the Data History page's date-range preview + CSV export. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const boxId = searchParams.get("boxId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!boxId || !start || !end) {
    return Response.json(
      { error: "boxId, start, and end are required" },
      { status: 400 },
    );
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return Response.json({ error: "Invalid start/end date" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(environmentData)
    .where(
      and(
        eq(environmentData.boxId, boxId),
        gte(environmentData.createdAt, startDate),
        lte(environmentData.createdAt, endDate),
      ),
    )
    .orderBy(asc(environmentData.createdAt))
    .limit(5000);

  return Response.json(rows);
}
