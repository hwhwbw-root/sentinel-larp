import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AlertTriangle, Activity, BellRing, Cpu } from "lucide-react";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const ChaosCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating gentle motions
  const f1 = Math.sin(frame * 0.05) * 8;
  const f2 = Math.cos(frame * 0.04) * 10;
  const f3 = Math.sin(frame * 0.045 + 1) * 7;
  const f4 = Math.cos(frame * 0.05 + 2) * 9;

  const cardSpring1 = spring({ frame: frame - 10, fps, config: SENTI_SPRINGS.smooth });
  const cardSpring2 = spring({ frame: frame - 20, fps, config: SENTI_SPRINGS.smooth });
  const cardSpring3 = spring({ frame: frame - 30, fps, config: SENTI_SPRINGS.smooth });
  const cardSpring4 = spring({ frame: frame - 40, fps, config: SENTI_SPRINGS.smooth });

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      {/* Top Left Card: Gas Alarm Ticket */}
      <div
        className="absolute top-20 left-32 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-zinc-200/80 shadow-[0_20px_45px_rgba(0,0,0,0.06)] w-80 flex flex-col gap-2.5"
        style={{
          transform: `translateY(${f1}px) scale(${interpolate(cardSpring1, [0, 1], [0.85, 1])})`,
          opacity: interpolate(cardSpring1, [0, 1], [0, 1]),
        }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
            <AlertTriangle size={13} />
            CO₂ Breach
          </span>
          <span className="text-[11px] font-mono text-zinc-400">1,686 ppm</span>
        </div>
        <div className="text-sm font-bold text-zinc-800">
          Mixing Bay 1 Threshold Tripped
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
          <div className="w-5 h-5 rounded-full bg-[#2f6fed] text-white text-[10px] font-bold flex items-center justify-center">
            B1
          </div>
          <span className="text-xs text-zinc-500">Facility Station • Unresolved</span>
        </div>
      </div>

      {/* Top Right Card: Raw Device Telemetry */}
      <div
        className="absolute top-24 right-36 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-zinc-200/80 shadow-[0_20px_45px_rgba(0,0,0,0.06)] w-84 flex flex-col gap-2"
        style={{
          transform: `translateY(${f2}px) scale(${interpolate(cardSpring2, [0, 1], [0.85, 1])})`,
          opacity: interpolate(cardSpring2, [0, 1], [0, 1]),
        }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2f6fed] bg-[#2f6fed]/10 px-2.5 py-1 rounded-full border border-[#2f6fed]/20">
            <Cpu size={13} />
            mocksense-0
          </span>
          <span className="text-[11px] font-mono text-zinc-400">4s polling</span>
        </div>
        <div className="text-xs text-zinc-600 font-mono space-y-1 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
          <div className="flex justify-between">
            <span>Temp: 24.4 °C</span>
            <span className="text-emerald-600 font-bold">NORMAL</span>
          </div>
          <div className="flex justify-between">
            <span>Humidity: 48.1 %</span>
            <span className="text-emerald-600 font-bold">NORMAL</span>
          </div>
        </div>
      </div>

      {/* Bottom Left Card: Uncoordinated Notification */}
      <div
        className="absolute bottom-28 left-40 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-zinc-200/80 shadow-[0_20px_45px_rgba(0,0,0,0.06)] w-76 flex flex-col gap-2"
        style={{
          transform: `translateY(${f3}px) scale(${interpolate(cardSpring3, [0, 1], [0.85, 1])})`,
          opacity: interpolate(cardSpring3, [0, 1], [0, 1]),
        }}
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <BellRing size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-800">Delayed Alert</div>
            <div className="text-[11px] text-zinc-400">Manual inspection required</div>
          </div>
        </div>
      </div>

      {/* Bottom Right Card: System Status Window */}
      <div
        className="absolute bottom-24 right-44 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-zinc-200/80 shadow-[0_20px_45px_rgba(0,0,0,0.06)] w-80 flex flex-col gap-2"
        style={{
          transform: `translateY(${f4}px) scale(${interpolate(cardSpring4, [0, 1], [0.85, 1])})`,
          opacity: interpolate(cardSpring4, [0, 1], [0, 1]),
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
            <Activity size={14} className="text-[#2f6fed]" />
            Fleet Telemetry
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500">
            2 Nodes
          </span>
        </div>
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
          <div className="bg-[#2f6fed] h-full w-2/3 rounded-full" />
        </div>
      </div>
    </div>
  );
};
