"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
import { BentoCard } from "@/components/ui/BentoCard";
import { spring } from "@/lib/motion";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

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
        ? "File exceeds the 4 MB size limit."
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
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Firmware Update</h1>
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2">
          <Tag size={13} className="text-zinc-400" />
          <span className="text-xs text-zinc-500">Current version</span>
          <span className="text-xs font-mono font-semibold text-accent tabular-nums">
            {currentVersion ?? "none uploaded"}
          </span>
        </div>
      </div>

      <BentoCard variant="tile" className="space-y-5 !p-6">
        {state && "success" in state && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700">Firmware uploaded successfully.</p>
          </div>
        )}
        {state && "error" in state && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <XCircle size={16} className="text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}
        {fileError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <XCircle size={16} className="text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{fileError}</p>
          </div>
        )}

        <form ref={formRef} action={formAction} onSubmit={handleSubmitClick} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-600">Firmware Version *</label>
            <input
              type="text"
              name="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 4.0"
              disabled={pending}
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:opacity-50"
            />
            <p className="text-xs text-zinc-400">
              Use a plain number like 4.0 (not v4.0): the box compares it as a decimal.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-600">Firmware File (.bin) *</label>
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
                  ? "border-accent bg-accent/5"
                  : file
                    ? "border-accent/40 bg-accent/5"
                    : "border-zinc-300 hover:border-zinc-400 bg-zinc-50"
              } ${pending ? "pointer-events-none opacity-50" : ""}`}
            >
              {file ? (
                <>
                  <FileCode2 size={28} className="text-accent" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-900">{file.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 tabular-nums">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-zinc-400" />
                  <div className="text-center">
                    <p className="text-sm text-zinc-500">
                      Drop your <span className="text-zinc-900 font-medium">.bin</span> file here
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">or click to browse - max 4 MB</p>
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
              className="bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-foreground px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all"
            >
              <Upload size={14} />
              {pending ? "Uploading..." : "Push Firmware"}
            </button>
          </div>
        </form>
      </BentoCard>

      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex gap-3">
        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="font-medium text-zinc-700">Note: </span>
          Once uploaded, all online ESP32 devices will pull the new firmware on their next OTA
          check. Ensure the binary is compiled and tested before pushing to production.
        </p>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={spring}
              className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-zinc-200">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <ShieldAlert size={18} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-zinc-900">Push firmware to production?</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">This action will affect all connected devices.</p>
                </div>
              </div>

              <div className="px-5 py-4 space-y-4">
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Version</span>
                    <span className="text-zinc-900 font-mono font-medium">{version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">File</span>
                    <span className="text-zinc-900 font-mono text-xs truncate max-w-[180px]">{file?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Size</span>
                    <span className="text-zinc-700 tabular-nums">
                      {file ? (file.size / 1024).toFixed(1) + " KB" : "-"}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-2">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Disclaimer</p>
                  <ul className="text-xs text-zinc-600 leading-relaxed space-y-1.5 list-disc list-inside">
                    <li>All ESP32 devices currently online will receive this firmware on their next OTA check.</li>
                    <li>Verify the binary has been fully tested before proceeding.</li>
                    <li>
                      This action is <span className="text-amber-700 font-medium">irreversible</span> - you
                      cannot recall a firmware once it has been pushed.
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500">
                    Type{" "}
                    <span className="font-mono text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">{version}</span>{" "}
                    to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder={version}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-5 pb-5">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmInput("");
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedUpload}
                  disabled={confirmInput !== version.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 active:scale-[0.98] flex items-center gap-2 transition-all disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                >
                  <Upload size={14} />
                  Yes, push firmware
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
