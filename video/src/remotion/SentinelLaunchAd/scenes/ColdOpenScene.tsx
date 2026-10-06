import { Underline } from "@remotion/rough-notation";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GradientTransition } from "remotion-bits";
import { beatOpacity, beatRise } from "../beat";
import { COLORS, FONT_FAMILY } from "../theme";

const Line: React.FC<{
  frame: number;
  start: number;
  duration: number;
  children: React.ReactNode;
}> = ({ frame, start, duration, children }) => {
  const opacity = beatOpacity(frame, start, duration, { fadeIn: 14, fadeOut: 16 });
  const y = beatRise(frame, start, duration, { fadeIn: 16, distance: 20 });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 68,
          fontWeight: 800,
          color: COLORS.textPrimary,
          textAlign: "center",
          letterSpacing: -1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ColdOpenScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const underlineProgress = interpolate(frame, [105, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <GradientTransition
        gradient={[
          "radial-gradient(circle at 50% 45%, rgba(47,111,237,0.10), rgba(9,9,11,0) 55%)",
          "radial-gradient(circle at 50% 45%, rgba(47,111,237,0.24), rgba(9,9,11,0) 60%)",
        ]}
        duration={durationInFrames}
        easing="easeInOutSine"
      />

      <Line frame={frame} start={10} duration={95}>
        Some risks you can smell.
      </Line>
      <Line frame={frame} start={90} duration={durationInFrames - 90}>
        Others,{" "}
        <Underline
          color={COLORS.accent}
          strokeWidth={4}
          padding={{ top: 4 }}
          progress={underlineProgress}
        >
          you can&apos;t.
        </Underline>
      </Line>
    </AbsoluteFill>
  );
};
