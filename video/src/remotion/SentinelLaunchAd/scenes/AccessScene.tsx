import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { beatOpacity, beatRise } from "../beat";
import { COLORS, FONT_FAMILY } from "../theme";
import { RoleCard } from "../ui-mocks";

// Straight from README.md's Roles section — real, server-enforced RBAC.
const ROLES = [
  { role: "Viewer", capability: "Read-only across the dashboard." },
  { role: "Admin", capability: "Edits devices and thresholds." },
  { role: "Superadmin", capability: "Controls devices and access." },
];

export const AccessScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: beatOpacity(frame, 0, 80, { fadeIn: 14, fadeOut: 18 }),
          fontFamily: FONT_FAMILY,
          fontSize: 38,
          fontWeight: 800,
          color: COLORS.textPrimary,
          letterSpacing: -0.5,
          maxWidth: 900,
        }}
      >
        Everyone sees only what they should.
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {ROLES.map((r, i) => {
          const start = 40 + i * 16;
          const op = beatOpacity(frame, start, durationInFrames - start - 15, {
            fadeIn: 14,
            fadeOut: 18,
          });
          const y = beatRise(frame, start, durationInFrames - start - 15, {
            fadeIn: 16,
            distance: 20,
          });
          return (
            <div key={r.role} style={{ opacity: op, transform: `translateY(${y}px)` }}>
              <RoleCard role={r.role} capability={r.capability} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          textAlign: "center",
          opacity: beatOpacity(frame, 150, durationInFrames - 165, { fadeIn: 16, fadeOut: 18 }),
          fontFamily: FONT_FAMILY,
          fontSize: 22,
          fontWeight: 600,
          color: COLORS.textSecondary,
        }}
      >
        Enforced on the server — not just hidden in the UI.
      </div>
    </AbsoluteFill>
  );
};
