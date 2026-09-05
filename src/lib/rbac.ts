export type UserRole = "Superadmin" | "Admin" | "Viewer";

const ROLE_RANK: Record<UserRole, number> = {
  Viewer: 1,
  Admin: 2,
  Superadmin: 3,
};

/** Does `role` meet or exceed `required` in the Viewer < Admin < Superadmin hierarchy? */
export function roleAtLeast(role: UserRole, required: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}
