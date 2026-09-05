"use client";

import { useState, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Device Management</h1>
          <p className="text-slate-400 text-sm">{devices.length} device(s) registered</p>
        </div>
        {isSuperadmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Device
          </button>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider font-semibold text-xs">
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
            <tbody className="divide-y divide-slate-800">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-300">{device.boxId}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        device.status === "Active" ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${device.status === "Active" ? "bg-emerald-400" : "bg-slate-600"}`}
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
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200"
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
                    className="text-amber-400"
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
                    className="text-red-400"
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
                    className="text-cyan-400"
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
                    className="text-cyan-400"
                  />
                  {isSuperadmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRegenerateKey(device.id, device.boxId)}
                          disabled={isPending}
                          title="Regenerate API key"
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <KeyRound size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(device.id, device.boxId)}
                          disabled={isPending}
                          title="Delete device"
                          className="text-slate-400 hover:text-red-400 transition-colors"
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
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-600">
                    No devices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddDeviceModal onClose={() => setShowAddModal(false)} onCreated={() => router.refresh()} />
      )}

      {newApiKey && <ApiKeyModal boxId={newApiKey.boxId} apiKey={newApiKey.apiKey} onClose={() => setNewApiKey(null)} />}
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
            className="w-24 bg-slate-950 border border-emerald-500/50 rounded px-2 py-1 text-white outline-none"
          />
          <button onClick={onSave} className="text-emerald-400 hover:text-emerald-300">
            <Check size={14} />
          </button>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-300">
            <X size={14} />
          </button>
        </div>
      </td>
    );
  }

  return (
    <td
      onClick={canEdit ? onStart : undefined}
      className={`px-4 py-3 ${canEdit ? "cursor-pointer hover:bg-slate-800 group" : ""} ${className ?? ""}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {value !== null && value !== undefined && value !== "" ? (
          value
        ) : (
          <span className="text-slate-600">{placeholder ?? "Not set"}</span>
        )}
        {canEdit && (
          <Edit size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </td>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Add Device</h3>
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
          <Field label="Box ID *" name="boxId" placeholder="SENTINEL-1A2B" required />
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Device Type *</label>
            <select
              name="deviceType"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
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
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {pending ? "Creating..." : "Create Device"}
          </button>
        </form>
      </div>
    </div>
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
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 outline-none focus:border-emerald-500"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-emerald-700/50 rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Device API key for {boxId}</h3>
        <p className="text-sm text-amber-400">
          Copy this now - it will not be shown again. Flash it into the device&apos;s firmware
          config (or mocksense.py) in place of the old Supabase key.
        </p>
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5">
          <code className="text-emerald-400 text-sm break-all flex-1">{apiKey}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-slate-400 hover:text-white shrink-0"
          >
            <Copy size={16} />
          </button>
        </div>
        {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
