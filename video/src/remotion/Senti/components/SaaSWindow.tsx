import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  LayoutDashboard,
  History,
  HardDrive,
  Users,
  Wind,
  Thermometer,
  Droplets,
  Activity,
  AlertTriangle,
  ArrowUp,
} from "lucide-react";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

interface SaaSWindowProps {
  mode?: "normal" | "breach";
  ppmValue?: number;
  highlightCard?: boolean;
}

export const SaaSWindow: React.FC<SaaSWindowProps> = ({
  mode = "normal",
  ppmValue,
  highlightCard = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isBreach = mode === "breach";
  const gasReading = ppmValue ?? (isBreach ? 1686 : Math.round(520 + Math.sin(frame * 0.08) * 12));

  // Entrance spring
  const enter = spring({ frame, fps, config: SENTI_SPRINGS.smooth });
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Subtle floating continuous rotation
  const rotY = 5 + Math.sin(frame * 0.03) * 1.5;
  const rotX = 3 + Math.cos(frame * 0.025) * 1.2;

  return (
    <div
      className="relative w-[1140px] h-[640px] bg-white rounded-3xl border border-zinc-200/90 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.14)] flex flex-col overflow-hidden select-none"
      style={{
        fontFamily: SENTI_FONT_FAMILY,
        transform: `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`,
        opacity,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Top Window Bar */}
      <div className="h-11 bg-zinc-50 border-b border-zinc-200/80 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-zinc-200 text-xs font-mono text-zinc-600 shadow-xs">
          <span
            className={`w-2 h-2 rounded-full ${isBreach ? "bg-red-500" : "bg-emerald-500"}`}
            style={{ opacity: isBreach ? ((frame % 20) > 10 ? 1 : 0.3) : 1 }}
          />
          <span className="font-semibold text-zinc-800">Sentinel Safety Console</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-500">{isBreach ? "Bay 1 Breach" : "Monitoring Bay 1"}</span>
        </div>

        <div className="text-xs font-mono text-zinc-400">v2.4.0 • Neon Postgres</div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 bg-zinc-50/70 border-r border-zinc-200/80 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-7 h-7 rounded-xl bg-[#2f6fed] text-white flex items-center justify-center font-black text-xs">
                S
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-900">
                Sentinel Ops
              </span>
            </div>

            <nav className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#2f6fed]/10 text-[#2f6fed] font-bold">
                <LayoutDashboard size={15} />
                <span>Monitoring</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100">
                <History size={15} />
                <span>Data History</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100">
                <HardDrive size={15} />
                <span>Devices</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100">
                <Users size={15} />
                <span>User Access</span>
              </div>
            </nav>
          </div>

          <div className="pt-3 border-t border-zinc-200/80 flex items-center gap-2.5 px-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-[10px] text-zinc-700">
              EHS
            </div>
            <div>
              <div className="font-bold text-zinc-800 text-[11px]">Facility Ops</div>
              <div className="text-[10px] text-zinc-400">Superadmin</div>
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 bg-white p-6 flex flex-col justify-between overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                Real-Time Telemetry Feed
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Monitoring device <span className="font-mono text-zinc-700">mocksense-0</span> (Bay 1 — Mixing)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                isBreach
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}>
                {isBreach ? <AlertTriangle size={13} /> : <Activity size={13} />}
                <span>{isBreach ? "CRITICAL BREACH" : "LIVE • 10s EDGE PING"}</span>
              </span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-4 my-4">
            {/* CO2 Gas Card */}
            <div className={`rounded-2xl p-4 border ${
              isBreach
                ? "bg-red-50/50 border-red-300 ring-2 ring-red-400/30"
                : highlightCard
                ? "bg-blue-50/50 border-[#2f6fed] ring-2 ring-[#2f6fed]/20"
                : "bg-zinc-50/70 border-zinc-200"
            }`}>
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Wind size={15} className={isBreach ? "text-red-600" : "text-[#2f6fed]"} />
                  CO₂ Concentration
                </span>
                <span className="text-[10px] font-mono">PPM</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-4xl font-black tracking-tight ${isBreach ? "text-red-600" : "text-zinc-900"}`}>
                  {gasReading.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-zinc-500">ppm</span>
              </div>
              <div className="mt-2 text-[11px] font-medium flex items-center gap-1">
                {isBreach ? (
                  <span className="text-red-600 font-bold flex items-center gap-0.5">
                    <ArrowUp size={12} /> DANGEROUS LEVEL
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium">Safe baseline (&lt; 1,000 ppm)</span>
                )}
              </div>
            </div>

            {/* Temp Card */}
            <div className="rounded-2xl p-4 bg-zinc-50/70 border border-zinc-200">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Thermometer size={15} className="text-amber-500" />
                  Temperature
                </span>
                <span className="text-[10px] font-mono">°C</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900 tracking-tight">24.4</span>
                <span className="text-xs font-medium text-zinc-500">°C</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-600 font-medium">Nominal thermal band</div>
            </div>

            {/* Humidity Card */}
            <div className="rounded-2xl p-4 bg-zinc-50/70 border border-zinc-200">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Droplets size={15} className="text-sky-500" />
                  Humidity
                </span>
                <span className="text-[10px] font-mono">% RH</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900 tracking-tight">48.1</span>
                <span className="text-xs font-medium text-zinc-500">%</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-600 font-medium">Within target range</div>
            </div>
          </div>

          {/* Telemetry Wave Curve Graphic */}
          <div className="relative rounded-2xl bg-zinc-950 p-4 overflow-hidden border border-zinc-800">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2f6fed] animate-pulse" />
                EDGE TELEMETRY STREAM
              </span>
              <span>10-SECOND RESOLUTION</span>
            </div>

            <svg viewBox="0 0 800 120" className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isBreach ? "#ef4444" : "#2f6fed"} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={isBreach ? "#ef4444" : "#2f6fed"} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path
                d={
                  isBreach
                    ? "M 0 90 Q 200 85 400 88 T 600 20 L 800 15 L 800 120 L 0 120 Z"
                    : "M 0 90 Q 200 85 400 88 T 600 82 L 800 80 L 800 120 L 0 120 Z"
                }
                fill="url(#curveGrad)"
              />

              {/* Line */}
              <path
                d={
                  isBreach
                    ? "M 0 90 Q 200 85 400 88 T 600 20 L 800 15"
                    : "M 0 90 Q 200 85 400 88 T 600 82 L 800 80"
                }
                fill="none"
                stroke={isBreach ? "#ef4444" : "#38bdf8"}
                strokeWidth="3"
              />

              {/* Active pulsing dot */}
              <circle
                cx="800"
                cy={isBreach ? "15" : "80"}
                r="5"
                fill={isBreach ? "#ef4444" : "#38bdf8"}
                style={{ opacity: Math.sin(frame * 0.25) * 0.4 + 0.6 }}
              />
            </svg>
          </div>
        </main>
      </div>
    </div>
  );
};
