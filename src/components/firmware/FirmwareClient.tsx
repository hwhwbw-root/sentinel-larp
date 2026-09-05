"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  CheckCircle,
  XCircle,
  FileCode2,
  AlertTriangle,
  ShieldAlert,
  Tag,
} from "lucide-react";
import { uploadFirmwareAction, type UploadFirmwareState } from "@/lib/actions/firmware";

export function FirmwareClient({ currentVersion }: { currentVersion: string | null }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<UploadFirmwareState, FormData>(
    uploadFirmwareAction,
    undefined,
  );

  const [version, setVersion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (state && "success" in state) {
      router.refresh();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot form reset after a completed upload action, not a render-loop concern
      setVersion("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const handleFileChange = (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files[0] ?? null);
  };

  const fileError =
    file && !file.name.endsWith(".bin")
      ? "Only .bin files are allowed."
      : file && file.size > MAX_FILE_SIZE
        ? "File exceeds the 50 MB size limit."
        : null;

  const handleSubmitClick = (e: React.FormEvent) => {
    if (confirmedRef.current) {
      confirmedRef.current = false;
      return; // let the confirmed submit go through to the server action
    }
    e.preventDefault();
    if (!version.trim() || !file || fileError) return;
    setConfirmInput("");
    setShowConfirm(true);
  };

  const handleConfirmedUpload = () => {
    setShowConfirm(false);
    confirmedRef.current = true;
    formRef.current?.requestSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Firmware Update</h1>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
          <Tag size={13} className="text-slate-500" />
          <span className="text-xs text-slate-400">Current version</span>
          <span className="text-xs font-mono font-semibold text-emerald-400">
            {currentVersion ?? "none uploaded"}
          </span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        {state && "success" in state && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300">Firmware uploaded successfully.</p>
          </div>
        )}
        {state && "error" in state && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <XCircle size={16} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{state.error}</p>
          </div>
        )}
        {fileError && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <XCircle size={16} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{fileError}</p>
          </div>
        )}

        <form ref={formRef} action={formAction} onSubmit={handleSubmitClick} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Firmware Version *
            </label>
            <input
              type="text"
              name="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 4.0"
              disabled={pending}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Firmware File (.bin) *
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                dragOver
                  ? "border-emerald-500 bg-emerald-500/5"
                  : file
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-slate-700 hover:border-slate-500 bg-slate-800/40"
              } ${pending ? "pointer-events-none opacity-50" : ""}`}
            >
              {file ? (
                <>
                  <FileCode2 size={28} className="text-emerald-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-slate-500" />
                  <div className="text-center">
                    <p className="text-sm text-slate-400">
                      Drop your <span className="text-white font-medium">.bin</span> file here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">or click to browse — max 50 MB</p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                name="firmware"
                type="file"
                accept=".bin"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={pending || !version.trim() || !file || !!fileError}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              <Upload size={14} />
              {pending ? "Uploading…" : "Push Firmware"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="font-medium text-slate-300">Note: </span>
          Once uploaded, all online ESP32 devices will pull the new firmware on their next OTA
          check. Ensure the binary is compiled and tested before pushing to production.
        </p>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-slate-800">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <ShieldAlert size={18} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Push firmware to production?</h2>
                <p className="text-xs text-slate-400 mt-0.5">This action will affect all connected devices.</p>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg px-4 py-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Version</span>
                  <span className="text-white font-mono font-medium">{version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File</span>
                  <span className="text-white font-mono text-xs truncate max-w-[180px]">{file?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Size</span>
                  <span className="text-slate-300">{file ? (file.size / 1024).toFixed(1) + " KB" : "—"}</span>
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Disclaimer</p>
                <ul className="text-xs text-slate-400 leading-relaxed space-y-1.5 list-disc list-inside">
                  <li>All ESP32 devices currently online will receive this firmware on their next OTA check.</li>
                  <li>Verify the binary has been fully tested in a staging environment before proceeding.</li>
                  <li>
                    This action is <span className="text-amber-300 font-medium">irreversible</span> — you cannot
                    recall a firmware once it has been pushed.
                  </li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400">
                  Type <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">{version}</span> to
                  confirm
                </label>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder={version}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 pb-5">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmInput("");
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedUpload}
                disabled={confirmInput !== version.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 flex items-center gap-2 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                <Upload size={14} />
                Yes, push firmware
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
