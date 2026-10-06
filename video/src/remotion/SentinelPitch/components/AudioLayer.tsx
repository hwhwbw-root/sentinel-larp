import React from "react";
import { Audio, staticFile, interpolate } from "remotion";

export const AudioLayer: React.FC = () => {
  return (
    <>
      {/* 90-second rich electronic soundscape with Remotion dynamic volume envelope */}
      <Audio
        src={staticFile("audio/soundscape.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 45, 2550, 2690],
            [0, 0.85, 0.85, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          )
        }
      />
    </>
  );
};
