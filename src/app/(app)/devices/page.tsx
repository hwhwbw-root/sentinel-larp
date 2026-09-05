import { auth } from "@/auth";
import { getDevices } from "@/lib/devices-query";
import { DeviceManagementClient } from "@/components/devices/DeviceManagementClient";

export default async function DevicesPage() {
  const session = await auth();
  const devices = await getDevices();

  return (
    <DeviceManagementClient devices={devices} currentUserRole={session!.user.role} />
  );
}
