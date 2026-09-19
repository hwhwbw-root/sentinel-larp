"use client";

import { useState, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Edit, Check, X, KeyRound, Copy } from "lucide-react";
import type { Device, DeviceType, UserRole } from "@/lib/types";
import {
  addDeviceAction,
  deleteDeviceAction,
  updateDeviceAliasAction,
  updateDeviceThresholdsAction,
  updateDeviceCalibrationAction,
  updateDeviceTypeAction,
  regenerateDeviceApiKeyAction,
  type AddDeviceState,
} from "@/lib/actions/devices";
import { BentoCard } from "@/components/ui/BentoCard";
import { spring } from "@/lib/motion";

type FieldName = "alias" | "alertThreshold" | "dangerousThreshold" | "calA" | "calB";
type EditingField = { deviceId: string; field: FieldName } | null;

export function DeviceManagementClient({
  devices,
  currentUserRole,
}: {
  devices: Device[];
  currentUserRole: UserRole;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState<{ boxId: string; apiKey: string } | null>(null);

  const canEdit = currentUserRole !== "Viewer";
  const isSuperadmin = currentUserRole === "Superadmin";

  const startEdit = (deviceId: string, field: FieldName, current: string | number | null) => {
    if (!canEdit) return;
    setEditing({ deviceId, field });
    setEditValue(current?.toString() ?? "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue("");
  };

  const saveEdit = () => {
    if (!editing) return;
    const { deviceId, field } = editing;

    startTransition(async () => {
      if (field === "alias") {
        await updateDeviceAliasAction(deviceId, editValue.trim());
      } else if (field === "alertThreshold" || field === "dangerousThreshold") {
        const device = devices.find((d) => d.id === deviceId);
        const num = editValue === "" ? null : parseFloat(editValue);
        const alertThreshold = field === "alertThreshold" ? num : (device?.alertThreshold ?? null);
        const dangerousThreshold =
          field === "dangerousThreshold" ? num : (device?.dangerousThreshold ?? null);
        await updateDeviceThresholdsAction(deviceId, alertThreshold, dangerousThreshold);
      } else if (field === "calA" || field === "calB") {
        const device = devices.find((d) => d.id === deviceId);
        const num = editValue === "" ? null : parseFloat(editValue);
        const calA = field === "calA" ? num : (device?.calA ?? null);
        const calB = field === "calB" ? num : (device?.calB ?? null);
        await updateDeviceCalibrationAction(deviceId, calA, calB);
      }
      cancelEdit();
      router.refresh();
    });
  };

  const handleTypeChange = (deviceId: string, deviceType: DeviceType) => {
    startTransition(async () => {
      await updateDeviceTypeAction(deviceId, deviceType);
      router.refresh();
    });
  };

  const handleDelete = (deviceId: string, boxId: string) => {
    if (!confirm(`Delete device "${boxId}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteDeviceAction(deviceId);
      router.refresh();
    });
  };

  const handleRegenerateKey = (deviceId: string, boxId: string) => {
    if (
      !confirm(
        `Generate a new API key for "${boxId}"? The device's old key will stop working immediately.`,
      )
    )
      return;
    startTransition(async () => {
      const { apiKey } = await regenerateDeviceApiKeyAction(deviceId);
      setNewApiKey({ boxId, apiKey });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Device Management</h1>
          <p className="text-zinc-500 text-sm">{devices.length} device(s) registered</p>
        </div>
        {isSuperadmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            Add Device
          </button>
        )}
      </div>

      <BentoCard variant="tile" className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold text-xs">
              <tr>
                <th className="px-4 py-3">Box ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Alias</th>
                <th className="px-4 py-3">Alert Threshold</th>
                <th className="px-4 py-3">Dangerous Threshold</th>
                <th className="px-4 py-3">Cal A</th>
                <th className="px-4 py-3">Cal B</th>
                {isSuperadmin && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-zinc-700">{device.boxId}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        device.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${device.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"}`}
                      />
                      {device.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <select
                        value={device.deviceType}
                        onChange={(e) => handleTypeChange(device.id, e.target.value as DeviceType)}
                        disabled={isPending}
                        className="bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-700"
                      >
                        <option value="CO2">CO2</option>
                        <option value="H2">H2</option>
                      </select>
                    ) : (
                      device.deviceType
                    )}
                  </td>
                  <EditableCell
                    value={device.alias}
                    isEditing={editing?.deviceId === device.id && editing.field === "alias"}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStart={() => startEdit(device.id, "alias", device.alias)}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    canEdit={canEdit}
                    placeholder="No alias"
                  />
                  <EditableCell
                    value={device.alertThreshold}
                    isEditing={editing?.deviceId === device.id && editing.field === "alertThreshold"}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStart={() => startEdit(device.id, "alertThreshold", device.alertThreshold)}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    canEdit={canEdit}
                    numeric
                    className="text-amber-600 tabular-nums"
                  />
                  <EditableCell
                    value={device.dangerousThreshold}
                    isEditing={editing?.deviceId === device.id && editing.field === "dangerousThreshold"}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStart={() =>
                      startEdit(device.id, "dangerousThreshold", device.dangerousThreshold)
                    }
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    canEdit={canEdit}
                    numeric
                    className="text-red-600 tabular-nums"
                  />
                  <EditableCell
                    value={device.calA}
                    isEditing={editing?.deviceId === device.id && editing.field === "calA"}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStart={() => startEdit(device.id, "calA", device.calA)}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    canEdit={canEdit}
                    numeric
                    className="text-cyan-700 tabular-nums"
                  />
                  <EditableCell
                    value={device.calB}
                    isEditing={editing?.deviceId === device.id && editing.field === "calB"}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStart={() => startEdit(device.id, "calB", device.calB)}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    canEdit={canEdit}
                    numeric
                    className="text-cyan-700 tabular-nums"
                  />
                  {isSuperadmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRegenerateKey(device.id, device.boxId)}
                          disabled={isPending}
                          title="Regenerate API key"
                          className="text-zinc-400 hover:text-accent transition-colors"
                        >
                          <KeyRound size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(device.id, device.boxId)}
                          disabled={isPending}
                          title="Delete device"
                          className="text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {devices.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-zinc-400">
                    No devices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </BentoCard>

      <AnimatePresence>
        {showAddModal && (
          <AddDeviceModal onClose={() => setShowAddModal(false)} onCreated={() => router.refresh()} />
        )}
        {newApiKey && (
          <ApiKeyModal boxId={newApiKey.boxId} apiKey={newApiKey.apiKey} onClose={() => setNewApiKey(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditableCell({
  value,
  isEditing,
  editValue,
  setEditValue,
  onStart,
  onSave,
  onCancel,
  canEdit,
  numeric,
  placeholder,
  className,
}: {
  value: string | number | null;
  isEditing: boolean;
  editValue: string;
  setEditValue: (v: string) => void;
  onStart: () => void;
  onSave: () => void;
  onCancel: () => void;
  canEdit: boolean;
  numeric?: boolean;
  placeholder?: string;
  className?: string;
}) {
  if (isEditing) {
    return (
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <input
            autoFocus
            type={numeric ? "number" : "text"}
            step={numeric ? "any" : undefined}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
              if (e.key === "Escape") onCancel();
            }}
            className="w-24 bg-white border border-accent/50 rounded px-2 py-1 text-zinc-900 outline-none"
          />
          <button onClick={onSave} className="text-accent hover:text-accent/80">
            <Check size={14} />
          </button>
          <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600">
            <X size={14} />
          </button>
        </div>
      </td>
    );
  }

  return (
    <td
      onClick={canEdit ? onStart : undefined}
      className={`px-4 py-3 ${canEdit ? "cursor-pointer hover:bg-zinc-100 group" : ""} ${className ?? ""}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {value !== null && value !== undefined && value !== "" ? (
          value
        ) : (
          <span className="text-zinc-400">{placeholder ?? "Not set"}</span>
        )}
        {canEdit && (
          <Edit size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </td>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
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
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function AddDeviceModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [state, formAction, pending] = useActionState<AddDeviceState, FormData>(
    addDeviceAction,
    undefined,
  );

  if (state && "success" in state) {
    return (
      <ApiKeyModal
        boxId={state.boxId}
        apiKey={state.apiKey}
        onClose={() => {
          onCreated();
          onClose();
        }}
      />
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-900">Add Device</h3>
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
          <Field label="Box ID *" name="boxId" placeholder="SENTINEL-1A2B" required />
          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1">Device Type *</label>
            <select
              name="deviceType"
              required
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900"
            >
              <option value="CO2">CO2</option>
              <option value="H2">H2</option>
            </select>
          </div>
          <Field label="Alias" name="alias" placeholder="Optional display name" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Alert Threshold" name="alertThreshold" type="number" step="any" />
            <Field label="Dangerous Threshold" name="dangerousThreshold" type="number" step="any" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cal A" name="calA" type="number" step="any" />
            <Field label="Cal B" name="calB" type="number" step="any" />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-accent hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50 text-accent-foreground font-medium py-2.5 rounded-lg transition-all"
          >
            {pending ? "Creating..." : "Create Device"}
          </button>
        </form>
      </div>
    </ModalShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-600">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
      />
    </div>
  );
}

function ApiKeyModal({
  boxId,
  apiKey,
  onClose,
}: {
  boxId: string;
  apiKey: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <ModalShell onClose={onClose}>
      <div className="bg-white border border-accent/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-zinc-900">Device API key for {boxId}</h3>
        <p className="text-sm text-amber-600">
          Copy this now - it will not be shown again. Flash it into the device&apos;s firmware
          config (or mocksense.py) in place of the old Supabase key.
        </p>
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5">
          <code className="text-accent text-sm break-all flex-1">{apiKey}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-zinc-400 hover:text-zinc-900 shrink-0"
          >
            <Copy size={16} />
          </button>
        </div>
        {copied && <p className="text-xs text-accent">Copied to clipboard</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
