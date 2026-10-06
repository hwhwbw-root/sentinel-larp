import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AnimatedText, StaggeredMotion } from "remotion-bits";
import { GenuineAppWindow } from "../components/GenuineAppWindow";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export const ComplianceAuditScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Apple Keynote 3D entrance for GenuineAppWindow
  const windowSpring = spring({
    frame: frame - 4,
    fps,
    config: APPLE_SPRINGS.snappy,
  });

  const windowScale = interpolate(windowSpring, [0, 1], [0.82, 0.88], { extrapolateRight: "clamp" });
  const windowOpacity = interpolate(windowSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const windowTranslateX = interpolate(windowSpring, [0, 1], [90, 0], { extrapolateRight: "clamp" });
  const windowTranslateY = interpolate(windowSpring, [0, 1], [40, 0], { extrapolateRight: "clamp" });
  const windowRotateY = interpolate(windowSpring, [0, 1], [-22, -7], { extrapolateRight: "clamp" });
  const windowRotateX = interpolate(windowSpring, [0, 1], [16, 4], { extrapolateRight: "clamp" });
  const windowBlur = interpolate(windowSpring, [0, 1], [12, 0], { extrapolateRight: "clamp" });

  // Badge entrance animation
  const badgeSpring = spring({
    frame: frame - 2,
    fps,
    config: APPLE_SPRINGS.bouncy,
  });
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  const badgeTranslateY = interpolate(badgeSpring, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  return (
    <div
      className="relative w-full h-full bg-[#fafafa] flex items-center justify-between px-20 overflow-hidden select-none"
      style={{
        fontFamily: APPLE_FONT_FAMILY,
      }}
    >
      {/* Subtle Tone */}
      <div
        className="absolute w-[1200px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 65% 50%, rgba(47, 111, 237, 0.04) 0%, rgba(250, 250, 250, 0) 70%)",
        }}
      />

      {/* Grid Pattern matching App */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Atmospheric Micro-Particles */}
      <SentinelAtmosphere intensity={0.75} />

      {/* Left Column: Asymmetrical Editorial Copy */}
      <div className="relative z-10 max-w-xl flex flex-col items-start pr-6">
        <div
          className="flex items-center gap-2 mb-4"
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeTranslateY}px) scale(${badgeScale})`,
            transformOrigin: "left center",
          }}
        >
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#2f6fed]/10 text-[#2f6fed] border border-[#2f6fed]/20 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={13} />
            <span>Safety Records &amp; Export</span>
          </span>
        </div>

        <AnimatedText
          className="text-5xl font-black text-zinc-900 tracking-tight leading-[1.1] text-left max-w-xl"
          transition={{
            y: [30, 0],
            blur: [8, 0],
            opacity: [0, 1],
            split: "word",
            splitStagger: 2,
            delay: 10,
            duration: 25,
            easing: "easeOutCubic",
          }}
          style={{ whiteSpace: "normal" }}
        >
          Every gas reading saved. Export reports in one click.
        </AnimatedText>

        <AnimatedText
          className="text-lg text-zinc-500 font-normal mt-5 leading-relaxed text-left max-w-lg"
          transition={{
            y: [20, 0],
            opacity: [0, 1],
            split: "word",
            splitStagger: 1,
            delay: 25,
            duration: 30,
            easing: "easeOutCubic",
          }}
          style={{ whiteSpace: "normal" }}
        >
          Never worry about missing safety records. Sentinel automatically saves every reading 24/7 so you can search past history and download clean CSV reports for safety inspectors.
        </AnimatedText>

        {/* Telemetry Specs Strip using StaggeredMotion */}
        <StaggeredMotion
          className="mt-8 pt-6 border-t border-zinc-200/80 flex items-center gap-6"
          transition={{
            opacity: [0, 1],
            y: [15, 0],
            delay: 40,
            duration: 25,
            stagger: 5,
            easing: "easeOutCubic",
          }}
        >
          <div>
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase block">
              EXPORT REPORTS
            </span>
            <span className="text-xl font-black font-mono text-emerald-600 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 size={18} />
              <span>One-Click CSV Download</span>
            </span>
          </div>

          <div className="h-10 w-[1px] bg-zinc-200" />

          <div>
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase block">
              RECORD KEEPING
            </span>
            <span className="text-sm font-mono font-bold text-zinc-800 mt-1 flex items-center gap-1">
              <Lock size={14} className="text-[#2f6fed]" />
              <span>Automatic 24/7 History</span>
            </span>
          </div>
        </StaggeredMotion>
      </div>

      {/* Right Column: Hero Genuine App Window with Apple Keynote 3D Entrance */}
      <div
        className="relative z-10 flex-1 flex justify-end"
        style={{
          opacity: windowOpacity,
          transform: `translateX(${windowTranslateX}px) translateY(${windowTranslateY}px) scale(${windowScale}) perspective(1400px) rotateY(${windowRotateY}deg) rotateX(${windowRotateX}deg)`,
          transformOrigin: "center right",
          transformStyle: "preserve-3d",
          filter: windowBlur > 0.1 ? `blur(${windowBlur}px)` : undefined,
        }}
      >
        <GenuineAppWindow page="analytics" />
      </div>
    </div>
  );
};
