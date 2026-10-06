"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Radio, SlidersHorizontal, Square, Trash2, X } from "lucide-react";
import type { DeviceType } from "@/lib/types";
import {
  injectDemoReadingAction,
  resetDemoDataAction,
  sendHardwareCommandAction,
  type DemoScenario,
  type HardwareCommand,
} from "@/lib/actions/demo";
import { playSound, type SoundKind } from "@/lib/sounds";
import { spring } from "@/lib/motion";

interface HardwareBox {
  boxId: string;
  label: string;
}

interface DemoPanelProps {
  onInjected: (boxId: string) => void;
  hardwareBoxes: HardwareBox[];
}

const HARDWARE_COMMAND: Record<DemoScenario, HardwareCommand> = {
  normal: "normal",
  warning: "warning",
  danger: "danger",
  "temp-spike": "notice",
  "humidity-spike": "notice",
};

interface Step {
  scenario: DemoScenario;
  sound: SoundKind;
  label: string;
}

const SCENARIOS: Record<DemoScenario, Step> = {
  normal: { scenario: "normal", sound: "normal", label: "Normal" },
  warning: { scenario: "warning", sound: "warning", label: "Warning" },
  danger: { scenario: "danger", sound: "danger", label: "Danger" },
  "temp-spike": { scenario: "temp-spike", sound: "notice", label: "Temperature spike" },
  "humidity-spike": { scenario: "humidity-spike", sound: "notice", label: "Humidity spike" },
};

const ESCALATION: Step[] = [
  SCENARIOS.normal,
  SCENARIOS.warning,
  SCENARIOS.warning,
  SCENARIOS.danger,
  SCENARIOS.danger,
  SCENARIOS.danger,
  SCENARIOS.warning,
  { ...SCENARIOS.normal, sound: "clear", label: "Back to normal" },
];
const ESCALATION_STEP_MS = 1800;

