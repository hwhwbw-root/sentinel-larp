import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { beatOpacity } from "../beat";
import { COLORS, EXPO_OUT, FONT_FAMILY } from "../theme";

export const OutroScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(frame, [0, 20], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EXPO_OUT,
    output: "perceptual-scale",
  });
  const logoOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(47,111,237,0.18), rgba(9,9,11,0) 60%)",
        }}
      />

      <Img
        src={staticFile("branding/sentinel-logo.svg")}
        style={{
          width: 84,
          height: 84,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      />

      <div
        style={{
          opacity: beatOpacity(frame, 12, durationInFrames - 12, { fadeIn: 14, fadeOut: 14 }),
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 900,
          color: COLORS.textPrimary,
          letterSpacing: -0.5,
          textAlign: "center",
        }}
      >
        Built to watch what you can&apos;t see.
      </div>

      <div
        style={{
          opacity: beatOpacity(frame, 34, durationInFrames - 34, { fadeIn: 14, fadeOut: 14 }),
          fontFamily: FONT_FAMILY,
          fontSize: 20,
          fontWeight: 600,
          color: COLORS.accent,
        }}
      >
        Now deploying to fleets.
      </div>
    </AbsoluteFill>
  );
};
