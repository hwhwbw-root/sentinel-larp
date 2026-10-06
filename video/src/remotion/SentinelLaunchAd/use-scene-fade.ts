import { interpolate, useCurrentFrame } from "remotion";

// Every scene runs in its own <Sequence>, so useCurrentFrame() here is already
// local to that scene (0 at its first frame) — this just cross-fades the edges
// so adjacent, slightly-overlapping sequences read as one continuous cut.
export const useSceneFade = (
  durationInFrames: number,
  options: { fadeIn?: number; fadeOut?: number } = {},
) => {
  const { fadeIn = 15, fadeOut = 15 } = options;
  const frame = useCurrentFrame();

  return interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};