const SOUND_BUTTONS: { kind: SoundKind; label: string }[] = [
  { kind: "normal", label: "Normal" },
  { kind: "notice", label: "Notice" },
  { kind: "warning", label: "Warning" },
  { kind: "danger", label: "Danger" },
  { kind: "clear", label: "All clear" },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function DemoPanel({ onInjected, hardwareBoxes }: DemoPanelProps) {
  const [open, setOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("CO2");
  const [busy, setBusy] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);
  const [target, setTarget] = useState(hardwareBoxes[0]?.boxId ?? "");
  const [mirror, setMirror] = useState(true);
  const hardwareOn = mirror && !!target;

  const sendHardware = async (command: HardwareCommand) => {
    if (!target) return;
    const res = await sendHardwareCommandAction(target, command);
    if (!res.ok) setError(res.error ?? "Could not reach the box.");
  };

  useEffect(() => {
    if (!hardwareBoxes.some((b) => b.boxId === target)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- keep the selection valid when the device list changes
      setTarget(hardwareBoxes[0]?.boxId ?? "");
    }
  }, [hardwareBoxes, target]);

  // Tell the box to upload faster while the panel is open, so the first click
  // isn't stuck behind its normal 10s upload cycle. Renewed every 4 minutes.
  useEffect(() => {
    if (!open || !hardwareOn) return;
    void sendHardwareCommandAction(target, "arm");
    const id = setInterval(() => void sendHardwareCommandAction(target, "arm"), 4 * 60 * 1000);
    return () => clearInterval(id);
  }, [open, hardwareOn, target]);

  const send = async (step: Step, mirrorToBox = true) => {
    playSound(step.sound);
    if (hardwareOn && mirrorToBox) void sendHardware(HARDWARE_COMMAND[step.scenario]);
    const res = await injectDemoReadingAction(deviceType, step.scenario);
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    setError(null);
    setStatus(
      `${step.label}: ${res.gasValue} ppm, ${res.temperature} C, ${res.humidity}%`,
    );
    onInjected(res.boxId);
    return true;
  };

  const runOnce = async (step: Step) => {
    setBusy(true);
    await send(step);
    setBusy(false);
  };

  const toggleEscalation = async () => {
    if (escalating) {
      cancelRef.current = true;
      if (hardwareOn) void sendHardware("stop");
      return;
    }
    cancelRef.current = false;
    setEscalating(true);
    // The box plays the whole escalation as one local script, so it stays in
    // step with this sequence regardless of its upload timing.
    if (hardwareOn) void sendHardware("escalate");
    for (const step of ESCALATION) {
      if (cancelRef.current) break;
      const ok = await send(step, false);
      if (!ok) break;
      await sleep(ESCALATION_STEP_MS);
    }
    setEscalating(false);
  };

  const reset = async () => {
    setBusy(true);
    const res = await resetDemoDataAction();
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Could not clear demo data.");
      return;
    }
    setError(null);
    setStatus("Demo readings cleared");
    playSound("clear");
  };

  const disabled = busy || escalating;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={spring}
            className="w-[calc(100vw-3rem)] sm:w-96 max-h-[calc(100dvh-8rem)] overflow-y-auto custom-scrollbar bg-white border border-zinc-200/60 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)] p-5 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-zinc-900">Demo controls</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Sends scripted readings to a dedicated demo device.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
                aria-label="Close demo controls"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
              {(["CO2", "H2"] as DeviceType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setDeviceType(type)}
                  disabled={escalating}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    deviceType === type
                      ? "bg-white text-accent shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {type} box
                </button>
              ))}
            </div>

            <Section title="Gas level">
              <DemoButton disabled={disabled} onClick={() => runOnce(SCENARIOS.normal)}>
                Normal
              </DemoButton>
              <DemoButton
                tone="amber"
                disabled={disabled}
                onClick={() => runOnce(SCENARIOS.warning)}
              >
                Warning
              </DemoButton>
              <DemoButton
                tone="red"
                disabled={disabled}
                onClick={() => runOnce(SCENARIOS.danger)}
              >
                Danger
              </DemoButton>
              <DemoButton tone="accent" disabled={busy} onClick={toggleEscalation}>
                {escalating ? (
                  <>
                    <Square size={12} /> Stop
                  </>
                ) : (
                  <>
                    <Play size={12} /> Escalate
                  </>
                )}
              </DemoButton>
            </Section>

            <Section title="Other measurements">
              <DemoButton disabled={disabled} onClick={() => runOnce(SCENARIOS["temp-spike"])}>
                Temp spike
              </DemoButton>
              <DemoButton
                disabled={disabled}
                onClick={() => runOnce(SCENARIOS["humidity-spike"])}
              >
                Humidity spike
              </DemoButton>
              <DemoButton disabled={disabled} onClick={reset}>
                <Trash2 size={12} /> Clear demo data
              </DemoButton>
            </Section>

            <Section title="Physical box">
              {hardwareBoxes.length === 0 ? (
                <span className="text-xs text-zinc-400">
                  No physical boxes registered yet. Add one in Device Management.
                </span>
              ) : (
                <>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="bg-white border border-zinc-300 rounded-lg px-2 py-1.5 text-xs text-zinc-700"
                    aria-label="Physical box to sound"
                  >
                    {hardwareBoxes.map((b) => (
                      <option key={b.boxId} value={b.boxId}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
                    <input
                      type="checkbox"
                      checked={mirror}
                      onChange={(e) => setMirror(e.target.checked)}
                    />
                    Mirror buttons to box
                  </label>
                  <DemoButton
                    tone="accent"
                    disabled={!target}
                    onClick={() => void sendHardware("test")}
                  >
                    <Radio size={12} /> Test beep
                  </DemoButton>
                </>
              )}
            </Section>

            <Section title="Sounds only">
              {SOUND_BUTTONS.map(({ kind, label }) => (
                <DemoButton key={kind} onClick={() => playSound(kind)}>
                  {label}
                </DemoButton>
              ))}
            </Section>

            <div aria-live="polite" className="min-h-[1.25rem] text-xs tabular-nums">
              {error ? (
                <span className="text-red-600">{error}</span>
              ) : status ? (
                <span className="text-zinc-500">{status}</span>
              ) : (
                <span className="text-zinc-400">Pick a scenario to send a reading.</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white text-sm font-medium shadow-lg transition-all"
      >
        <SlidersHorizontal size={16} />
        Demo
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">{title}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const TONES = {
  neutral: "bg-zinc-100 hover:bg-zinc-200 text-zinc-700",
  amber: "bg-amber-100 hover:bg-amber-200 text-amber-800",
  red: "bg-red-100 hover:bg-red-200 text-red-800",
  accent: "bg-accent/10 hover:bg-accent/20 text-accent",
};

function DemoButton({
  tone = "neutral",
  disabled,
  onClick,
  children,
}: {
  tone?: keyof typeof TONES;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${TONES[tone]}`}
    >
      {children}
    </button>
  );
}
