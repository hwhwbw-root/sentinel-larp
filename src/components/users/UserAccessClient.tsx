"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import type { AppUser, UserRole } from "@/lib/types";
import {
  addUserAction,
  updateUserRoleAction,
  deleteUserAction,
  type AddUserState,
} from "@/lib/actions/users";

const ROLE_STYLES: Record<UserRole, string> = {
  Superadmin: "bg-purple-500/10 text-purple-400",
  Admin: "bg-emerald-500/10 text-emerald-400",
  Viewer: "bg-slate-500/10 text-slate-400",
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
          <h1 className="text-2xl font-bold text-white tracking-tight">User Access</h1>
          <p className="text-slate-400 text-sm">{users.length} user(s)</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider font-semibold text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-medium">{user.name}</td>
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
                        className="text-slate-400 hover:text-red-400 transition-colors"
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
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => router.refresh()}
        />
      )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Add User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form action={formAction} className="p-5 space-y-4">
          {state && "error" in state && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Name *</label>
            <input
              name="name"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Role *</label>
            <select
              name="role"
              required
              defaultValue="Viewer"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
              <option value="Superadmin">Superadmin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Password * (min. 8 characters)
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <p className="text-xs text-slate-500">
            The account is created immediately with this password - there is no email invite
            flow. Share the password with the user directly.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {pending ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
