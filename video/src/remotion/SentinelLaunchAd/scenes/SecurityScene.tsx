import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { beatOpacity, beatRise } from "../beat";
import { COLORS, FONT_FAMILY } from "../theme";
import { ApiKeyModal, AppShell, DeviceTable } from "../ui-mocks";

const DEVICES: { id: string; type: string; status: "Active" | "Offline" }[] = [
  { id: "mocksense-0", type: "CO2", status: "Active" },
  { id: "mocksense-1", type: "H2", status: "Active" },
];

export const SecurityScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const tableOpacity = beatOpacity(frame, 15, 115, { fadeIn: 16, fadeOut: 22 });
  const tableY = beatRise(frame, 15, 115, { fadeIn: 18, distance: 22 });

  const modalOpacity = beatOpacity(frame, 95, durationInFrames - 110, { fadeIn: 14, fadeOut: 22 });
  const modalScale = interpolate(frame, [95, 112], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const reveal = interpolate(frame, [115, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          opacity: beatOpacity(frame, 0, 80, { fadeIn: 14, fadeOut: 18 }),
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 800,
          color: COLORS.textPrimary,
          letterSpacing: -0.5,
          maxWidth: 900,
        }}
      >
        Every device carries its own key.
      </div>

      <div
        style={{
          position: "absolute",
          opacity: tableOpacity,
          transform: `translateY(${tableY}px)`,
        }}
      >
        <AppShell
          width={760}
          height={340}
          activeNav="Device Management"
          pageTitle="Device Management"
          pageSubtitle="2 device(s) registered"
        >
          <DeviceTable rows={DEVICES} />
        </AppShell>
      </div>

      <div
        style={{
          position: "absolute",
          opacity: modalOpacity,
          transform: `scale(${modalScale})`,
        }}
      >
        <ApiKeyModal deviceName="SENTINEL-1A2B" reveal={reveal} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: beatOpacity(frame, 190, durationInFrames - 205, { fadeIn: 18, fadeOut: 22 }),
          fontFamily: FONT_FAMILY,
          fontSize: 26,
          fontWeight: 600,
          color: COLORS.textSecondary,
        }}
      >
        Shown once. No shared secrets across your fleet.
      </div>
    </AbsoluteFill>
  );
};
