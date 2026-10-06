import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface KineticWordsProps {
  /** The text to animate. Words are split on spaces. */
  text: string;
  /** Frame at which the first word begins entering. Default: 0 */
  startFrame?: number;
  /** Frame stagger between consecutive words. Default: 4 */
  stagger?: number;
  /** Spring config. Default: snappy */
  springConfig?: { damping: number; mass: number; stiffness: number };
  /** className applied to the outer wrapper */
  className?: string;
  /** className applied to each word span */
  wordClassName?: string;
  /** Override style for each word span */
  wordStyle?: React.CSSProperties;
  /**
   * Accent map: { wordIndex: "color" } — colorise a specific word index.
   * e.g. { 2: "#2f6fed" } turns the 3rd word blue.
   */
  accents?: Record<number, string>;
  /** translateY start offset in px. Default: 28 */
  yOffset?: number;
  /** Start blur in px. Default: 10 */
  blurStart?: number;
}

const SNAPPY = { damping: 18, mass: 0.6, stiffness: 220 };

export const KineticWords: React.FC<KineticWordsProps> = ({
  text,
  startFrame = 0,
  stagger = 4,
  springConfig = SNAPPY,
  className = "",
  wordClassName = "",
  wordStyle = {},
  accents = {},
  yOffset = 28,
  blurStart = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <span
      className={className}
      style={{ display: "inline", lineHeight: "inherit" }}
    >
      {words.map((word, i) => {
        const wordFrame = frame - (startFrame + i * stagger);
        const s = spring({ frame: wordFrame, fps, config: springConfig });
        const y = interpolate(s, [0, 1], [yOffset, 0]);
        const opacity = interpolate(s, [0, 1], [0, 1]);
        const blur = interpolate(s, [0, 1], [blurStart, 0]);
        const color = accents[i];

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px)`,
              opacity,
              filter: `blur(${blur}px)`,
              marginRight: i < words.length - 1 ? "0.28em" : 0,
              color: color ?? undefined,
              ...wordStyle,
            }}
            className={wordClassName}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Full-bleed impact word — single massive word entering from bottom with
 * scale+blur, for the Numtera-style "Auto-Dispatched." cinematic cut.
 */
interface ImpactWordProps {
  word: string;
  startFrame?: number;
  springConfig?: { damping: number; mass: number; stiffness: number };
  className?: string;
  style?: React.CSSProperties;
}

export const ImpactWord: React.FC<ImpactWordProps> = ({
  word,
  startFrame = 0,
  springConfig = SNAPPY,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - startFrame, fps, config: springConfig });
  const y = interpolate(s, [0, 1], [60, 0]);
  const scale = interpolate(s, [0, 1], [0.82, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const blur = interpolate(s, [0, 1], [18, 0]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transform: `translateY(${y}px) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {word}
    </span>
  );
};
