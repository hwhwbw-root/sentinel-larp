import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SentiAtmosphere } from "../components/SentiAtmosphere";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";
import { KineticWords } from "../components/KineticWords";

export const MeetSentinelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 1: Frames 0 - 85 -> "Meet [App Icon] Sentinel" (matching Numtera 12s)
  // Beat 2: Frames 85 - 180 -> "The Autonomous Environmental Safety OS" (matching Numtera 15s)
  const isPart2 = frame >= 85;
  const localFrame2 = frame - 85;

  // Beat 1 springs
  const enterSpring = spring({ frame: frame - 4, fps, config: SENTI_SPRINGS.snappy });
  const b1Scale = interpolate(enterSpring, [0, 1], [0.86, 1]);
  const b1Opacity = interpolate(
    frame,
    [0, 15, 75, 85],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const b1Blur = interpolate(enterSpring, [0, 1], [16, 0]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      {/* Luminous Azure Sky Radial Bloom (The iconic 13s aesthetic) */}
      <SentiAtmosphere variant="luminous" intensity={1.0} />

      {!isPart2 ? (
        /* Beat 1: "Meet [App Icon] Sentinel" */
        <div
          className="relative z-10 flex items-center gap-6"
          style={{
            transform: `scale(${b1Scale})`,
            opacity: b1Opacity,
            filter: `blur(${b1Blur}px)`,
          }}
        >
          <span className="text-8xl md:text-9xl font-semibold tracking-tight text-zinc-900">
            Meet
          </span>

          {/* App Icon Tile */}
          <div className="relative w-28 h-28 rounded-[32px] bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] p-1.5 shadow-[0_25px_60px_-10px_rgba(37,99,235,0.65)] border border-white/40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
            <svg viewBox="0 0 80 80" className="w-18 h-18 relative z-10 drop-shadow-sm">
              <path
                d="M40 6 L68 17 V36 C68 54 55 66 40 71 C25 66 12 54 12 36 V17 Z"
                fill="#ffffff"
                stroke="#2f6fed"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="34" r="8" fill="none" stroke="#2f6fed" strokeWidth="3" />
              <circle cx="40" cy="34" r="2.8" fill="#2f6fed" />
              <path d="M40 44 V52" stroke="#2f6fed" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <span className="text-8xl md:text-9xl font-black tracking-tighter text-[#1d4ed8]">
            Sentinel
          </span>
        </div>
      ) : (
        /* Beat 2: "The Autonomous Environmental Safety OS" (matching Numtera 15s) */
        <div
          className="relative z-10 text-center max-w-6xl px-12"
          style={{ overflow: "hidden" }}
        >
          <h2
            className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-tight"
            style={{ overflow: "hidden" }}
          >
            <KineticWords
              text="The"
              startFrame={localFrame2}
              stagger={0}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={32}
              blurStart={12}
            />
            {" "}
            <KineticWords
              text="Autonomous"
              startFrame={localFrame2 + 4}
              stagger={0}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={36}
              blurStart={14}
              accents={{ 0: "#0052ff" }}
              wordClassName="font-extrabold text-[#0052ff]"
            />
            {" "}
            <KineticWords
              text="Environmental Safety OS"
              startFrame={localFrame2 + 10}
              stagger={4}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={32}
              blurStart={10}
            />
          </h2>
        </div>
      )}
    </div>
  );
};
