import "server-only";
import { auth } from "@/auth";
import { roleAtLeast, type UserRole } from "@/lib/rbac";

export class ApiAuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Requires an authenticated session with at least `minRole`. Throws
 * ApiAuthError (401/403) otherwise - callers should catch and translate to
 * a Response, e.g. via `handleApiAuthError`.
 */
export async function requireRole(minRole: UserRole) {
  const session = await auth();
  if (!session?.user) {
    throw new ApiAuthError(401, "Not authenticated");
  }
  if (!roleAtLeast(session.user.role, minRole)) {
    throw new ApiAuthError(403, "Insufficient permissions");
  }
  return session.user;
}

export function handleApiAuthError(err: unknown): Response | null {
  if (err instanceof ApiAuthError) {
    return Response.json({ error: err.message }, { status: err.status });
  }
  return null;
}
