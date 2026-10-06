import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AlertOctagon, CheckCircle2 } from "lucide-react";
import { SENTI_FONT_FAMILY, SENTI_MONO_FAMILY, SENTI_SPRINGS } from "../theme";

export const BreachAnalysisCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: SENTI_SPRINGS.snappy });
  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Progress bar animating from 0 to 100%
  const progress = Math.min(100, Math.floor(interpolate(frame, [15, 60], [10, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      {/* Container Card */}
      <div
        className="w-[680px] bg-white rounded-3xl border border-zinc-200 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.12)] overflow-hidden"
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {/* Blue Progress Bar Header (Numtera style) */}
        <div className="bg-[#2f6fed] text-white px-6 py-3 flex items-center justify-between font-mono text-sm font-bold">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-white"
              style={{ opacity: (frame % 30) > 15 ? 1 : 0.3 }}
            />
            <span>verifying hazard...</span>
          </div>
          <span>{progress}%</span>
        </div>

        {/* Progress Fill Indicator */}
        <div className="w-full bg-[#1e54bc] h-1.5 overflow-hidden">
          <div
            className="h-full bg-sky-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Inner Content */}
        <div className="p-8 flex flex-col gap-6">
          {/* Breach Preview Mini-Card */}
          <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 text-red-600">
                <AlertOctagon size={20} />
              </div>
              <div>
                <div className="text-base font-bold text-zinc-900">
                  Bay 1 Incident — Gas Spike Detected
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Device: mocksense-0 • Limit: 1,500 ppm
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-red-600">1,686 ppm</div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                Critical
              </span>
            </div>
          </div>

          {/* Real-Time Terminal Log Stream */}
          <div
            className="space-y-2.5 text-xs text-zinc-700 font-mono bg-zinc-900 text-zinc-200 p-5 rounded-2xl border border-zinc-800"
            style={{ fontFamily: SENTI_MONO_FAMILY }}
          >
            <div className="text-zinc-500 text-[11px] mb-1">
              // Automated verification pipeline
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#38bdf8] font-bold">[0.04s]</span>
              <span>Compensating for temperature drift (24.4 °C)...</span>
              <CheckCircle2 size={13} className="text-emerald-400 ml-auto" />
            </div>
            {frame > 25 && (
              <div className="flex items-center gap-2">
                <span className="text-[#38bdf8] font-bold">[0.08s]</span>
                <span>Calculating exponential moving average...</span>
                <CheckCircle2 size={13} className="text-emerald-400 ml-auto" />
              </div>
            )}
            {frame > 40 && (
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <span className="text-[#38bdf8] font-bold">[0.12s]</span>
                <span>CRITICAL: 1,686 ppm exceeds 1,500 ppm threshold!</span>
                <span className="text-xs bg-red-900/60 text-red-300 px-1.5 rounded ml-auto">ALERT</span>
              </div>
            )}
            {frame > 55 && (
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="text-[#38bdf8] font-bold">[0.16s]</span>
                <span>Automated dispatch triggered to dashboard & buzzer.</span>
                <CheckCircle2 size={13} className="text-emerald-400 ml-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
