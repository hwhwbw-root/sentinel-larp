import { authenticateDevice } from "@/lib/device-request";

/**
 * Threshold fetch for ESP32 devices (MAIN/SupabaseService.cpp
 * fetchThresholdsFromSupabase). The DB column names were fixed to
 * `alert_threshold`/`dangerous_threshold`, but the firmware's response
 * parser does a manual string search for the literal keys
 * "treshold_alert"/"treshold_dangerous" - so this endpoint translates back
 * to the old misspelled keys, keeping the firmware's parsing code untouched.
 * Returned as a single-element array to match the original Supabase REST
 * response shape the firmware's string search was written against.
 */
export async function GET(req: Request) {
  const device = await authenticateDevice(req);
  if (!device) {
    return Response.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  return Response.json([
    {
      treshold_alert: device.alertThreshold,
      treshold_dangerous: device.dangerousThreshold,
    },
  ]);
}
