"use server";

import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { devices, environmentData } from "@/db/schema";
import { requireRole } from "@/lib/api-auth";
import { generateDeviceApiKey, hashDeviceApiKey } from "@/lib/device-auth";
import { computeAlertLevel, DEFAULT_THRESHOLDS, type DeviceType } from "@/lib/alerts";

export type DemoScenario =
  | "normal"
  | "warning"
  | "danger"
  | "temp-spike"
  | "humidity-spike";

export type DemoResult =
  | {
      ok: true;
      boxId: string;
      alert: 0 | 1 | 2;
      gasValue: number;
      temperature: number;
      humidity: number;
    }
  | { ok: false; error: string };

const DEMO_BOXES: Record<DeviceType, { boxId: string; alias: string }> = {
  CO2: { boxId: "demo-co2", alias: "Demo CO2 box" },
  H2: { boxId: "demo-h2", alias: "Demo H2 box" },
};

const between = (min: number, max: number) => min + Math.random() * (max - min);
const round2 = (n: number) => Math.round(n * 100) / 100;

async function authorizeDemo(): Promise<string | null> {
  if (process.env.DEMO_MODE !== "true") return "Demo mode is not enabled.";
  try {
    await requireRole("Admin");
  } catch {
    return "You need Admin access to use demo controls.";
  }
  return null;
}

async function ensureDemoDevice(deviceType: DeviceType) {
  const { boxId, alias } = DEMO_BOXES[deviceType];
  await db
    .insert(devices)
    .values({
      boxId,
      deviceType,
      alias,
      apiKeyHash: hashDeviceApiKey(generateDeviceApiKey()),
    })
    .onConflictDoNothing();
  const [device] = await db.select().from(devices).where(eq(devices.boxId, boxId)).limit(1);
  return device;
}

/**
 * Inserts one scripted reading for a dedicated demo device so a presenter can
 * show normal/warning/danger states and temperature/humidity spikes on demand.
 * The alert level is still computed server-side from the device's thresholds,
 * the same way real ingest does, so the demo exercises the real alert path.
 */
export async function injectDemoReadingAction(
  deviceType: DeviceType,
  scenario: DemoScenario,
): Promise<DemoResult> {
  const denied = await authorizeDemo();
  if (denied) return { ok: false, error: denied };

  const device = await ensureDemoDevice(deviceType);
  const defaults = DEFAULT_THRESHOLDS[deviceType];
  const alertAt = device.alertThreshold ?? defaults.alert;
  const dangerAt = device.dangerousThreshold ?? defaults.dangerous;

  let gasValue = between(alertAt * 0.35, alertAt * 0.55);
  let temperature = between(22, 25);
  let humidity = between(45, 55);

  if (scenario === "warning") {
    gasValue = alertAt + (dangerAt - alertAt) * between(0.3, 0.6);
  } else if (scenario === "danger") {
    gasValue = dangerAt * between(1.15, 1.35);
  } else if (scenario === "temp-spike") {
    temperature = between(44, 48);
  } else if (scenario === "humidity-spike") {
    humidity = between(90, 96);
  }

  gasValue = round2(gasValue);
  temperature = round2(temperature);
  humidity = round2(humidity);

  const alert = computeAlertLevel(gasValue, device.alertThreshold, device.dangerousThreshold, deviceType);
  const now = new Date();

  await db.insert(environmentData).values({
    boxId: device.boxId,
    gasValue,
    temperature,
    humidity,
    alert,
    createdAt: now,
  });
  await db
    .update(devices)
    .set({ lastSeen: now, status: "Active" })
    .where(eq(devices.id, device.id));

  return { ok: true, boxId: device.boxId, alert, gasValue, temperature, humidity };
}

/** Clears readings (not the devices) for both demo boxes so a demo can start from a clean chart. */
export async function resetDemoDataAction(): Promise<{ ok: boolean; error?: string }> {
  const denied = await authorizeDemo();
  if (denied) return { ok: false, error: denied };

  await db
    .delete(environmentData)
    .where(inArray(environmentData.boxId, Object.values(DEMO_BOXES).map((b) => b.boxId)));
  return { ok: true };
}

export type HardwareCommand =
  | "test"
  | "notice"
  | "normal"
  | "warning"
  | "danger"
  | "escalate"
  | "stop"
  | "arm";

const FAST_MODE_MS = 5 * 60 * 1000;

/**
 * Queues a command for a physical box. The box only ever calls us, so the
 * command is stored and handed back in the reply to its next upload (see the
 * ingest route). "arm" queues nothing - it only switches the box to fast
 * uploads so the first real click isn't stuck behind a 10s wait.
 */
export async function sendHardwareCommandAction(
  boxId: string,
  command: HardwareCommand,
): Promise<{ ok: boolean; error?: string }> {
  const denied = await authorizeDemo();
  if (denied) return { ok: false, error: denied };

  if (boxId.startsWith("demo-")) {
    return { ok: false, error: "Pick a physical box, not a demo device." };
  }
  const [device] = await db.select().from(devices).where(eq(devices.boxId, boxId)).limit(1);
  if (!device) return { ok: false, error: `No device named "${boxId}".` };

  const now = new Date();
  await db
    .update(devices)
    .set({
      fastUntil: new Date(now.getTime() + FAST_MODE_MS),
      ...(command === "arm" ? {} : { pendingCommand: command, pendingCommandAt: now }),
    })
    .where(eq(devices.id, device.id));

  return { ok: true };
}
