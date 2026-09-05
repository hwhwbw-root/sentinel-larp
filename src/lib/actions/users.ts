"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireRole } from "@/lib/api-auth";
import { hashPassword } from "@/lib/password";
import type { UserRole } from "@/lib/rbac";

export type AddUserState = { error: string } | { success: true } | undefined;

const VALID_ROLES: UserRole[] = ["Superadmin", "Admin", "Viewer"];

export async function addUserAction(
  _prevState: AddUserState,
  formData: FormData,
): Promise<AddUserState> {
  await requireRole("Superadmin");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "") as UserRole;
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (!VALID_ROLES.includes(role)) {
    return { error: "Invalid role." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const passwordHash = await hashPassword(password);

  try {
    await db.insert(users).values({ name, email, role, passwordHash });
  } catch {
    return { error: `A user with email "${email}" already exists.` };
  }

  revalidatePath("/users");
  return { success: true };
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
  const currentUser = await requireRole("Superadmin");
  if (currentUser.id === userId) {
    throw new Error("Cannot modify your own account");
  }
  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));
  revalidatePath("/users");
}

export async function deleteUserAction(userId: string) {
  const currentUser = await requireRole("Superadmin");
  if (currentUser.id === userId) {
    throw new Error("Cannot delete your own account");
  }
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/users");
}
