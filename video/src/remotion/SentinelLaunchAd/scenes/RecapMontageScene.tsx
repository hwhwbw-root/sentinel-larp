import { Droplets, Thermometer, Wind } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HardwareModel3D } from "../../../components/HardwareShowcase/HardwareModel3D";
import { beatOpacity } from "../beat";
import { COLORS, FONT_FAMILY } from "../theme";
import {
  AlertListItem,
  AlertListTile,
  ApiKeyModal,
  BentoStatTile,
  DataPreviewTable,
  RoleCard,
} from "../ui-mocks";

// A rapid-fire recap of every real feature the film already showed in full —
// same components, just cut fast and tight, the way Apple product films
// resolve into a beat-synced highlight pass before the close.
const CUT = { fadeIn: 6, fadeOut: 8 };

export const RecapMontageScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const flash = (start: number, duration: number, node: React.ReactNode) => (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: beatOpacity(frame, start, duration, CUT),
      }}
    >
      {node}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {flash(
        0,
        60,
        <div style={{ width: 640, height: 460 }}>
          <HardwareModel3D
            geometry="box"
            color={COLORS.accent}
            framesPerRotation={40}
            width={640}
            height={460}
          />
        </div>,
      )}

      {flash(
        55,
        60,
        <div style={{ display: "flex", gap: 14 }}>
          <BentoStatTile label="CO2 Level" value="412" unit="ppm" Icon={Wind} live pulse={1} />
          <BentoStatTile label="Temperature" value="24.3" unit="C" Icon={Thermometer} />
          <BentoStatTile label="Humidity" value="48" unit="%" Icon={Droplets} />
        </div>,
      )}

      {flash(
        110,
        55,
        <div style={{ width: 340 }}>
          <AlertListTile>
            <AlertListItem
              time="6:36:04 PM"
              message="DANGEROUS: CO2 level at 1748.88 ppm exceeds danger threshold"
              device="mocksense-0"
              glow={0.6}
            />
          </AlertListTile>
        </div>,
      )}

      {flash(
        165,
        55,
        <div style={{ width: 560 }}>
          <DataPreviewTable
            rows={[
              { time: "9/19, 6:38 PM", gas: "657.83", temp: "24.87", humidity: "54.23" },
              { time: "9/19, 6:38 PM", gas: "1590.89", temp: "36.73", humidity: "91.40", danger: true },
            ]}
          />
        </div>,
      )}

      {flash(220, 55, <ApiKeyModal deviceName="SENTINEL-1A2B" reveal={1} />)}

      {flash(
        275,
        55,
        <div style={{ display: "flex", gap: 18 }}>
          <RoleCard role="Viewer" capability="Read-only across the dashboard." />
          <RoleCard role="Admin" capability="Edits devices and thresholds." />
          <RoleCard role="Superadmin" capability="Controls devices and access." />
        </div>,
      )}

      {flash(
        300,
        durationInFrames - 300,
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 60,
            fontWeight: 900,
            letterSpacing: 9,
            textTransform: "uppercase",
            color: COLORS.textPrimary,
          }}
        >
          Sentinel
        </div>,
      )}
    </AbsoluteFill>
  );
};
