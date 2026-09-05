// No "server-only" guard here: this module is shared by server actions/
// routes and by src/db/seed.ts, which runs standalone via tsx outside
// Next's build pipeline (where "server-only" always throws).
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
