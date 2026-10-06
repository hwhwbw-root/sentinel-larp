import React from "react";
import { useCurrentFrame } from "remotion";
import { SentiAtmosphere } from "../components/SentiAtmosphere";
import { FleetGrid } from "../components/FleetGrid";
import { KineticWords } from "../components/KineticWords";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const FleetScaleScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Part 1: Frames 0 - 110 → "Every sensor synchronized — forever."
  // Part 2: Frames 110 - 300 → Multi-Bay Fleet Grid
  const isPart2 = frame >= 110;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      <SentiAtmosphere variant="luminous" intensity={1.0} />

      {!isPart2 ? (
        <div className="relative z-10 text-center max-w-5xl px-8">
          {/* Line 1: "Every sensor synchronized" — word-by-word */}
          <h2
            className="text-7xl md:text-8xl font-black text-zinc-900 tracking-tight leading-tight"
            style={{ overflow: "hidden" }}
          >
            <KineticWords
              text="Every sensor synchronized"
              startFrame={8}
              stagger={6}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={40}
              blurStart={14}
            />
          </h2>

          {/* Line 2: "— forever." — blue accent, delayed */}
          <h2
            className="text-7xl md:text-8xl font-black tracking-tight leading-tight mt-1"
            style={{ overflow: "hidden" }}
          >
            <KineticWords
              text="— forever."
              startFrame={34}
              stagger={5}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={40}
              blurStart={14}
              accents={{ 0: "#2563eb", 1: "#2563eb" }}
            />
          </h2>
        </div>
      ) : (
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <FleetGrid />
        </div>
      )}
    </div>
  );
};
