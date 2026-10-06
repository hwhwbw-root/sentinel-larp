import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface StrikingSentinelLogoProps {
  idPrefix?: string; // unique ID prefix for SVG clips/gradients
  size?: number; // width/height in px, default 200
  sheenStartFrame?: number; // frame relative to scene start when specular sheen starts
  sheenDuration?: number; // duration of the sheen sweep in frames, default 22
  showText?: boolean;
  textClassName?: string;
  reticleElevation?: number; // Z-elevation of the sensor reticle in px, default 26
}

export const StrikingSentinelLogo: React.FC<StrikingSentinelLogoProps> = ({
  idPrefix = "sentinel",
  size = 200,
  sheenStartFrame = 16,
  sheenDuration = 22,
  showText = true,
  textClassName = "text-5xl font-black tracking-tight text-zinc-900 text-center uppercase leading-none",
  reticleElevation = 26,
}) => {
  const frame = useCurrentFrame();

  // Specular light sheen diagonal sweep coordinates (0% to 100% across the shield plate)
  const sheenStart = interpolate(
    frame,
    [sheenStartFrame, sheenStartFrame + sheenDuration],
    [-70, 130],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const sheenEnd = sheenStart + 50;

  const sheenOpacity = interpolate(
    frame,
    [
      sheenStartFrame,
      sheenStartFrame + 3,
      sheenStartFrame + sheenDuration - 3,
      sheenStartFrame + sheenDuration,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Hero Shield Brandmark Container with 3D Depth */}
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Breathing Ambient Back Glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(47, 111, 237, 0.16) 0%, rgba(47, 111, 237, 0) 70%)",
            transform: "translateZ(-15px) scale(1.35)",
            opacity: interpolate(Math.sin(frame * 0.05), [-1, 1], [0.75, 1]),
          }}
        />

        {/* LAYER 1 (Z = 0): Base Shield Perimeter & Plate + Smooth Specular Glass Sheen */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: "translateZ(0px)",
            transformStyle: "preserve-3d",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            className="w-full h-full overflow-visible"
            style={{
              filter: "drop-shadow(0px 14px 28px rgba(47, 111, 237, 0.16))",
            }}
          >
            <defs>
              {/* Ultra-Smooth Specular Glass Sheen Gradient */}
              <linearGradient
                id={`${idPrefix}-sheen-grad`}
                x1={`${sheenStart}%`}
                y1="0%"
                x2={`${sheenEnd}%`}
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Outer Shield Frame */}
            <path
              d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
              fill="none"
              stroke="#2f6fed"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Inner Shield Plate */}
            <path
              d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
              fill="#f0f5ff"
              stroke="#2f6fed"
              strokeWidth="2"
            />

            {/* Specular Glass Sheen Overlay (Directly over the Inner Shield Plate) */}
            <path
              d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
              fill={`url(#${idPrefix}-sheen-grad)`}
              opacity={sheenOpacity}
              pointerEvents="none"
            />
          </svg>
        </div>

        {/* LAYER 2 (Z = reticleElevation): Floating 3D Sensor Reticle Core */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translateZ(${reticleElevation}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            className="w-full h-full overflow-visible"
            style={{
              filter: "drop-shadow(0px 8px 14px rgba(47, 111, 237, 0.42))",
            }}
          >
            {/* Reticle Target Ring */}
            <circle
              cx="40"
              cy="36"
              r="9"
              fill="none"
              stroke="#2f6fed"
              strokeWidth="3.5"
            />
            {/* Center Sensor Dot */}
            <circle cx="40" cy="36" r="2.6" fill="#2f6fed" />
            {/* Sensor Pin Stem */}
            <path
              d="M40 47 V56"
              stroke="#2f6fed"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Typography: Solid, Crisp, Bold */}
      {showText && (
        <div
          className={`relative mt-6 ${textClassName}`}
          style={{
            transform: "translateZ(14px)",
            transformStyle: "preserve-3d",
          }}
        >
          <span>SENTINEL</span>
        </div>
      )}
    </div>
  );
};
