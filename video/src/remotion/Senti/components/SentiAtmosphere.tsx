import React from "react";
import { useCurrentFrame } from "remotion";
import { SENTI_GRADIENTS } from "../theme";

interface SentiAtmosphereProps {
  variant?: "luminous" | "canvas" | "navy" | "danger";
  intensity?: number;
}

export const SentiAtmosphere: React.FC<SentiAtmosphereProps> = ({
  variant = "canvas",
  intensity = 1.0,
}) => {
  const frame = useCurrentFrame();

  // Subtle breathing radial light oscillation
  const pulse = Math.sin(frame * 0.04) * 0.06 + 1.0;
  const shiftX = Math.cos(frame * 0.02) * 22;
  const shiftY = Math.sin(frame * 0.025) * 14;

  let bg = SENTI_GRADIENTS.cleanCanvas;
  if (variant === "luminous") {
    // Richer, deeper luminous sky — stronger blue saturation at edges
    bg = "radial-gradient(circle at 50% 55%, #ffffff 0%, #bfdbfe 30%, #60a5fa 60%, #1d4ed8 100%)";
  } else if (variant === "navy") {
    bg = SENTI_GRADIENTS.deepNavy;
  } else if (variant === "danger") {
    bg = "radial-gradient(circle at 50% 50%, #fee2e2 0%, #ffffff 50%, #f1f5f9 100%)";
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{
        background: bg,
        opacity: intensity,
      }}
    >
      {/* Luminous: animated white-core bloom */}
      {variant === "luminous" && (
        <div
          className="absolute w-[1600px] h-[1000px] rounded-full pointer-events-none"
          style={{
            top: "-80px",
            left: "-50px",
            transform: `translate(${shiftX}px, ${shiftY}px) scale(${pulse})`,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(191,219,254,0.35) 35%, rgba(37,99,235,0) 68%)",
            filter: "blur(70px)",
          }}
        />
      )}

      {/* Canvas: subtle blue center glow — breaks the flat white */}
      {variant === "canvas" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, rgba(47,111,237,0.05) 0%, rgba(47,111,237,0.01) 55%, transparent 80%)",
          }}
        />
      )}

      {/* Navy: strong cinematic vignette */}
      {variant === "navy" && (
        <>
          {/* Corner vignette — heavier than before */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 42%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          {/* Subtle horizontal scan-line texture feel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.12) 100%)",
            }}
          />
        </>
      )}

      {/* Light canvas: mild edge shadow for depth */}
      {variant === "canvas" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 120px rgba(15,23,42,0.05)",
          }}
        />
      )}
    </div>
  );
};
