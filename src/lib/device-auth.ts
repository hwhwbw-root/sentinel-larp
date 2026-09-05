import "server-only";
import { randomBytes, createHash, timingSafeEqual } from "crypto";

const KEY_PREFIX = "sk_device_";

/**
 * Generates a new plaintext device API key. Only ever returned once, at
 * device creation - only its hash is stored.
 */
export function generateDeviceApiKey(): string {
  return `${KEY_PREFIX}${randomBytes(24).toString("hex")}`;
}

export function hashDeviceApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function verifyDeviceApiKey(key: string, hash: string): boolean {
  const candidate = Buffer.from(hashDeviceApiKey(key), "hex");
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}
