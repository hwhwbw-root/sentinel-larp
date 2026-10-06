import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ParticleFieldProps {
  color?: string;
  count?: number;
  speed?: number;
  dangerLevel?: number; // 0 (calm blue/cyan) to 1 (intense red alert)
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 45,
  speed = 1,
  dangerLevel = 0,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Deterministic pseudo-random values
      const seed1 = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const seed2 = Math.cos(i * 269.5 + 183.3) * 23421.6312;
      const seed3 = Math.sin(i * 419.2 + 371.9) * 19283.4721;

      const x = (seed1 - Math.floor(seed1)) * 1920;
      const y = (seed2 - Math.floor(seed2)) * 1080;
      const size = 3 + (seed3 - Math.floor(seed3)) * 8;
      const opacity = 0.15 + ((seed1 + seed2) % 1) * 0.35;
      const driftX = (((seed2 * 100) % 10) - 5) * 0.4;
      const driftY = -0.5 - ((seed3 * 100) % 10) * 0.15;
      const phase = (i * 0.3) % (Math.PI * 2);

      return { x, y, size, opacity, driftX, driftY, phase };
    });
  }, [count]);

  const tintColor = interpolate(dangerLevel, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, idx) => {
        const posX = (p.x + frame * p.driftX * speed + 1920) % 1920;
        const rawY = p.y + frame * p.driftY * speed;
        const posY = ((rawY % 1080) + 1080) % 1080;
        const pulse = Math.sin(frame * 0.05 + p.phase) * 0.2;
        const currentOpacity = Math.max(0.05, Math.min(0.8, p.opacity + pulse));

        const bg =
          tintColor > 0.5
            ? `rgba(239, 68, 68, ${currentOpacity * (0.8 + tintColor * 0.5)})`
            : `rgba(56, 189, 248, ${currentOpacity})`;

        const shadowGlow =
          tintColor > 0.5
            ? "0 0 15px rgba(239,68,68,0.8)"
            : "0 0 12px rgba(56,189,248,0.6)";

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `${posX}px`,
              top: `${posY}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              backgroundColor: bg,
              boxShadow: shadowGlow,
              filter: "blur(1px)",
              transform: `scale(${1 + pulse * 0.5})`,
            }}
          />
        );
      })}
    </div>
  );
};
