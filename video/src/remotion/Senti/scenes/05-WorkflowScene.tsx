import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SentiAtmosphere } from "../components/SentiAtmosphere";
import { WorkflowBuilder } from "../components/WorkflowBuilder";
import { KineticWords } from "../components/KineticWords";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Frames 0 - 180 → "You can define the response"
  // Part 2: Frames 180 - 750 → Interactive Glassmorphism Workflow Builder
  const isPart2 = frame >= 180;

  // Sub-line reveal
  const subSpring = spring({ frame: frame - 42, fps, config: SENTI_SPRINGS.smooth });
  const subY = interpolate(subSpring, [0, 1], [18, 0]);
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      <SentiAtmosphere variant="navy" intensity={1.0} />

      {!isPart2 ? (
        /* Part 1: Punchy kinetic statement on deep navy */
        <div className="relative z-10 text-center max-w-5xl px-8">
          {/* Main statement — word-by-word, "define" gets cyan accent */}
          <h2
            className="text-7xl md:text-8xl font-bold text-white tracking-tight leading-tight"
            style={{ overflow: "hidden" }}
          >
            <KineticWords
              text="You can"
              startFrame={12}
              stagger={6}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={38}
              blurStart={14}
            />
            {" "}
            <KineticWords
              text="define"
              startFrame={26}
              stagger={0}
              springConfig={SENTI_SPRINGS.snappy}
              yOffset={42}
              blurStart={16}
              accents={{ 0: "#38bdf8" }}
              wordClassName="font-black"
            />
            {" "}
            <KineticWords
              text="the response"
              startFrame={34}
              stagger={5}
              springConfig={SENTI_SPRINGS.smooth}
              yOffset={30}
              blurStart={10}
            />
          </h2>

          {/* Sub-line slides up softly */}
          <p
            className="text-xl md:text-2xl text-zinc-400 mt-6 font-medium"
            style={{
              transform: `translateY(${subY}px)`,
              opacity: subOpacity,
            }}
          >
            Tailor industrial thresholds, audible alarms, and audit policies per bay.
          </p>
        </div>
      ) : (
        /* Part 2: 3D Interactive Workflow Builder */
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <WorkflowBuilder />
        </div>
      )}
    </div>
  );
};
