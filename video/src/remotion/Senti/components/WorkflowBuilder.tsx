import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Plus, Volume2, ShieldCheck, Zap } from "lucide-react";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const WorkflowBuilder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enter = spring({ frame, fps, config: SENTI_SPRINGS.smooth });
  const scale = interpolate(enter, [0, 1], [0.93, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Cursor position interpolation simulating user clicking
  const cursorX = interpolate(frame, [0, 60, 100, 140], [800, 640, 520, 520], {
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [0, 60, 100, 140], [600, 380, 480, 480], {
    extrapolateRight: "clamp",
  });
  const cursorClick = frame > 130 && frame < 150;

  // Staggered node entrance
  const s1 = spring({ frame: frame - 15, fps, config: SENTI_SPRINGS.snappy });
  const s2 = spring({ frame: frame - 35, fps, config: SENTI_SPRINGS.snappy });
  const s3 = spring({ frame: frame - 55, fps, config: SENTI_SPRINGS.snappy });

  return (
    <div
      className="relative w-[1100px] flex flex-col select-none"
      style={{
        fontFamily: SENTI_FONT_FAMILY,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Workflow Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800">
            Safety Automation Engine
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-2">
            Facility Safety Rule: Bay 1 Emergency Interlock
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-2">
            <span>Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full bg-emerald-400"
                style={{ opacity: Math.sin(frame * 0.2) * 0.4 + 0.6 }}
              />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Connected Workflow Chain */}
      <div className="relative flex flex-col gap-5 pl-14">
        {/* Connecting Vertical Line */}
        <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 shadow-[0_0_12px_rgba(56,189,248,0.6)]" />

        {/* Node 1: Trigger Condition */}
        <div
          className="relative flex items-center gap-5"
          style={{
            transform: `translateX(${interpolate(s1, [0, 1], [-20, 0])}px)`,
            opacity: interpolate(s1, [0, 1], [0, 1]),
          }}
        >
          {/* Step Number Bubble */}
          <div className="absolute -left-14 w-10 h-10 rounded-full bg-white text-blue-600 font-bold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)] border-2 border-sky-300 z-10">
            1
          </div>

          <div className="flex-1 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-400/40 text-xs font-mono font-bold text-sky-200 uppercase">
                TRIGGER
              </span>
              <span className="text-base font-semibold text-zinc-100">
                CO₂ Concentration &gt; 1,500 ppm in any monitored bay
              </span>
            </div>
            <Zap size={18} className="text-amber-400" />
          </div>
        </div>

        {/* Node 2: Local Hardware Alarm Action */}
        <div
          className="relative flex items-center gap-5"
          style={{
            transform: `translateX(${interpolate(s2, [0, 1], [-20, 0])}px)`,
            opacity: interpolate(s2, [0, 1], [0, 1]),
          }}
        >
          <div className="absolute -left-14 w-10 h-10 rounded-full bg-white text-blue-600 font-bold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)] border-2 border-sky-300 z-10">
            2
          </div>

          <div className="flex-1 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-400/40 text-xs font-mono font-bold text-red-300 uppercase">
                HARDWARE
              </span>
              <span className="text-base font-semibold text-zinc-100">
                Sound ESP32 local buzzer & flash physical danger LED
              </span>
            </div>
            <Volume2 size={18} className="text-red-400" />
          </div>
        </div>

        {/* Node 3: Compliance Log Action */}
        <div
          className="relative flex items-center gap-5"
          style={{
            transform: `translateX(${interpolate(s3, [0, 1], [-20, 0])}px)`,
            opacity: interpolate(s3, [0, 1], [0, 1]),
          }}
        >
          <div className="absolute -left-14 w-10 h-10 rounded-full bg-white text-blue-600 font-bold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)] border-2 border-sky-300 z-10">
            3
          </div>

          <div className="flex-1 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-xs font-mono font-bold text-emerald-300 uppercase">
                AUDIT LOG
              </span>
              <span className="text-base font-semibold text-zinc-100">
                Commit immutable audit trail into Neon Postgres for OSHA reporting
              </span>
            </div>
            <ShieldCheck size={18} className="text-emerald-400" />
          </div>
        </div>

        {/* Add Step Button */}
        <div className="flex items-center justify-start pt-2">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold backdrop-blur-md">
            <Plus size={15} />
            <span>Add Workflow Step</span>
          </button>
        </div>
      </div>

      {/* Animated Sleek macOS Cursor Pointer */}
      <div
        className="absolute pointer-events-none z-30"
        style={{
          transform: `translate(${cursorX}px, ${cursorY}px) scale(${cursorClick ? 0.85 : 1})`,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M5 3 L23 14 L14 16 L10 24 L5 3 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
