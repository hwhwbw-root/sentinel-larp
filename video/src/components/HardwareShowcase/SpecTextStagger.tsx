import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type SpecItem = string | { label: string; icon?: LucideIcon };

export type SpecTextStaggerProps = {
  specs: SpecItem[];
  startFrame?: number;
  staggerFrames?: number;
  durationInFrames?: number;
  className?: string;
  chipStyle?: React.CSSProperties;
};

// Values are computed per-frame from Remotion's clock and handed to framer-motion
// as plain `style`, never as `animate`/`transition` — that keeps rendering
// deterministic under headless Lambda capture, where there is no real-time RAF loop.
export const SpecTextStagger: React.FC<SpecTextStaggerProps> = ({
  specs,
  startFrame = 0,
  staggerFrames = 6,
  durationInFrames = 20,
  className,
  chipStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      className={
        className ?? "flex flex-wrap gap-4 items-center justify-center"
      }
    >
      {specs.map((spec, i) => {
        const label = typeof spec === "string" ? spec : spec.label;
        const Icon = typeof spec === "string" ? undefined : spec.icon;
        const entryFrame = startFrame + i * staggerFrames;
        const localFrame = Math.max(0, frame - entryFrame);

        const progress = spring({
          fps,
          frame: localFrame,
          durationInFrames,
          config: {
            damping: 18,
            stiffness: 140,
            mass: 0.6,
          },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(progress, [0, 1], [24, 0], {
          extrapolateLeft: "clamp",
        });
        const scale = interpolate(progress, [0, 1], [0.92, 1], {
          extrapolateLeft: "clamp",
        });

        return (
          <motion.span
            key={`${label}-${i}`}
            style={{
              ...chipStyle,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
            }}
            className="flex items-center gap-2 text-white font-semibold tracking-tight bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-sm"
          >
            {Icon ? <Icon size={18} strokeWidth={2.25} /> : null}
            {label}
          </motion.span>
        );
      })}
    </div>
  );
};
