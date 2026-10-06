import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { devices, environmentData } from "@/db/schema";
import { authenticateDevice } from "@/lib/device-request";
import { computeAlertLevel } from "@/lib/alerts";

const COMMAND_TTL_MS = 60_000;
const FAST_POLL_MS = 2000;

interface IngestPayload {
  box_id?: string;
  gas_value: number;
  temperature?: number;
  humidity?: number;
  created_at?: string;
}

/**
 * Ingest endpoint for ESP32 devices (MAIN/SupabaseService.cpp) and the
 * mocksense.py simulator. Replaces the original's direct-to-Supabase POST.
 * Authenticated via the per-device `apikey` header (same header name the
 * firmware already sends - only its value and the target URL changed).
 *
 * Alert level (0/1/2) is always computed here, server-side, from the
 * device's own thresholds - never trusted from the payload. This is the
 * single place that logic runs now, replacing three separate copies of it
 * in the original codebase (firmware, mocksense.py, and a frontend hook).
 */
export async function POST(req: Request) {
  const device = await authenticateDevice(req);
  if (!device) {
    return Response.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  let payload: IngestPayload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof payload.gas_value !== "number" || Number.isNaN(payload.gas_value)) {
    return Response.json({ error: "gas_value is required" }, { status: 400 });
  }

  const createdAt = payload.created_at ? new Date(payload.created_at) : new Date();
  if (Number.isNaN(createdAt.getTime())) {
    return Response.json({ error: "Invalid created_at" }, { status: 400 });
  }

  const alert = computeAlertLevel(
    payload.gas_value,
    device.alertThreshold,
    device.dangerousThreshold,
    device.deviceType,
  );

  await db.insert(environmentData).values({
    boxId: device.boxId,
    gasValue: payload.gas_value,
    temperature: payload.temperature,
    humidity: payload.humidity,
    alert,
    createdAt,
  });

  const now = new Date();
  await db
    .update(devices)
    .set({ lastSeen: now, status: "Active" })
    .where(eq(devices.id, device.id));

  // Demo commands ride on this reply: the box only ever calls us, so this is
  // the one moment we can hand it something. Deliver a queued command once, and
  // drop it if it went stale while the box was offline.
  let cmd: string | undefined;
  if (device.pendingCommand && device.pendingCommandAt) {
    const claimed = await db
      .update(devices)
      .set({ pendingCommand: null, pendingCommandAt: null })
      .where(
        and(
          eq(devices.id, device.id),
          eq(devices.pendingCommandAt, device.pendingCommandAt),
        ),
      )
      .returning({ id: devices.id });
    const fresh = now.getTime() - device.pendingCommandAt.getTime() < COMMAND_TTL_MS;
    if (claimed.length > 0 && fresh) cmd = device.pendingCommand;
  }

  const fast = device.fastUntil && device.fastUntil.getTime() > now.getTime();

  return Response.json(
    {
      status: "ok",
      alert,
      ...(cmd ? { cmd } : {}),
      ...(fast ? { poll_ms: FAST_POLL_MS } : {}),
    },
    { status: 201 },
  );
}
