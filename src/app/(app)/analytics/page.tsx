import { getDevices } from "@/lib/devices-query";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";

export default async function AnalyticsPage() {
  const devices = await getDevices();
  return <AnalyticsClient devices={devices} />;
}
