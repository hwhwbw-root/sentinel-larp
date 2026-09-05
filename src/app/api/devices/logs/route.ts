import { db } from "@/db";
import { deviceLogs } from "@/db/schema";
import { authenticateDevice } from "@/lib/device-request";

interface LogPayload {
  level?: string;
  message?: string;
}

/**
 * Device diagnostic log ingestion (MAIN/RemoteLogger.cpp), which originally
 * posted to a second, separate Supabase project. Folded into this backend
 * as its own device_logs table instead.
 */
export async function POST(req: Request) {
  const device = await authenticateDevice(req);
  if (!device) {
    return Response.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  let payload: LogPayload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload.level || !payload.message) {
    return Response.json({ error: "level and message are required" }, { status: 400 });
  }

  await db.insert(deviceLogs).values({
    boxId: device.boxId,
    level: payload.level,
    message: payload.message,
  });

  return Response.json({ status: "ok" }, { status: 201 });
}
