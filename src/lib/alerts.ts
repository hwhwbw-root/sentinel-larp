export type DeviceType = "CO2" | "H2";

/**
 * Fallback thresholds used when a device has no thresholds configured yet.
 * Mirrors the original firmware/mocksense DEFAULT_THRESHOLDS so behavior is
 * unchanged for devices that haven't been given custom thresholds.
 */
export const DEFAULT_THRESHOLDS: Record<
  DeviceType,
  { alert: number; dangerous: number }
> = {
  CO2: { alert: 1000, dangerous: 1500 },
  H2: { alert: 1, dangerous: 2 },
};

/**
 * Single source of truth for the 0/1/2 (normal/alert/dangerous) alert level.
 * The original codebase duplicated this comparison in the ESP32 firmware,
 * mocksense.py, and a frontend hook - this is the only place it should live
 * now. Always computed server-side; never trust a client-supplied alert value.
 */
export function computeAlertLevel(
  gasValue: number,
  alertThreshold: number | null | undefined,
  dangerousThreshold: number | null | undefined,
  deviceType: DeviceType,
): 0 | 1 | 2 {
  const defaults = DEFAULT_THRESHOLDS[deviceType];
  const alert = alertThreshold ?? defaults.alert;
  const dangerous = dangerousThreshold ?? defaults.dangerous;

  if (gasValue >= dangerous) return 2;
  if (gasValue >= alert) return 1;
  return 0;
}
