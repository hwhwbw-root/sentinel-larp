import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SENTI_FONT_FAMILY, SENTI_MONO_FAMILY, SENTI_SPRINGS } from "../theme";
import { KineticWords } from "./KineticWords";

export const CinematicOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo phase: frames 0 to 140
  // Outro CTA phase: frames 140 to 300
  const isCtaPhase = frame > 130;

  const logoSpring = spring({ frame: frame - 10, fps, config: SENTI_SPRINGS.snappy });

  if (!isCtaPhase) {
    // Phase 1: Luminous Hero Logo & Wordmark — icon pops, wordmark word-beats
    const scale = interpolate(logoSpring, [0, 1], [0.84, 1]);
    const opacity = interpolate(logoSpring, [0, 1], [0, 1]);
    const blur = interpolate(logoSpring, [0, 1], [20, 0]);

    return (
      <div
        className="relative w-full h-full flex items-center justify-center select-none"
        style={{
          fontFamily: SENTI_FONT_FAMILY,
          background:
            "radial-gradient(circle at 50% 55%, #ffffff 0%, #bfdbfe 28%, #60a5fa 58%, #1d4ed8 100%)",
        }}
      >
        {/* White core bloom */}
        <div
          className="absolute w-[1400px] h-[900px] rounded-full pointer-events-none"
          style={{
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(191,219,254,0.3) 40%, rgba(37,99,235,0) 68%)",
            filter: "blur(80px)",
          }}
        />

        {/* Icon + Wordmark */}
        <div className="relative z-10 flex items-center gap-7">
          {/* Hero Squircle Tile */}
          <div
            className="relative w-28 h-28 rounded-[32px] bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] p-1.5 shadow-[0_30px_80px_-10px_rgba(37,99,235,0.75)] border border-white/50 flex items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              opacity,
              filter: `blur(${blur}px)`,
            }}
          >
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

          {/* "Sentinel" wordmark — word-beat style */}
          <span
            className="text-8xl md:text-9xl font-black tracking-tighter text-[#2563eb] drop-shadow-sm"
            style={{ overflow: "hidden", display: "inline-block" }}
          >
            <KineticWords
              text="Sentinel"
              startFrame={18}
              stagger={0}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={42}
              blurStart={18}
            />
          </span>
        </div>
      </div>
    );
  }

  // Phase 2: Deep Navy Minimalist CTA
  const ctaLocalFrame = frame - 145;

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center select-none bg-[#030d22]"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      {/* Strong vignette depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        {/* "Deploy Autonomous Safety Today." — four impact word-beats */}
        <h2
          className="text-6xl md:text-7xl font-black text-white tracking-tight leading-tight"
          style={{ overflow: "hidden" }}
        >
          <KineticWords
            text="Deploy Autonomous Safety Today."
            startFrame={ctaLocalFrame}
            stagger={7}
            springConfig={SENTI_SPRINGS.snappy}
            yOffset={38}
            blurStart={14}
            // "Autonomous" blue accent (index 1)
            accents={{ 1: "#60a5fa" }}
          />
        </h2>

        {/* Sub-line */}
        <p
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl font-medium"
          style={{
            opacity: interpolate(
              spring({ frame: ctaLocalFrame - 28, fps, config: SENTI_SPRINGS.smooth }),
              [0, 1],
              [0, 1]
            ),
            transform: `translateY(${interpolate(
              spring({ frame: ctaLocalFrame - 28, fps, config: SENTI_SPRINGS.smooth }),
              [0, 1],
              [16, 0]
            )}px)`,
          }}
        >
          Zero hardware modifications. Enterprise IoT ready.
        </p>

        {/* CTA button */}
        <div
          className="mt-2 px-8 py-3.5 rounded-2xl bg-[#2f6fed] text-white font-bold text-lg shadow-[0_15px_40px_rgba(47,111,237,0.5)]"
          style={{
            opacity: interpolate(
              spring({ frame: ctaLocalFrame - 40, fps, config: SENTI_SPRINGS.smooth }),
              [0, 1],
              [0, 1]
            ),
            transform: `translateY(${interpolate(
              spring({ frame: ctaLocalFrame - 40, fps, config: SENTI_SPRINGS.smooth }),
              [0, 1],
              [14, 0]
            )}px)`,
          }}
        >
          Launch Sentinel Safety Console
        </div>

        {/* Monospace footnote */}
        <div
          className="text-sm font-mono text-zinc-500"
          style={{
            fontFamily: SENTI_MONO_FAMILY,
            opacity: interpolate(
              spring({ frame: ctaLocalFrame - 52, fps, config: SENTI_SPRINGS.smooth }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          sentinel.internal · High-Stakes Facility Protection
        </div>
      </div>
    </div>
  );
};
