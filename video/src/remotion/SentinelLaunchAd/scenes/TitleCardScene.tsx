import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AnimatedText, GradientTransition } from "remotion-bits";
import { EXPO_OUT, COLORS, FONT_FAMILY } from "../theme";

export const TitleCardScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // One confident kinetic pop (scale + blur), not a per-character typewriter
  // — reads as a decisive brand reveal instead of a slow crawl.
  const scale = interpolate(frame, [0, 18], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EXPO_OUT,
    output: "perceptual-scale",
  });
  const blur = interpolate(frame, [0, 18], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EXPO_OUT,
  });
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <GradientTransition
        gradient={[
          "radial-gradient(circle at 50% 45%, rgba(47,111,237,0.12), rgba(9,9,11,0) 55%)",
          "radial-gradient(circle at 50% 45%, rgba(47,111,237,0.32), rgba(9,9,11,0) 60%)",
        ]}
        duration={durationInFrames}
        easing="easeInOutSine"
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 18 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            opacity,
            filter: `blur(${blur}px)`,
            transform: `scale(${scale})`,
          }}
        >
          <Img src={staticFile("branding/sentinel-logo.svg")} style={{ width: 78, height: 78 }} />
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 54,
              fontWeight: 900,
              letterSpacing: 11,
              textTransform: "uppercase",
              color: COLORS.textPrimary,
            }}
          >
            Sentinel
          </div>
        </div>

        <AnimatedText
          transition={{
            split: "word",
            splitStagger: 2,
            delay: 40,
            opacity: [0, 1],
            duration: 14,
            easing: EXPO_OUT,
          }}
          style={{
            color: COLORS.textSecondary,
            fontFamily: FONT_FAMILY,
            fontSize: 21,
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          Always watching.
        </AnimatedText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
