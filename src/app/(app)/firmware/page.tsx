import { getLatestFirmware } from "@/lib/firmware";
import { FirmwareClient } from "@/components/firmware/FirmwareClient";

export default async function FirmwarePage() {
  const latest = await getLatestFirmware();
  return <FirmwareClient currentVersion={latest?.version ?? null} />;
}
