import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Check, Cpu, Radio, ShieldCheck } from "lucide-react";
import { SENTI_FONT_FAMILY, SENTI_MONO_FAMILY, SENTI_SPRINGS } from "../theme";

export const InfrastructureConnector: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enter = spring({ frame, fps, config: SENTI_SPRINGS.snappy });
  const checkSpring = spring({ frame: frame - 20, fps, config: SENTI_SPRINGS.bouncy });

  const lineProgress = interpolate(frame, [10, 35], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative w-full h-full flex items-center justify-between px-24 select-none"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      {/* Left Side: Highlighted Event Card */}
      <div
        className="w-[480px] bg-white rounded-3xl p-7 border border-zinc-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] flex flex-col gap-4 relative z-10"
        style={{
          transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
          opacity: interpolate(enter, [0, 1], [0, 1]),
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-black text-xs">
              #01
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900">mocksense-0</div>
              <div className="text-xs text-zinc-400 font-mono">Bay 1 — Mixing Facility</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-red-100 text-red-700">
            DANGER SPIKE
          </span>
        </div>

        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-medium">CO₂ Concentration</div>
            <div className="text-3xl font-black text-red-600 tracking-tight">
              1,686 <span className="text-sm font-normal text-zinc-500">ppm</span>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-zinc-400">
            <div>Limit: 1,500 ppm</div>
            <div className="text-red-500 font-bold">+186 ppm OVER</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono pt-1">
          <span className="flex items-center gap-1.5">
            <Radio size={13} className="text-[#2f6fed] animate-pulse" />
            ESP32 Wi-Fi Telemetry
          </span>
          <span>Timestamp: 14:28:10 UTC</span>
        </div>
      </div>

      {/* Connecting Node & Glowing Line */}
      <div className="flex-1 flex items-center justify-center relative px-6 z-10">
        <div className="w-full h-1 bg-zinc-200/80 relative rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2f6fed] to-[#38bdf8] shadow-[0_0_15px_#38bdf8]"
            style={{ width: `${lineProgress}%` }}
          />
        </div>

        {/* Center Glowing Diamond Indicator */}
        <div
          className="absolute w-5 h-5 bg-[#38bdf8] border-2 border-white shadow-[0_0_20px_#38bdf8] rotate-45"
          style={{
            transform: `rotate(45deg) scale(${lineProgress > 50 ? 1 : 0})`,
          }}
        />
      </div>

      {/* Right Side: Monospace Terminal Infrastructure Box */}
      <div
        className="w-[520px] bg-zinc-950/95 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 shadow-[0_30px_90px_rgba(0,0,0,0.4)] flex flex-col gap-5 relative z-10"
        style={{
          transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
          opacity: interpolate(enter, [0, 1], [0, 1]),
        }}
      >
        {/* The Iconic Monospace Pill from Numtera */}
        <div className="flex items-center gap-3.5 bg-zinc-900/90 border border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-inner">
          <div
            className="w-6 h-6 rounded-md bg-[#2f6fed] flex items-center justify-center text-white shrink-0"
            style={{
              transform: `scale(${interpolate(checkSpring, [0, 1], [0, 1])})`,
            }}
          >
            <Check size={16} strokeWidth={3} />
          </div>
          <span
            className="text-base text-zinc-100 font-semibold tracking-wide"
            style={{ fontFamily: SENTI_MONO_FAMILY }}
          >
            Connected to your edge infrastructure
          </span>
        </div>

        {/* Tech Details List */}
        <div
          className="space-y-3 text-xs text-zinc-400 font-mono pt-2 border-t border-zinc-800"
          style={{ fontFamily: SENTI_MONO_FAMILY }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-300">
              <Cpu size={14} className="text-[#38bdf8]" />
              Edge Nodes
            </span>
            <span className="text-emerald-400 font-bold">2/2 Online (10s sync)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck size={14} className="text-[#38bdf8]" />
              Database Engine
            </span>
            <span>Neon Serverless Postgres</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-300">
              <Radio size={14} className="text-[#38bdf8]" />
              Zero-Latency Ingestion
            </span>
            <span className="text-zinc-200 font-bold">Sub-4s Polling Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
