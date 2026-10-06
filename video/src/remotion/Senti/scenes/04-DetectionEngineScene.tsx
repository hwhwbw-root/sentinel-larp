import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SentiAtmosphere } from "../components/SentiAtmosphere";
import { BreachAnalysisCard } from "../components/BreachAnalysisCard";
import { KineticWords, ImpactWord } from "../components/KineticWords";
import { SENTI_FONT_FAMILY, SENTI_SPRINGS } from "../theme";

export const DetectionEngineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Frames 0 - 360 → "Sensor Verifies Hazard as { critical }" + Verification Card
  // Part 2: Frames 360 - 540 → Bold Impact Cut: "Auto-Dispatched."
  const isPart2 = frame >= 360;
  const localFrame2 = frame - 360;

  // Part 1 header
  const tagSpring = spring({ frame: frame - 22, fps, config: SENTI_SPRINGS.snappy });
  const tagScale = interpolate(tagSpring, [0, 1], [0.82, 1]);
  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1]);
  const tagBlur = interpolate(tagSpring, [0, 1], [12, 0]);

  // Part 2 sub-line
  const subSpring = spring({ frame: localFrame2 - 20, fps, config: SENTI_SPRINGS.smooth });
  const subY = interpolate(subSpring, [0, 1], [18, 0]);
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);

  // Part 2 Zap icon
  const zapSpring = spring({ frame: localFrame2 - 4, fps, config: SENTI_SPRINGS.bouncy });
  const zapScale = interpolate(zapSpring, [0, 1], [0.6, 1]);
  const zapOpacity = interpolate(zapSpring, [0, 1], [0, 1]);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ fontFamily: SENTI_FONT_FAMILY }}
    >
      <SentiAtmosphere variant={isPart2 ? "navy" : "canvas"} />

      {!isPart2 ? (
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Header Statement — word-by-word */}
          <div className="text-center" style={{ overflow: "hidden" }}>
            <h2 className="text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight">
              <KineticWords
                text="Sensor Verifies Hazard as"
                startFrame={5}
                stagger={5}
                springConfig={SENTI_SPRINGS.smooth}
                yOffset={28}
                blurStart={10}
              />
              {" "}
              {/* Monospace badge pops in as a unit */}
              <span
                className="font-mono text-red-600 font-black tracking-normal bg-red-50 px-3 py-1 rounded-2xl border border-red-200 whitespace-nowrap"
                style={{
                  display: "inline-block",
                  transform: `scale(${tagScale})`,
                  opacity: tagOpacity,
                  filter: `blur(${tagBlur}px)`,
                }}
              >
                {"{ critical }"}
              </span>
            </h2>
          </div>

          {/* Breach Progress & Terminal Card */}
          <BreachAnalysisCard />
        </div>
      ) : (
        /* Part 2: Numtera-style full-navy impact cut ─────────────────────── */
        <div className="relative z-10 flex flex-col items-center text-center gap-8">
          {/* Zap icon — bouncy entrance */}
          <div
            className="w-20 h-20 rounded-3xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.5)]"
            style={{
              transform: `scale(${zapScale})`,
              opacity: zapOpacity,
            }}
          >
            {/* Inline SVG avoids animate-pulse lint error */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>

          {/* "Auto-Dispatched." — three words enter as separate impact beats */}
          <h2
            className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none"
            style={{ overflow: "hidden" }}
          >
            <ImpactWord
              word="Auto-Dispatched."
              startFrame={8}
              springConfig={{ damping: 16, mass: 0.7, stiffness: 240 }}
              style={{ color: "#ffffff" }}
            />
          </h2>

          {/* Sub-line slides up */}
          <p
            className="text-xl md:text-2xl text-zinc-400 font-medium max-w-xl"
            style={{
              transform: `translateY(${subY}px)`,
              opacity: subOpacity,
            }}
          >
            Siren activated · safety dashboard triggered · zero human delay.
          </p>
        </div>
      )}
    </div>
  );
};
