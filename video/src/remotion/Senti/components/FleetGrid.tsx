import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { HardDrive, Wifi, Shield } from "lucide-react";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const FleetGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: SENTI_SPRINGS.smooth });
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  const devices = [
    {
      id: "mocksense-0",
      alias: "Bay 1 — Mixing Facility",
      gas: 524,
      temp: "24.4 °C",
      humidity: "48.1 %",
      status: "Synchronized",
      ping: "10s",
    },
    {
      id: "mocksense-1",
      alias: "Bay 2 — Battery Storage",
      gas: 418,
      temp: "22.8 °C",
      humidity: "44.5 %",
      status: "Synchronized",
      ping: "10s",
    },
    {
      id: "mocksense-2",
      alias: "Bay 3 — Chemical Packing",
      gas: 465,
      temp: "23.1 °C",
      humidity: "46.0 %",
      status: "Synchronized",
      ping: "10s",
    },
  ];

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{
        fontFamily: SENTI_FONT_FAMILY,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div className="grid grid-cols-3 gap-6 w-[1140px]">
        {devices.map((d, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 10,
            fps,
            config: SENTI_SPRINGS.snappy,
          });

          return (
            <div
              key={d.id}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-zinc-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] flex flex-col justify-between h-72"
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`,
                opacity: interpolate(cardSpring, [0, 1], [0, 1]),
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#2f6fed]/10 text-[#2f6fed] border border-[#2f6fed]/20">
                    <HardDrive size={13} />
                    {d.id}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      style={{ opacity: Math.sin(frame * 0.25) * 0.4 + 0.6 }}
                    />
                    {d.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                  {d.alias}
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  TLS Edge Socket • {d.ping} Poll
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100 text-center font-mono">
                <div>
                  <div className="text-[10px] text-zinc-400">CO₂</div>
                  <div className="text-base font-black text-zinc-800">{d.gas}</div>
                  <div className="text-[9px] text-zinc-400">ppm</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">TEMP</div>
                  <div className="text-base font-black text-zinc-800">{d.temp}</div>
                  <div className="text-[9px] text-zinc-400">nominal</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">HUMID</div>
                  <div className="text-base font-black text-zinc-800">{d.humidity}</div>
                  <div className="text-[9px] text-zinc-400">target</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Wifi size={12} className="text-emerald-500" />
                  Signal 99.4%
                </span>
                <span className="flex items-center gap-1 text-[#2f6fed] font-bold">
                  <Shield size={12} />
                  Provisioned
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
