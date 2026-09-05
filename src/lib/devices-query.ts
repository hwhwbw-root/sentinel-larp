import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { devices } from "@/db/schema";
import type { Device } from "@/lib/types";

const OFFLINE_TIMEOUT_MS = 2.5 * 60 * 1000;

export async function getDevices(): Promise<Device[]> {
  const rows = await db.select().from(devices).orderBy(asc(devices.boxId));

  return rows.map((row) => ({
    id: row.id,
    boxId: row.boxId,
    deviceType: row.deviceType,
    status: computeOnlineStatus(row.lastSeen),
    alias: row.alias,
    alertThreshold: row.alertThreshold,
    dangerousThreshold: row.dangerousThreshold,
    calA: row.calA,
    calB: row.calB,
    lastSeen: row.lastSeen?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

function computeOnlineStatus(lastSeen: Date | null): string {
  if (!lastSeen) return "Offline";
  return Date.now() - lastSeen.getTime() < OFFLINE_TIMEOUT_MS ? "Active" : "Offline";
}
