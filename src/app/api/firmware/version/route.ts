import { getLatestFirmware } from "@/lib/firmware";

/**
 * Plain-text version check for the ESP32's AZP_OTA.h (AZP_VERSION_URL).
 * Public, unauthenticated, and returns the bare version string - matching
 * the original external PHP host's version.txt contract exactly, so only
 * the URL constant in the firmware needs to change.
 */
export async function GET() {
  const latest = await getLatestFirmware();
  return new Response(latest?.version ?? "0", {
    headers: { "Content-Type": "text/plain" },
  });
}
