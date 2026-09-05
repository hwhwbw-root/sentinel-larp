import { getDevices } from "@/lib/devices-query";
import { getLatestFirmware } from "@/lib/firmware";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const [devices, firmware] = await Promise.all([getDevices(), getLatestFirmware()]);

  return <DashboardClient devices={devices} firmwareVersion={firmware?.version ?? null} />;
}
