import { Wind } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { beatOpacity, beatRise } from "../beat";
import { COLORS, FONT_FAMILY, LIGHT } from "../theme";
import { AlertListItem, AlertListTile } from "../ui-mocks";

// Thresholds are illustrative for the demo climb — the real product has no
// fixed limit baked in; every device's thresholds are admin-configured
// (Device Management: Alert Threshold / Dangerous Threshold columns).
const CLIMB_START = 30;
const CLIMB_END = 160;
const VALUE_START = 420;
const VALUE_END = 1748.88; // real figure pulled from the app's own alert copy

export const ALERT_TRIGGER_FRAME = 150;

export const AlertsScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(frame, [CLIMB_START, CLIMB_END], [VALUE_START, VALUE_END], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const danger = value >= 1500;
  const glow = danger ? Math.sin(frame / 30) * 0.5 + 0.5 : 0;

  const stageOpacity = beatOpacity(frame, 20, durationInFrames - 35, { fadeIn: 16, fadeOut: 18 });
  const stageY = beatRise(frame, 20, durationInFrames - 35, { fadeIn: 18, distance: 22 });

  const cardOpacity = beatOpacity(frame, ALERT_TRIGGER_FRAME, durationInFrames - ALERT_TRIGGER_FRAME - 15, {
    fadeIn: 10,
    fadeOut: 20,
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
          top: 130,
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
        Thresholds you set.
      </div>

      <div style={{ opacity: stageOpacity, transform: `translateY(${stageY}px)`, display: "flex", gap: 24 }}>
        <div
          style={{
            width: 300,
            borderRadius: 20,
            padding: 20,
            backgroundColor: LIGHT.surface,
            border: `1px solid ${danger ? LIGHT.hazardRedBorder : LIGHT.borderSubtle}`,
            boxShadow: danger ? `0 0 ${10 + glow * 20}px ${LIGHT.hazardRed}33` : "none",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontFamily: FONT_FAMILY,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: LIGHT.textSecondary,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Wind size={15} color={LIGHT.accent} />
            CO2 Level
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 5,
              color: danger ? LIGHT.hazardRedText : LIGHT.textPrimary,
            }}
          >
            <span style={{ fontSize: 48, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: -1 }}>
              {Math.round(value)}
            </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: LIGHT.textMuted }}>ppm</span>
          </div>
        </div>

        <div style={{ width: 320, opacity: cardOpacity }}>
          <AlertListTile>
            <AlertListItem
              time="6:36:04 PM"
              message={`DANGEROUS: CO2 level at ${VALUE_END} ppm exceeds danger threshold`}
              device="mocksense-0"
              glow={glow}
            />
          </AlertListTile>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: beatOpacity(frame, ALERT_TRIGGER_FRAME + 20, durationInFrames - ALERT_TRIGGER_FRAME - 40, {
            fadeIn: 16,
            fadeOut: 20,
          }),
          fontFamily: FONT_FAMILY,
          fontSize: 24,
          fontWeight: 600,
          color: COLORS.textSecondary,
        }}
      >
        Alerts within seconds — not buried in a report.
      </div>
    </AbsoluteFill>
  );
};
