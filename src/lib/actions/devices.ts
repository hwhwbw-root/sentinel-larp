"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { devices } from "@/db/schema";
import { requireRole } from "@/lib/api-auth";
import { generateDeviceApiKey, hashDeviceApiKey } from "@/lib/device-auth";
import type { DeviceType } from "@/lib/alerts";

export type AddDeviceState =
  | { error: string }
  | { success: true; boxId: string; apiKey: string }
  | undefined;

/**
 * Creates a device and returns its plaintext API key exactly once - it is
 * never recoverable afterwards, only re-issuable via regenerateDeviceApiKey.
 */
export async function addDeviceAction(
  _prevState: AddDeviceState,
  formData: FormData,
): Promise<AddDeviceState> {
  await requireRole("Superadmin");

  const boxId = String(formData.get("boxId") ?? "").trim();
  const deviceType = String(formData.get("deviceType") ?? "") as DeviceType;
  const alias = String(formData.get("alias") ?? "").trim() || null;
  const alertThreshold = parseOptionalFloat(formData.get("alertThreshold"));
  const dangerousThreshold = parseOptionalFloat(formData.get("dangerousThreshold"));
  const calA = parseOptionalFloat(formData.get("calA"));
  const calB = parseOptionalFloat(formData.get("calB"));

  if (!boxId) return { error: "Box ID is required." };
  if (deviceType !== "CO2" && deviceType !== "H2") {
    return { error: "Device type must be CO2 or H2." };
  }

  const apiKey = generateDeviceApiKey();

  try {
    await db.insert(devices).values({
      boxId,
      deviceType,
      alias,
      alertThreshold,
      dangerousThreshold,
      calA,
      calB,
      apiKeyHash: hashDeviceApiKey(apiKey),
    });
  } catch {
    return { error: `Box ID "${boxId}" already exists.` };
  }

  revalidatePath("/devices");
  return { success: true, boxId, apiKey };
}

export async function deleteDeviceAction(deviceId: string) {
  await requireRole("Superadmin");
  await db.delete(devices).where(eq(devices.id, deviceId));
  revalidatePath("/devices");
}

export async function updateDeviceAliasAction(deviceId: string, alias: string) {
  await requireRole("Admin");
  await db
    .update(devices)
    .set({ alias: alias || null, updatedAt: new Date() })
    .where(eq(devices.id, deviceId));
  revalidatePath("/devices");
}

export async function updateDeviceThresholdsAction(
  deviceId: string,
  alertThreshold: number | null,
  dangerousThreshold: number | null,
) {
  await requireRole("Admin");
  await db
    .update(devices)
    .set({ alertThreshold, dangerousThreshold, updatedAt: new Date() })
    .where(eq(devices.id, deviceId));
  revalidatePath("/devices");
}

export async function updateDeviceCalibrationAction(
  deviceId: string,
  calA: number | null,
  calB: number | null,
) {
  await requireRole("Admin");
  await db
    .update(devices)
    .set({ calA, calB, updatedAt: new Date() })
    .where(eq(devices.id, deviceId));
  revalidatePath("/devices");
}

export async function updateDeviceTypeAction(deviceId: string, deviceType: DeviceType) {
  await requireRole("Admin");
  await db
    .update(devices)
    .set({ deviceType, updatedAt: new Date() })
    .where(eq(devices.id, deviceId));
  revalidatePath("/devices");
}

export async function regenerateDeviceApiKeyAction(
  deviceId: string,
): Promise<{ apiKey: string }> {
  await requireRole("Superadmin");
  const apiKey = generateDeviceApiKey();
  await db
    .update(devices)
    .set({ apiKeyHash: hashDeviceApiKey(apiKey), updatedAt: new Date() })
    .where(eq(devices.id, deviceId));
  revalidatePath("/devices");
  return { apiKey };
}

function parseOptionalFloat(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const num = parseFloat(String(value));
  return Number.isNaN(num) ? null : num;
}
