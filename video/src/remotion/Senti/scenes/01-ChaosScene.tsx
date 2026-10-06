import React from "react";
import { useCurrentFrame } from "remotion";
import { SentiAtmosphere } from "../components/SentiAtmosphere";
import { ChaosCards } from "../components/ChaosCards";
import { KineticWords } from "../components/KineticWords";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const ChaosScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Part 1: Frames 0 - 210 → floating chaos cards + "The same hazard, Disconnected sensors"
  // Part 2: Frames 210 - 360 → "Stop Relying on Delayed Alerts."
  const isPart2 = frame >= 210;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      <SentiAtmosphere variant="canvas" />

      {!isPart2 ? (
        <>
          {/* Floating Disconnected UI Cards */}
          <ChaosCards />

          {/* Central Statement — word-by-word kinetic reveal */}
          <div
            className="relative z-20 text-center max-w-5xl px-8 flex flex-col items-center"
            style={{ overflow: "hidden" }}
          >
            {/* Line 1 */}
            <h1
              className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-tight"
              style={{ overflow: "hidden" }}
            >
              <KineticWords
                text="The same hazard,"
                startFrame={20}
                stagger={5}
                springConfig={SENTI_SPRINGS.snappy}
                yOffset={30}
                blurStart={10}
              />
            </h1>
            {/* Line 2 */}
            <h1
              className="text-6xl md:text-7xl font-medium tracking-tight text-zinc-400 leading-tight mt-3"
              style={{ overflow: "hidden" }}
            >
              <KineticWords
                text="Disconnected sensors."
                startFrame={40}
                stagger={5}
                springConfig={SENTI_SPRINGS.snappy}
                yOffset={30}
                blurStart={10}
                // "Disconnected" stays zinc-400 (inherited), "sensors." slightly dimmer
                accents={{ 1: "#a1a1aa" }}
              />
            </h1>
          </div>
        </>
      ) : (
        /* Part 2: "Stop Relying on Delayed Alerts." — word-by-word on canvas */
        <div
          className="relative z-20 text-center max-w-5xl px-8"
          style={{ overflow: "hidden" }}
        >
          <h2
            className="text-7xl md:text-8xl font-black tracking-tight text-zinc-950 leading-tight"
            style={{ overflow: "hidden" }}
          >
            <KineticWords
              text="Stop Relying on Delayed Alerts."
              startFrame={5}
              stagger={6}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={40}
              blurStart={14}
              // "Relying" → blue accent (word index 1)
              accents={{ 1: "#2f6fed" }}
            />
          </h2>
        </div>
      )}
    </div>
  );
};
