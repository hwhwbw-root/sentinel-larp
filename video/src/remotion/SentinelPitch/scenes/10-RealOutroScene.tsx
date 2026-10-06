import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Scene3D, Element3D } from "remotion-bits";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";
import { StrikingSentinelLogo } from "../components/StrikingSentinelLogo";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";

export const RealOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy Apple spring entrance for the hero logo and brandmark
  const logoSpring = spring({
    frame: frame - 6,
    fps,
    config: APPLE_SPRINGS.snappy,
  });

  // Dynamic 3D floating coordinates
  const rotateY = interpolate(logoSpring, [0, 1], [-20, 0]) + Math.sin(frame * 0.04) * 2;
  const rotateX = interpolate(logoSpring, [0, 1], [10, 0]) + Math.cos(frame * 0.04) * 1.5;
  const z = interpolate(logoSpring, [0, 1], [-100, 0]);

  // Final fade to black
  const fadeOut = interpolate(frame, [95, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative w-full h-full bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        fontFamily: APPLE_FONT_FAMILY,
        opacity: fadeOut,
      }}
    >
      {/* Subtle Studio Lighting Tone */}
      <div
        className="absolute w-[1200px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(47, 111, 237, 0.05) 0%, rgba(250, 250, 250, 0) 70%)",
        }}
      />

      {/* Grid Floor Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Atmospheric Micro-Particles using Remotion Bits */}
      <SentinelAtmosphere intensity={0.7} />

      {/* Centered Brand Shield & Animated Typography inside Remotion Bits Scene3D */}
      <div className="relative z-10 w-[600px] h-[600px] flex items-center justify-center">
        <Scene3D perspective={1200} className="w-full h-full">
          <Element3D
            centered={true}
            rotateY={rotateY}
            rotateX={rotateX}
            z={z}
            className="w-[400px] flex flex-col items-center"
            style={{
              opacity: interpolate(logoSpring, [0, 1], [0, 1]),
            }}
          >
            <StrikingSentinelLogo
              idPrefix="realoutro"
              size={210}
              sheenStartFrame={14}
              sheenDuration={28}
              showText={true}
              textClassName="text-6xl md:text-7xl font-black tracking-tight text-zinc-900 text-center uppercase leading-none mt-8"
              enableOrbit={true}
              reticleElevation={30}
            />
          </Element3D>
        </Scene3D>
      </div>
    </div>
  );
};
