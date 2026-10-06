import { auth } from "@/auth";
import { getDevices } from "@/lib/devices-query";
import { roleAtLeast } from "@/lib/rbac";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const [devices, session] = await Promise.all([getDevices(), auth()]);

  const demoEnabled =
    process.env.DEMO_MODE === "true" &&
    !!session?.user &&
    roleAtLeast(session.user.role, "Admin");

  return <DashboardClient devices={devices} demoEnabled={demoEnabled} />;
}
