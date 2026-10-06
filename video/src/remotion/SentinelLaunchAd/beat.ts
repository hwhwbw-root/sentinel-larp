import { interpolate } from "remotion";
import { EXPO_OUT } from "./theme";

// A "beat" is one held statement within a scene (Apple-style restraint: one
// line on screen at a time). Takes the scene's already-local frame (from
// useCurrentFrame() in the caller) so multiple beats can share one component
// without nesting a <Sequence> per line. Eased with EXPO_OUT (bezier), per
// remotion-dev/skills' timing guidance, instead of a linear default.
export const beatOpacity = (
  frame: number,
  start: number,
  duration: number,
  options: { fadeIn?: number; fadeOut?: number } = {},
) => {
  const { fadeIn = 10, fadeOut = 14 } = options;
  return interpolate(
    frame,
    [start, start + fadeIn, start + duration - fadeOut, start + duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EXPO_OUT,
    },
  );
};

export const beatRise = (
  frame: number,
  start: number,
  duration: number,
  options: { fadeIn?: number; distance?: number } = {},
) => {
  const { fadeIn = 10, distance = 22 } = options;
  return interpolate(frame, [start, start + fadeIn], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EXPO_OUT,
  });
};

export const beatScale = (
  frame: number,
  start: number,
  duration: number,
  options: { fadeIn?: number; from?: number } = {},
) => {
  const { fadeIn = 12, from = 0.9 } = options;
  return interpolate(frame, [start, start + fadeIn], [from, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EXPO_OUT,
    output: "perceptual-scale",
  });
};
