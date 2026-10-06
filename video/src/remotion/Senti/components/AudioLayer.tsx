import React from "react";
import { Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { TOTAL_DURATION_IN_FRAMES } from "../types";

export const AudioLayer: React.FC = () => {
  const frame = useCurrentFrame();

  const volume = interpolate(
    frame,
    [0, 15, TOTAL_DURATION_IN_FRAMES - 45, TOTAL_DURATION_IN_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile("audio/senti_audio.mp3")}
      volume={volume}
    />
  );
};
