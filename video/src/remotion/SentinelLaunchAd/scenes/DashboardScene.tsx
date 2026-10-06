import { Droplets, Thermometer, Wind } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { beatOpacity, beatRise } from "../beat";
import { COLORS, FONT_FAMILY } from "../theme";
import { AlertListItem, AlertListTile, AppShell, BentoStatTile, LineChartTile } from "../ui-mocks";

const CO2_TREND = [0.3, 0.7, 0.35, 0.62, 0.28, 0.58, 0.32, 0.66, 0.3, 0.5];
const TEMP_TREND = [0.4, 0.55, 0.42, 0.5, 0.45, 0.52, 0.44, 0.5, 0.46, 0.48];
const HUMID_TREND = [0.6, 0.5, 0.62, 0.48, 0.6, 0.5, 0.58, 0.46, 0.56, 0.5];

export const DashboardScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 9) * 0.5 + 0.5;

  const cameraScale = interpolate(frame, [0, durationInFrames], [1, 1.04], {
    extrapolateRight: "clamp",
  });

  const stageOpacity = beatOpacity(frame, 30, durationInFrames - 45, {
    fadeIn: 18,
    fadeOut: 18,
  });
  const stageY = beatRise(frame, 30, durationInFrames - 45, { fadeIn: 20, distance: 24 });

  const drawProgress = interpolate(frame, [50, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const co2Value = 412 + Math.sin(frame / 14) * 6;
  const tempValue = 24.3 + Math.sin(frame / 20) * 0.3;
  const humidValue = 48 + Math.sin(frame / 17) * 1.2;

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
          top: 90,
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
        One dashboard. Every reading.
      </div>

      <div
        style={{
          opacity: stageOpacity,
          transform: `translateY(${stageY}px) scale(${cameraScale})`,
        }}
      >
        <AppShell
          width={1180}
          height={640}
          activeNav="Overview"
          pageTitle="Real-time Monitoring"
          pageSubtitle="Overview of environmental metrics"
        >
          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <BentoStatTile
              label="CO2 Level"
              value={co2Value.toFixed(2)}
              unit="ppm"
              Icon={Wind}
              live
              pulse={pulse}
              changeLabel="+3.0% vs last reading"
              changeGood={false}
            />
            <BentoStatTile
              label="Temperature"
              value={tempValue.toFixed(2)}
              unit="C"
              Icon={Thermometer}
              changeLabel="+1.4% vs last reading"
              changeGood={true}
            />
            <BentoStatTile
              label="Humidity"
              value={humidValue.toFixed(2)}
              unit="%"
              Icon={Droplets}
              changeLabel="-0.8% vs last reading"
              changeGood={true}
            />
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <LineChartTile title="CO2 Trend" drawProgress={drawProgress} points={CO2_TREND} />
            <LineChartTile
              title="Temp & Humidity"
              drawProgress={drawProgress}
              points={TEMP_TREND}
              secondaryPoints={HUMID_TREND}
            />
            <AlertListTile>
              <AlertListItem
                time="6:36:04 PM"
                message="DANGEROUS: CO2 level at 1583.62 ppm exceeds danger threshold"
                device="mocksense-0"
              />
              <AlertListItem
                time="6:34:02 PM"
                message="DANGEROUS: CO2 level at 1748.88 ppm exceeds danger threshold"
                device="mocksense-0"
              />
            </AlertListTile>
          </div>
        </AppShell>
      </div>
    </AbsoluteFill>
  );
};
