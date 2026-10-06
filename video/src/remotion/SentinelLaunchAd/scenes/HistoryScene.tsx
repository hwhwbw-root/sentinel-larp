import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { beatOpacity, beatRise } from "../beat";
import { COLORS, FONT_FAMILY } from "../theme";
import { AppShell, DataPreviewTable, FilterCard } from "../ui-mocks";

const ROWS = [
  { time: "9/19, 6:37 PM", gas: "513.24", temp: "23.31", humidity: "49.89" },
  { time: "9/19, 6:38 PM", gas: "657.83", temp: "24.87", humidity: "54.23" },
  { time: "9/19, 6:38 PM", gas: "1590.89", temp: "36.73", humidity: "91.40", danger: true },
  { time: "9/19, 6:39 PM", gas: "495.20", temp: "22.31", humidity: "41.65" },
  { time: "9/19, 6:39 PM", gas: "747.22", temp: "20.87", humidity: "54.87" },
];

export const HistoryScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const cameraScale = interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateRight: "clamp",
  });

  const stageOpacity = beatOpacity(frame, 25, durationInFrames - 40, { fadeIn: 16, fadeOut: 18 });
  const stageY = beatRise(frame, 25, durationInFrames - 40, { fadeIn: 18, distance: 22 });

  const visibleRows = Math.min(
    ROWS.length,
    Math.floor(interpolate(frame, [100, 190], [0, ROWS.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: beatOpacity(frame, 0, 75, { fadeIn: 14, fadeOut: 18 }),
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 800,
          color: COLORS.textPrimary,
          letterSpacing: -0.5,
        }}
      >
        Every reading, remembered.
      </div>

      <div style={{ opacity: stageOpacity, transform: `translateY(${stageY}px) scale(${cameraScale})` }}>
        <AppShell
          width={980}
          height={600}
          activeNav="Data History"
          pageTitle="Data History"
          pageSubtitle="Export and analyze historical device data"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FilterCard device="mocksense-0" dateRange="Sep 19, 2026 - Sep 20, 2026" />
            <DataPreviewTable rows={ROWS.slice(0, visibleRows)} />
          </div>
        </AppShell>
      </div>
    </AbsoluteFill>
  );
};
