import { getDevices } from "@/lib/devices-query";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const devices = await getDevices();

  return <DashboardClient devices={devices} />;
}
