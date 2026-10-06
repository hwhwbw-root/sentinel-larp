import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Sliders, ShieldAlert } from "lucide-react";
import { AnimatedText, Scene3D, Element3D } from "remotion-bits";
import { AppleAlertNotification } from "../components/AppleAlertNotification";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";

export const AlertEngineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Right column container — Apple Keynote 3D entrance (same pattern as other scenes)
  const windowSpring = spring({ frame: frame - 5, fps, config: APPLE_SPRINGS.snappy });
  const winOpacity   = interpolate(windowSpring, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
  const winRotateY   = interpolate(windowSpring, [0, 1], [-22, -7], { extrapolateRight: "clamp" });
  const winRotateX   = interpolate(windowSpring, [0, 1], [16, 4],   { extrapolateRight: "clamp" });
  const winTranslateX = interpolate(windowSpring, [0, 1], [90, 0],  { extrapolateRight: "clamp" });
  const winTranslateY = interpolate(windowSpring, [0, 1], [40, 0],  { extrapolateRight: "clamp" });
  const winScale     = interpolate(windowSpring, [0, 1], [0.82, 1], { extrapolateRight: "clamp" });
  const winBlur      = interpolate(windowSpring, [0, 1], [12, 0],   { extrapolateRight: "clamp" });

  // Cards — staggered using smooth spring so the animation plays over ~40 frames
  const card1Spring = spring({ frame: frame - 20, fps, config: APPLE_SPRINGS.smooth });
  const card2Spring = spring({ frame: frame - 40, fps, config: APPLE_SPRINGS.smooth });

  // Badge + notification entrance spring
  const badgeSpring = spring({ frame: frame - 2, fps, config: APPLE_SPRINGS.bouncy });
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  const badgeTranslateY = interpolate(badgeSpring, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  // Notification entrance (drops in from above)
  const notifSpring = spring({ frame: frame - 0, fps, config: APPLE_SPRINGS.snappy });
  const notifOpacity = interpolate(notifSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const notifTranslateY = interpolate(notifSpring, [0, 1], [-28, 0], { extrapolateRight: "clamp" });
  const notifScale = interpolate(notifSpring, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });


  return (
    <div
      className="relative w-full h-full bg-[#fafafa] flex items-center justify-between px-20 overflow-hidden select-none"
      style={{ fontFamily: APPLE_FONT_FAMILY }}
    >
      {/* Subtle Tone */}
      <div
        className="absolute w-[1200px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 65% 50%, rgba(239, 68, 68, 0.03) 0%, rgba(250, 250, 250, 0) 70%)",
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
      <SentinelAtmosphere intensity={0.7} />

      {/* Left Column: Two-Tier Narrative */}
      <div className="relative z-10 max-w-xl flex flex-col items-start">
        {/* Genuine Alert Notification — drops in from above */}
        <div
          className="mb-4"
          style={{
            opacity: notifOpacity,
            transform: `translateY(${notifTranslateY}px) scale(${notifScale})`,
            transformOrigin: "top left",
          }}
        >
          <AppleAlertNotification
            title="DANGEROUS GAS LEVEL DETECTED"
            description="CO₂ reached 1,686 ppm in Bay 1. Safe threshold is 1,500 ppm."
            actionText="Loud Alarm Buzzer Sounding • Dashboard Alert Sent"
            severity="critical"
          />
        </div>

        {/* Badge pill — bounces in */}
        <div
          className="mb-3"
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeTranslateY}px) scale(${badgeScale})`,
            transformOrigin: "left center",
          }}
        >
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#2f6fed]/10 text-[#2f6fed] border border-[#2f6fed]/20 uppercase tracking-wider">
            Two-Level Safety Alerts
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
          Warn your team before it becomes dangerous.
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
          Set custom gas limits for your facility. Level 1 warns operators early so they can check the area. Level 2 immediately sounds a loud alarm on the box and alerts the entire team.
        </AnimatedText>
      </div>

      {/* Right Column: Two Genuine Sentinel Alert Cards Stacked in Remotion-Bits Scene3D */}
      <div
        className="relative z-10 w-[600px] h-[640px] flex items-center justify-center"
        style={{
          opacity: winOpacity,
          perspective: "1200px",
          transform: `translateX(${winTranslateX}px) translateY(${winTranslateY}px) scale(${winScale}) rotateY(${winRotateY}deg) rotateX(${winRotateX}deg)`,
          filter: `blur(${winBlur}px)`,
          transformOrigin: "center center",
        }}
      >
        <Scene3D perspective={1200} className="w-full h-full">
          {/* Level 1: Early Warning Card (Z = 0) */}
          <Element3D
            centered={true}
            y={interpolate(card1Spring, [0, 1], [-70, -115])}
            z={interpolate(card1Spring, [0, 1], [-80, 0])}
            rotateY={interpolate(card1Spring, [0, 1], [-18, -6])}
            rotateX={interpolate(card1Spring, [0, 1], [10, 2.5])}
            className="w-[560px]"
            style={{
              opacity: interpolate(card1Spring, [0, 1], [0, 1]),
            }}
          >
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-7 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.12)]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
                  Level 1 // Early Warning
                </span>
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                  <Sliders size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-zinc-900 tracking-tight">
                1,000 <span className="text-lg font-bold text-zinc-500 font-mono">ppm</span>
              </div>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Early notification when gas starts rising. Inspect the area before air reaches unsafe exposure levels.
              </p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-200 text-xs font-mono text-amber-800 font-bold">
                <span>ACTION:</span>
                <span>Yellow Warning Banner on Dashboard</span>
              </div>
            </div>
          </Element3D>

          {/* Level 2: Life Safety Hazard Danger Card (Z = 55 in foreground) */}
          <Element3D
            centered={true}
            y={interpolate(card2Spring, [0, 1], [155, 120])}
            z={interpolate(card2Spring, [0, 1], [-30, 55])}
            rotateY={interpolate(card2Spring, [0, 1], [-20, -9])}
            rotateX={interpolate(card2Spring, [0, 1], [12, 4])}
            className="w-[560px]"
            style={{
              opacity: interpolate(card2Spring, [0, 1], [0, 1]),
            }}
          >
            <div className="bg-red-50 border border-red-200 rounded-3xl p-7 shadow-[0_25px_50px_-15px_rgba(239,68,68,0.16)]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700">
                  Level 2 // Critical Danger
                </span>
                <div className="p-2.5 rounded-xl bg-red-100 text-red-700 border border-red-200">
                  <ShieldAlert size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-zinc-900 tracking-tight">
                1,500 <span className="text-lg font-bold text-zinc-500 font-mono">ppm</span>
              </div>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Dangerous gas threshold reached. The box sounds a loud buzzer alarm and the screen locks into red alert.
              </p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-red-200 text-xs font-mono text-red-700 font-bold">
                <span>ACTION:</span>
                <span>Loud Device Buzzer + Full Screen Alert</span>
              </div>
            </div>
          </Element3D>
        </Scene3D>
      </div>
    </div>
  );
};
