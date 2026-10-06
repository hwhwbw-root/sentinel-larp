import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SentiAtmosphere } from "../components/SentiAtmosphere";
import { SaaSWindow } from "../components/SaaSWindow";
import { InfrastructureConnector } from "../components/InfrastructureConnector";
import { KineticWords } from "../components/KineticWords";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const InfrastructureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Frames 0 - 190 -> 3D SaaS Window live telemetry
  // Part 2: Frames 190 - 420 -> Infrastructure connection split view
  const isPart2 = frame >= 190;
  const localFrame1 = frame;

  // Header spring for Part 1 (top-right floating title like Numtera's "For Complex Operations")
  const headerSpring = spring({ frame: localFrame1 - 10, fps, config: SENTI_SPRINGS.snappy });
  const hOpacity = interpolate(headerSpring, [0, 1], [0, 1]);
  const hY = interpolate(headerSpring, [0, 1], [20, 0]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      {!isPart2 ? (
        <>
          <SentiAtmosphere variant="luminous" intensity={0.95} />

          {/* Floating Top-Right Title (Matching Numtera f_18s "For Complex Operations") */}
          <div
            className="absolute top-16 right-24 z-20 text-right"
            style={{
              opacity: hOpacity,
              transform: `translateY(${hY}px)`,
            }}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1d4ed8]">
              <KineticWords
                text="For High-Stakes"
                startFrame={10}
                stagger={5}
                springConfig={SENTI_SPRINGS.snappy}
                yOffset={24}
                blurStart={10}
              />
              <br />
              <KineticWords
                text="Operations"
                startFrame={22}
                stagger={0}
                springConfig={SENTI_SPRINGS.snappy}
                yOffset={24}
                blurStart={10}
              />
            </h2>
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <SaaSWindow mode="normal" highlightCard={false} />
          </div>
        </>
      ) : (
        /* Part 2: Clean Split Background (Left: Light Canvas, Right: Deep Navy) */
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Left half: clean light canvas */}
          <div
            className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 65% 50%, #ffffff 0%, #f1f5f9 65%, #e2e8f0 100%)",
            }}
          />
          {/* Right half: deep navy */}
          <div
            className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 35% 50%, #0a214d 0%, #030d22 70%, #010614 100%)",
            }}
          />
          {/* Center radiant bloom behind the connector diamond */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(56, 189, 248, 0.18) 35%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <InfrastructureConnector />
          </div>
        </div>
      )}
    </div>
  );
};
