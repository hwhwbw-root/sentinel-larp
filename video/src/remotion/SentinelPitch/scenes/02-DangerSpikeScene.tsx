import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { AnimatedText, AnimatedCounter } from "remotion-bits";
import { GenuineAppWindow } from "../components/GenuineAppWindow";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";
import { AlertOctagon, Zap } from "lucide-react";

export const DangerSpikeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CO2 ppm climbing with silky-smooth cubic curve from 418 to 1686
  // Starts at frame 35, smoothly surges through 1000 warning, crosses 1500 critical threshold at ~frame 160, peaks at 1686 by frame 190
  const gasPpm = Math.round(
    interpolate(frame, [35, 190], [418, 1686], {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const isCritical = gasPpm >= 1500;

  // Keynote entrance for the App Window
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

  // Badge entrance animation ("Monitoring Bay 1")
  const badgeSpring = spring({
    frame: frame - 2,
    fps,
    config: APPLE_SPRINGS.bouncy,
  });
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  const badgeTranslateY = interpolate(badgeSpring, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  // Metric strip entrance animation
  const metricSpring = spring({
    frame: frame - 20,
    fps,
    config: APPLE_SPRINGS.smooth,
  });
  const metricOpacity = interpolate(metricSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const metricTranslateY = interpolate(metricSpring, [0, 1], [24, 0], { extrapolateRight: "clamp" });

  // Pure frame-based backlight color interpolation (no CSS transition)
  const redFlareOpacity = interpolate(gasPpm, [1000, 1500], [0, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative w-full h-full bg-[#fafafa] flex items-center justify-between px-20 overflow-hidden select-none"
      style={{
        fontFamily: APPLE_FONT_FAMILY,
      }}
    >
      {/* Studio Ambient Backlight (subtle red flare when critical) */}
      <div
        className="absolute w-[1400px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 70% 50%, rgba(239, 68, 68, ${redFlareOpacity * 0.4}) 0%, rgba(250, 250, 250, 0) 70%)`,
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

      {/* Atmospheric Micro-Particles (shifts to toxic hazard on spike) */}
      <SentinelAtmosphere hazard={isCritical} intensity={isCritical ? 1.6 : 0.8} />

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
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isCritical
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-[#2f6fed]/10 text-[#2f6fed] border border-[#2f6fed]/20"
            }`}
          >
            <AlertOctagon size={13} />
            <span>{isCritical ? "DANGEROUS CO₂ LEAK // BAY 01" : "LIVE SENSOR // BAY 01"}</span>
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
          A sudden gas leak. Detected in seconds.
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
          If CO₂ or H₂ gas rises to dangerous levels, the wall sensor immediately sounds a loud alarm buzzer and flashes an emergency alert across your dashboard.
        </AnimatedText>

        {/* Small Metric Strip */}
        <div
          className="mt-8 pt-6 border-t border-zinc-200/60 flex items-center gap-6"
          style={{
            opacity: metricOpacity,
            transform: `translateY(${metricTranslateY}px)`,
          }}
        >
          <div>
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase block">
              LIVE CO₂ LEVEL
            </span>
            <div className="text-xl font-black font-mono text-zinc-900 mt-0.5 flex items-center gap-1.5">
              <AnimatedCounter
                transition={{
                  values: [418, 1686],
                  delay: 35,
                  duration: 155,
                  easing: "easeInOutCubic",
                }}
                className={`font-black font-mono ${isCritical ? "text-red-600" : "text-zinc-900"}`}
                postfix={<span className="text-xs font-mono font-normal text-zinc-500 ml-1">PPM</span>}
              />
            </div>
          </div>

          <div className="h-10 w-[1px] bg-zinc-200/60" />

          <div>
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase block">
              DEVICE ALARM
            </span>
            <span className="text-lg font-black font-mono text-zinc-900 mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
              <Zap size={16} className={isCritical ? "text-red-500 animate-pulse shrink-0" : "text-amber-500 shrink-0"} />
              <span className={isCritical ? "text-red-600 font-bold" : ""}>{isCritical ? "Loud Buzzer Sounding" : "Silent Monitoring"}</span>
            </span>
          </div>

          <div className="h-10 w-[1px] bg-zinc-200/60" />

          <div>
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase block">
              ROOM STATUS
            </span>
            <span className={`text-sm font-mono font-bold mt-1 block ${isCritical ? "text-red-600 animate-pulse" : "text-emerald-600"}`}>
              {isCritical ? "DANGER // EVACUATE" : "SAFE"}
            </span>
          </div>
        </div>
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
        <GenuineAppWindow
          page={isCritical ? "danger" : "dashboard"}
          gasValue={gasPpm}
          chartProgress={interpolate(frame, [0, 375], [30, 95], { extrapolateRight: "clamp" })}
        />
      </div>
    </div>
  );
};
