import type { DeviceType } from "./alerts";
import type { UserRole } from "./rbac";

export type { DeviceType, UserRole };

export interface Device {
  id: string;
  boxId: string;
  deviceType: DeviceType;
  status: string;
  alias: string | null;
  alertThreshold: number | null;
  dangerousThreshold: number | null;
  calA: number | null;
  calB: number | null;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentDataPoint {
  id: string;
  boxId: string;
  gasValue: number;
  temperature: number | null;
  humidity: number | null;
  alert: 0 | 1 | 2;
  createdAt: string;
  receiveAt: string;
}

export type TimeRange = "10m" | "30m" | "1h";

export interface AlertItem {
  id: string;
  boxId: string;
  level: "Alert" | "Dangerous";
  message: string;
  timestamp: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
