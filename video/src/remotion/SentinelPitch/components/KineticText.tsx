import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";

interface KineticTextProps {
  text: string;
  delay?: number;
  className?: string;
  highlightWords?: string[];
  highlightColor?: string;
  splitBy?: "word" | "none";
  staggerFrames?: number;
  fontSize?: string;
  tracking?: string;
  color?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  delay = 0,
  className = "",
  highlightWords = [],
  highlightColor = "#2f6fed",
  splitBy = "word",
  staggerFrames = 3,
  fontSize = "text-5xl",
  tracking = "-0.03em",
  color = "#1d1d1f",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (splitBy === "none") {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: APPLE_SPRINGS.smooth,
    });

    const opacity = interpolate(progress, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateY = interpolate(progress, [0, 1], [18, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <div
        className={`font-semibold leading-tight ${fontSize} ${className}`}
        style={{
          fontFamily: APPLE_FONT_FAMILY,
          letterSpacing: tracking,
          color,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {text}
      </div>
    );
  }

  const words = text.split(" ");

  return (
    <div
      className={`flex flex-wrap items-center gap-x-[0.35em] gap-y-2 ${className}`}
      style={{ fontFamily: APPLE_FONT_FAMILY }}
    >
      {words.map((word, index) => {
        const wordDelay = delay + index * staggerFrames;
        const progress = spring({
          frame: frame - wordDelay,
          fps,
          config: APPLE_SPRINGS.snappy,
        });

        const opacity = interpolate(progress, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const translateY = interpolate(progress, [0, 1], [18, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const scale = interpolate(progress, [0, 1], [0.98, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord || word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <span
            key={index}
            className={`inline-block font-bold leading-tight ${fontSize}`}
            style={{
              fontFamily: APPLE_FONT_FAMILY,
              letterSpacing: "-0.03em",
              marginRight: index < words.length - 1 ? "0.3em" : 0,
              color: isHighlight ? highlightColor : color,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
