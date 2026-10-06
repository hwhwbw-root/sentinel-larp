import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface CounterProps {
  from: number;
  to: number;
  startFrame?: number;
  durationInFrames?: number;
  prefix?: string;
  postfix?: string;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
  colorShiftThresholds?: {
    warning: number;
    danger: number;
  };
}

export const Counter: React.FC<CounterProps> = ({
  from,
  to,
  startFrame = 0,
  durationInFrames = 60,
  prefix = "",
  postfix = "",
  decimals = 0,
  className = "",
  style = {},
  colorShiftThresholds,
}) => {
  const frame = useCurrentFrame();

  const rawValue = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [from, to],
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const formattedNumber =
    decimals > 0
      ? rawValue.toFixed(decimals)
      : Math.round(rawValue).toLocaleString("en-US");

  let computedColor = style.color || "#FFFFFF";
  if (colorShiftThresholds) {
    if (rawValue >= colorShiftThresholds.danger) {
      computedColor = "#EF4444"; // Danger Red
    } else if (rawValue >= colorShiftThresholds.warning) {
      computedColor = "#F59E0B"; // Warning Amber
    } else {
      computedColor = "#10B981"; // Normal Emerald
    }
  }

  return (
    <span
      className={`font-mono tabular-nums font-bold ${className}`}
      style={{
        ...style,
        color: computedColor,
      }}
    >
      {prefix}
      {formattedNumber}
      {postfix}
    </span>
  );
};
