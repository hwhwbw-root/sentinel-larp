import React from "react";
import { Particles, Spawner, Behavior } from "remotion-bits";

interface SentinelAtmosphereProps {
  hazard?: boolean;
  intensity?: number;
  className?: string;
}

export const SentinelAtmosphere: React.FC<SentinelAtmosphereProps> = ({
  hazard = false,
  intensity = 1,
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      <Particles startFrame={60}>
        <Spawner
          rate={0.35 * intensity}
          max={40}
          area={{ width: 1920, height: 1080 }}
          position={{ x: 960, y: 540 }}
          lifespan={140}
          velocity={{ x: 0.05, y: -0.12, varianceX: 0.35, varianceY: 0.35 }}
        >
          <div
            className={`rounded-full ${
              hazard
                ? "w-2 h-2 bg-red-500/25 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                : "w-1.5 h-1.5 bg-[#2f6fed]/20 shadow-[0_0_6px_rgba(47,111,237,0.3)]"
            }`}
          />
          <div
            className={`rounded-full ${
              hazard
                ? "w-1.5 h-1.5 bg-amber-500/30"
                : "w-1 h-1 bg-zinc-400/25"
            }`}
          />
        </Spawner>

        <Behavior
          wiggle={{ magnitude: 1.2, frequency: 0.08 }}
          wiggleVariance={0.5}
          opacity={[0, 0.5, 0]}
        />
      </Particles>
    </div>
  );
};
