"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import type { AppUser, UserRole } from "@/lib/types";
import {
  addUserAction,
  updateUserRoleAction,
  deleteUserAction,
  type AddUserState,
} from "@/lib/actions/users";
import { BentoCard } from "@/components/ui/BentoCard";
import { spring } from "@/lib/motion";

const ROLE_STYLES: Record<UserRole, string> = {
  Superadmin: "bg-violet-50 text-violet-700",
  Admin: "bg-accent/10 text-accent",
  Viewer: "bg-zinc-100 text-zinc-600",
};

export function UserAccessClient({
  users,
  currentUserId,
}: {
  users: AppUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRoleChange = (userId: string, role: UserRole) => {
    startTransition(async () => {
      await updateUserRoleAction(userId, role);
      router.refresh();
    });
  };

  const handleDelete = (userId: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteUserAction(userId);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">User Access</h1>
          <p className="text-zinc-500 text-sm">{users.length} user(s)</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <BentoCard variant="tile" className="overflow-hidden !p-0">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 text-zinc-800 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${ROLE_STYLES[user.role]}`}>
                        {user.role}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        disabled={isPending}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className={`text-xs font-semibold px-2 py-1 rounded border-0 ${ROLE_STYLES[user.role]}`}
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Admin">Admin</option>
                        <option value="Superadmin">Superadmin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={isPending}
                        title="Delete user"
                        className="text-zinc-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </BentoCard>

      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onCreated={() => router.refresh()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [state, formAction, pending] = useActionState<AddUserState, FormData>(
    addUserAction,
    undefined,
  );

  useEffect(() => {
    if (state && "success" in state) {
      onCreated();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={spring}
        className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-900">Add User</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900">
            <X size={20} />
          </button>
        </div>
        <form action={formAction} className="p-5 space-y-4">
          {state && "error" in state && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-600">Name *</label>
            <input
              name="name"
              required
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-600">Email *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-600">Role *</label>
            <select
              name="role"
              required
              defaultValue="Viewer"
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900"
            >
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
              <option value="Superadmin">Superadmin</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-600">
              Password * (min. 8 characters)
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </div>
          <p className="text-xs text-zinc-400">
            The account is created immediately with this password - there is no email invite
            flow. Share the password with the user directly.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-accent hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50 text-accent-foreground font-medium py-2.5 rounded-lg transition-all"
          >
            {pending ? "Creating..." : "Create User"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
