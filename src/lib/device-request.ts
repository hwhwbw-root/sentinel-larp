import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { devices } from "@/db/schema";
import { hashDeviceApiKey } from "@/lib/device-auth";

/**
 * Authenticates an inbound ESP32/mocksense request via its `apikey` header
 * (same header name the original firmware already sends, so only the
 * header's value needs to change on the device side - not the code shape).
 * Returns the device row the key belongs to, or null if missing/invalid.
 */
export async function authenticateDevice(req: Request) {
  const key = req.headers.get("apikey");
  if (!key) return null;

  const [device] = await db
    .select()
    .from(devices)
    .where(eq(devices.apiKeyHash, hashDeviceApiKey(key)))
    .limit(1);

  return device ?? null;
}
