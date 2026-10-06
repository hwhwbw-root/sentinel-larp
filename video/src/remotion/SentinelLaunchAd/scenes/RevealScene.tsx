import { Cpu, Gauge, Thermometer, Wind } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Behavior, Particles, Spawner } from "remotion-bits";
import { HardwareModel3D } from "../../../components/HardwareShowcase/HardwareModel3D";
import { SpecTextStagger } from "../../../components/HardwareShowcase/SpecTextStagger";
import { beatOpacity, beatRise } from "../beat";
import { COLORS, FONT_FAMILY } from "../theme";

// One held statement at a time (Apple restraint), not a stagger swarm —
// each fact is real, pulled straight from README.md's device description.
const BEATS: { start: number; duration: number; text: string }[] = [
  { start: 55, duration: 95, text: "Powered by an ESP32." },
  { start: 140, duration: 95, text: "Reads CO2 or hydrogen." },
  { start: 225, duration: 100, text: "Temp, humidity — updated every ~10 seconds." },
];

const SUMMARY_CHIPS = [
  { label: "ESP32 Core", icon: Cpu },
  { label: "CO2 or H2", icon: Wind },
  { label: "Temp + Humidity", icon: Thermometer },
  { label: "~10s Reporting", icon: Gauge },
];

export const RevealScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // A slow continuous push-in — the shot is never truly static, even while
  // a beat holds on screen.
  const cameraScale = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  const titleOpacity = beatOpacity(frame, 0, 85, { fadeIn: 14, fadeOut: 20 });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(47,111,237,0.20), rgba(9,9,11,0) 55%)",
          }}
        />

        <Particles>
          <Spawner
            rate={0.5}
            lifespan={150}
            area={{ width: 1600, height: 700 }}
            position={{ x: 960, y: 420 }}
            velocity={{ x: 0, y: -5, varianceX: 4, varianceY: 3 }}
            transition={{ opacity: [0, 1, 1, 0] }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: COLORS.accent,
                boxShadow: `0 0 12px ${COLORS.accent}`,
              }}
            />
          </Spawner>
          <Behavior wiggle={{ magnitude: 1.5, frequency: 0.4 }} />
        </Particles>

        <AbsoluteFill style={{ top: -50 }}>
          <HardwareModel3D
            geometry="box"
            color={COLORS.accent}
            framesPerRotation={130}
            width={1920}
            height={760}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          fontFamily: FONT_FAMILY,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: COLORS.accent,
        }}
      >
        This is Sentinel
      </div>

      {BEATS.map((beat) => {
        const beatOp = beatOpacity(frame, beat.start, beat.duration, {
          fadeIn: 14,
          fadeOut: 18,
        });
        const beatY = beatRise(frame, beat.start, beat.duration, {
          fadeIn: 14,
          distance: 18,
        });

        return (
          <div
            key={beat.text}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 200,
              textAlign: "center",
              opacity: beatOp,
              transform: `translateY(${beatY}px)`,
              fontFamily: FONT_FAMILY,
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            {beat.text}
          </div>
        );
      })}

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ marginBottom: 90 }}>
          <SpecTextStagger
            specs={SUMMARY_CHIPS}
            startFrame={330}
            staggerFrames={5}
            durationInFrames={16}
            className="flex flex-wrap gap-3 items-center justify-center"
            chipStyle={{ fontFamily: FONT_FAMILY, fontSize: 18 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
