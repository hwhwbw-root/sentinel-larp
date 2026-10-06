import { getLatestFirmware } from "@/lib/firmware";

/**
 * Binary download for the ESP32's AZP_OTA.h (AZP_BIN_URL / httpUpdate.update()).
 * Public, unauthenticated, redirects to the Vercel Blob URL of the latest
 * upload - matching the original external PHP host's firmware.bin contract.
 */
export async function GET() {
  const latest = await getLatestFirmware();
  if (!latest) {
    return new Response("No firmware uploaded yet", { status: 404 });
  }
  return Response.redirect(latest.blobUrl, 302);
}
