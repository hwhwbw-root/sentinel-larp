import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";
import { KineticWords } from "./KineticWords";

export const MeetSentinelLockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // App icon enters first — scale+blur spring from 0
  const iconSpring = spring({ frame: frame - 4, fps, config: SENTI_SPRINGS.snappy });
  const iconScale = interpolate(iconSpring, [0, 1], [0.78, 1]);
  const iconOpacity = interpolate(iconSpring, [0, 1], [0, 1]);
  const iconBlur = interpolate(iconSpring, [0, 1], [20, 0]);

  return (
    <div
      className="flex flex-col items-center justify-center select-none"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      {/* ─── "Meet [Icon] Sentinel" lockup ─── */}
      <div className="flex items-center gap-5">
        {/* "Meet" — single word, hits slightly before icon */}
        <span
          className="text-7xl md:text-8xl font-medium tracking-tight text-zinc-800"
          style={{ overflow: "hidden", display: "inline-block" }}
        >
          <KineticWords
            text="Meet"
            startFrame={2}
            stagger={0}
            springConfig={SENTI_SPRINGS.snappy}
            yOffset={32}
            blurStart={12}
          />
        </span>

        {/* App Icon Tile — pops in with scale+blur */}
        <div
          className="relative w-24 h-24 rounded-[28px] bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] p-1 shadow-[0_20px_60px_-10px_rgba(37,99,235,0.65)] border border-white/40 flex items-center justify-center"
          style={{
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
            filter: `blur(${iconBlur}px)`,
          }}
        >
          <div className="absolute inset-0 rounded-[27px] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
          <svg viewBox="0 0 80 80" className="w-16 h-16 relative z-10 drop-shadow-sm">
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

        {/* "Sentinel" — enters word-beat style after icon */}
        <span
          className="text-7xl md:text-8xl font-black tracking-tighter text-[#2563eb]"
          style={{ overflow: "hidden", display: "inline-block" }}
        >
          <KineticWords
            text="Sentinel"
            startFrame={14}
            stagger={0}
            springConfig={SENTI_SPRINGS.snappy}
            yOffset={36}
            blurStart={14}
          />
        </span>
      </div>

      {/* ─── Tagline — word-by-word with blue accent ─── */}
      <div
        className="mt-9 text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight"
        style={{ overflow: "hidden" }}
      >
        {/* "The" */}
        <KineticWords
          text="The"
          startFrame={28}
          stagger={0}
          springConfig={SENTI_SPRINGS.smooth}
          yOffset={22}
          blurStart={8}
        />
        {" "}
        {/* "Autonomous" — accent blue, hits with extra punch */}
        <KineticWords
          text="Autonomous"
          startFrame={34}
          stagger={0}
          springConfig={SENTI_SPRINGS.snappy}
          yOffset={28}
          blurStart={12}
          accents={{ 0: "#2563eb" }}
        />
        {" "}
        {/* "Environmental Safety OS" */}
        <KineticWords
          text="Environmental Safety OS"
          startFrame={42}
          stagger={4}
          springConfig={SENTI_SPRINGS.smooth}
          yOffset={20}
          blurStart={8}
        />
      </div>
    </div>
  );
};
