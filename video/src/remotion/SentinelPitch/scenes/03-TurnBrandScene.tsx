import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Scene3D, Element3D } from "remotion-bits";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";
import { StrikingSentinelLogo } from "../components/StrikingSentinelLogo";

export const TurnBrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy synchronized Apple entrance springs
  const logoSpring = spring({
    frame: frame - 1,
    fps,
    config: APPLE_SPRINGS.snappy,
  });

  const textSpring = spring({
    frame: frame - 3,
    fps,
    config: APPLE_SPRINGS.snappy,
  });

  // Remotion Bits 3D dynamic rotational coordinates for the logo
  const rotateY =
    interpolate(logoSpring, [0, 1], [-26, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) +
    Math.sin(frame * 0.04) * 2.2;
  const rotateX =
    interpolate(logoSpring, [0, 1], [14, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) +
    Math.cos(frame * 0.04) * 1.6;
  const z = interpolate(logoSpring, [0, 1], [-130, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Apple commercial kinetic text motion properties (moving in alongside logo)
  const textTranslateY = interpolate(textSpring, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textScale = interpolate(textSpring, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rawBlur = interpolate(textSpring, [0, 1], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textBlur = Math.max(0, rawBlur);

  // Clean 5-second scene fadeout to Danger Spike (frames 132 to 150)
  const sceneFadeOut = interpolate(frame, [132, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative w-full h-full bg-[#fafafa] overflow-hidden select-none"
      style={{
        fontFamily: APPLE_FONT_FAMILY,
        opacity: sceneFadeOut,
      }}
    >
      {/* Subtle Studio Lighting Tone */}
      <div
        className="absolute w-[1300px] h-[850px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 45% 50%, rgba(47, 111, 237, 0.05) 0%, rgba(250, 250, 250, 0) 70%)",
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Atmospheric Micro-Particles */}
      <SentinelAtmosphere intensity={0.6} />

      {/* Hero 2-Column Lockup: Logo on Left, Prominent Apple-style Text on Right */}
      <div className="relative z-10 w-full h-full flex items-center px-24 max-w-7xl mx-auto">
        {/* Left Column: 3D Shield Brandmark */}
        <div className="w-5/12 h-full relative flex items-center justify-center">
          <Scene3D perspective={1200} className="w-full h-full">
            <Element3D
              centered={true}
              rotateY={rotateY}
              rotateX={rotateX}
              z={z}
              className="w-[280px] flex flex-col items-center justify-center"
              style={{
                opacity: logoOpacity,
              }}
            >
              <StrikingSentinelLogo
                idPrefix="turnbrand"
                size={230}
                sheenStartFrame={14}
                sheenDuration={24}
                showText={false}
                reticleElevation={28}
              />
            </Element3D>
          </Scene3D>
        </div>

        {/* Right Column: Prominent Apple-Commercial Typographic Reveal */}
        <div
          className="w-7/12 h-full flex flex-col justify-center items-start pl-12"
          style={{
            transform: `translateY(${textTranslateY}px) scale(${textScale})`,
            opacity: textOpacity,
            filter: textBlur > 0.15 ? `blur(${textBlur.toFixed(2)}px)` : undefined,
            willChange: "transform, opacity",
          }}
        >
          {/* "Introducing" in elegant light zinc */}
          <div className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-400 mb-1">
            Introducing
          </div>

          {/* Monumental "Sentinel." Headline */}
          <div className="text-7xl md:text-8xl font-black tracking-tighter text-zinc-950 leading-[0.95]">
            Sentinel<span className="text-[#2f6fed]">.</span>
          </div>

          {/* Minimalist Punchline */}
          <div className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-800 mt-6 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2f6fed]" />
            <span>Instant CO₂ &amp; H₂ Gas Detection</span>
          </div>

          {/* Sub-Strap */}
          <div className="text-sm md:text-base font-mono font-medium text-zinc-500 mt-3 tracking-wide">
            Wall-Mounted Sensor Boxes + Live Web Dashboard
          </div>
        </div>
      </div>
    </div>
  );
};
