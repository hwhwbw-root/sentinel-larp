import { and, desc, eq, inArray, SQL } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { environmentData, devices } from "@/db/schema";

/** Paginated alert history for the dashboard's "View All Alerts" modal. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const boxId = searchParams.get("boxId");
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = Number(searchParams.get("offset") ?? "0");

  const conditions: SQL[] = [inArray(environmentData.alert, [1, 2])];
  if (boxId) conditions.push(eq(environmentData.boxId, boxId));

  const rows = await db
    .select({
      id: environmentData.id,
      boxId: environmentData.boxId,
      gasValue: environmentData.gasValue,
      alert: environmentData.alert,
      createdAt: environmentData.createdAt,
      deviceType: devices.deviceType,
    })
    .from(environmentData)
    .leftJoin(devices, eq(devices.boxId, environmentData.boxId))
    .where(and(...conditions))
    .orderBy(desc(environmentData.createdAt))
    .limit(limit)
    .offset(offset);

  const alerts = rows.map((row) => {
    const deviceType = row.deviceType ?? "device";
    const message =
      row.alert === 2
        ? `DANGEROUS: ${deviceType} level at ${row.gasValue} ppm exceeds danger threshold`
        : `ALERT: ${deviceType} level at ${row.gasValue} ppm exceeds alert threshold`;

    return {
      id: row.id,
      boxId: row.boxId,
      level: row.alert === 2 ? "Dangerous" : "Alert",
      message,
      timestamp: row.createdAt,
    };
  });

  return Response.json({ alerts, hasMore: rows.length === limit });
}
