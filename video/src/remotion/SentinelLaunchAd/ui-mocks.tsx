import { Database, History as HistoryIcon, LayoutGrid, Users } from "lucide-react";
import React from "react";
import { Img, staticFile } from "remotion";
import { FONT_FAMILY, LIGHT } from "./theme";

// Every component in this file is a faithful miniature of the REAL Sentinel
// app UI, pulled live from the running app (localhost:3000, Superadmin
// session) on 2026-09-20 — same sidebar, header, copy, and layout, not an
// invented "cinematic" reskin.

const NAV_ITEMS: { label: string; Icon: typeof LayoutGrid }[] = [
  { label: "Overview", Icon: LayoutGrid },
  { label: "Data History", Icon: HistoryIcon },
  { label: "Device Management", Icon: Database },
  { label: "User Access", Icon: Users },
];

export const AppShell: React.FC<{
  width: number;
  height: number;
  activeNav: string;
  pageTitle: string;
  pageSubtitle: string;
  children: React.ReactNode;
}> = ({ width, height, activeNav, pageTitle, pageSubtitle, children }) => {
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        backgroundColor: LIGHT.background,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${LIGHT.border}`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 10px 40px rgba(0,0,0,0.35)",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          width: 200,
          flexShrink: 0,
          backgroundColor: LIGHT.sidebar,
          borderRight: `1px solid ${LIGHT.borderSubtle}`,
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 6px 18px",
          }}
        >
          <Img src={staticFile("branding/sentinel-logo.svg")} style={{ width: 20, height: 20 }} />
          <span
            style={{
              fontWeight: 900,
              letterSpacing: 1.5,
              fontSize: 14,
              color: LIGHT.textPrimary,
            }}
          >
            SENTINEL
          </span>
        </div>
        {NAV_ITEMS.map(({ label, Icon }) => {
          const active = label === activeNav;
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 10,
                backgroundColor: active ? LIGHT.accentLight : "transparent",
                color: active ? LIGHT.accent : LIGHT.textSecondary,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Icon size={15} />
              {label}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div
          style={{
            height: 52,
            flexShrink: 0,
            borderBottom: `1px solid ${LIGHT.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 22px",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: LIGHT.textPrimary }}>
              Superadmin
            </div>
            <div style={{ fontSize: 10, color: LIGHT.textMuted }}>Superadmin</div>
          </div>
        </div>
        <div style={{ padding: "22px 26px", flex: 1, minHeight: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: LIGHT.textPrimary }}>
            {pageTitle}
          </div>
          <div style={{ fontSize: 13, color: LIGHT.textSecondary, marginBottom: 16 }}>
            {pageSubtitle}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export const BentoStatTile: React.FC<{
  label: string;
  value: string;
  unit?: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  changeLabel?: string;
  changeGood?: boolean;
  live?: boolean;
  pulse?: number;
}> = ({ label, value, unit, Icon, changeLabel, changeGood, live, pulse = 1 }) => {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 18,
        padding: 18,
        backgroundColor: LIGHT.surface,
        border: `1px solid ${LIGHT.borderSubtle}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          <Icon size={15} color={LIGHT.accent} />
          {label}
        </div>
        {live ? (
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: LIGHT.emeraldLive,
              opacity: 0.5 + pulse * 0.5,
              boxShadow: `0 0 ${4 + pulse * 6}px ${LIGHT.emeraldLive}`,
            }}
          />
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 5,
          color: LIGHT.textPrimary,
        }}
      >
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -1,
          }}
        >
          {value}
        </span>
        {unit ? (
          <span style={{ fontSize: 15, fontWeight: 600, color: LIGHT.textMuted }}>{unit}</span>
        ) : null}
      </div>
      {changeLabel ? (
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: changeGood ? LIGHT.emeraldLiveText : LIGHT.hazardRedText,
          }}
        >
          {changeLabel}
        </div>
      ) : null}
    </div>
  );
};

export const LineChartTile: React.FC<{
  title: string;
  drawProgress: number; // 0-1
  points: number[]; // normalized 0-1
  secondaryPoints?: number[];
  lineColor?: string;
  secondaryColor?: string;
}> = ({ title, drawProgress, points, secondaryPoints, lineColor = LIGHT.accent, secondaryColor = "#f59e0b" }) => {
  const w = 280;
  const h = 170;
  const toPath = (pts: number[]) =>
    pts
      .map((p, i) => {
        const x = (i / (pts.length - 1)) * w;
        const y = h - p * h;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div
      style={{
        flex: 1,
        borderRadius: 18,
        padding: 18,
        backgroundColor: LIGHT.surface,
        border: `1px solid ${LIGHT.borderSubtle}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: LIGHT.textPrimary }}>{title}</div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path
          d={toPath(points)}
          fill="none"
          stroke={lineColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawProgress}
        />
        {secondaryPoints ? (
          <path
            d={toPath(secondaryPoints)}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - drawProgress}
          />
        ) : null}
      </svg>
    </div>
  );
};

export const AlertListItem: React.FC<{
  time: string;
  message: string;
  device: string;
  glow?: number;
}> = ({ time, message, device, glow = 0 }) => (
  <div
    style={{
      borderRadius: 12,
      padding: "10px 12px",
      backgroundColor: LIGHT.hazardRedBg,
      border: `1px solid ${LIGHT.hazardRedBorder}`,
      boxShadow: glow ? `0 0 ${8 + glow * 16}px ${LIGHT.hazardRed}33` : "none",
      display: "flex",
      flexDirection: "column",
      gap: 3,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: LIGHT.hazardRedText }}>
        DANGEROUS
      </span>
      <span style={{ fontSize: 10, color: LIGHT.textMuted }}>{time}</span>
    </div>
    <div style={{ fontSize: 12.5, fontWeight: 600, color: LIGHT.hazardRedText, lineHeight: 1.35 }}>
      {message}
    </div>
    <div style={{ fontSize: 10.5, color: LIGHT.textMuted }}>{device}</div>
  </div>
);

export const AlertListTile: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      flex: 1,
      borderRadius: 18,
      padding: 16,
      backgroundColor: LIGHT.surface,
      border: `1px solid ${LIGHT.borderSubtle}`,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      minWidth: 0,
    }}
  >
    <div style={{ fontSize: 14, fontWeight: 700, color: LIGHT.textPrimary }}>Recent Alerts</div>
    {children}
  </div>
);

export const FilterCard: React.FC<{
  device: string;
  dateRange: string;
}> = ({ device, dateRange }) => (
  <div
    style={{
      borderRadius: 16,
      padding: 18,
      backgroundColor: LIGHT.surface,
      border: `1px solid ${LIGHT.borderSubtle}`,
      display: "flex",
      alignItems: "flex-end",
      gap: 18,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: LIGHT.textSecondary }}>Select Device</span>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: LIGHT.textPrimary,
          border: `1px solid ${LIGHT.borderSubtle}`,
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        {device}
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: LIGHT.textSecondary }}>Date Range</span>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: LIGHT.textPrimary,
          border: `1px solid ${LIGHT.borderSubtle}`,
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        {dateRange}
      </div>
    </div>
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#fff",
        backgroundColor: LIGHT.accent,
        borderRadius: 8,
        padding: "9px 16px",
      }}
    >
      Load Data
    </div>
  </div>
);

export const DataPreviewTable: React.FC<{
  rows: { time: string; gas: string; temp: string; humidity: string; danger?: boolean }[];
}> = ({ rows }) => (
  <div
    style={{
      borderRadius: 16,
      backgroundColor: LIGHT.surface,
      border: `1px solid ${LIGHT.borderSubtle}`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 18px",
        borderBottom: `1px solid ${LIGHT.borderSubtle}`,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color: LIGHT.textPrimary }}>Data Preview</span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: LIGHT.textPrimary,
          border: `1px solid ${LIGHT.borderSubtle}`,
          borderRadius: 8,
          padding: "6px 12px",
        }}
      >
        Export CSV
      </span>
    </div>
    <div
      style={{
        display: "flex",
        padding: "8px 18px",
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.4,
        color: LIGHT.textMuted,
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 110 }}>Timestamp</span>
      <span style={{ flex: 1 }}>Gas Value (ppm)</span>
      <span style={{ width: 90 }}>Temp (C)</span>
      <span style={{ width: 100 }}>Humidity (%)</span>
    </div>
    {rows.map((r, i) => (
      <div
        key={`${r.time}-${r.gas}-${i}`}
        style={{
          display: "flex",
          padding: "10px 18px",
          fontSize: 13,
          borderTop: `1px solid ${LIGHT.borderSubtle}`,
          color: r.danger ? LIGHT.hazardRedText : LIGHT.textPrimary,
          fontWeight: r.danger ? 700 : 500,
        }}
      >
        <span style={{ width: 110, color: LIGHT.textMuted, fontWeight: 500 }}>{r.time}</span>
        <span style={{ flex: 1, fontVariantNumeric: "tabular-nums" }}>{r.gas}</span>
        <span style={{ width: 90, fontVariantNumeric: "tabular-nums" }}>{r.temp}</span>
        <span style={{ width: 100, fontVariantNumeric: "tabular-nums" }}>{r.humidity}</span>
      </div>
    ))}
  </div>
);

export const DeviceTable: React.FC<{
  rows: { id: string; type: string; status: "Active" | "Offline" }[];
}> = ({ rows }) => (
  <div
    style={{
      borderRadius: 16,
      backgroundColor: LIGHT.surface,
      border: `1px solid ${LIGHT.borderSubtle}`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        padding: "10px 18px",
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.4,
        color: LIGHT.textMuted,
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 160 }}>Box ID</span>
      <span style={{ width: 90 }}>Status</span>
      <span style={{ flex: 1 }}>Type</span>
    </div>
    {rows.map((r) => (
      <div
        key={r.id}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 18px",
          fontSize: 13,
          fontWeight: 600,
          color: LIGHT.textPrimary,
          borderTop: `1px solid ${LIGHT.borderSubtle}`,
        }}
      >
        <span style={{ width: 160 }}>{r.id}</span>
        <span
          style={{
            width: 90,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: r.status === "Active" ? LIGHT.emeraldLiveText : LIGHT.textMuted,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: r.status === "Active" ? LIGHT.emeraldLive : LIGHT.textMuted,
            }}
          />
          {r.status}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 12,
            border: `1px solid ${LIGHT.borderSubtle}`,
            borderRadius: 6,
            padding: "3px 8px",
            width: "fit-content",
            color: LIGHT.textSecondary,
          }}
        >
          {r.type}
        </span>
      </div>
    ))}
  </div>
);

export const ApiKeyModal: React.FC<{ deviceName: string; reveal: number }> = ({
  deviceName,
  reveal,
}) => {
  const chars = "sk_device_9a7db8b7bc1f001d8ca38b3746a612a9aae8e1113";
  const shown = Math.floor(reveal * chars.length);

  return (
    <div
      style={{
        borderRadius: 18,
        padding: 22,
        backgroundColor: LIGHT.surface,
        border: `1px solid ${LIGHT.borderSubtle}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: 480,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, color: LIGHT.textPrimary }}>
        Device API key for {deviceName}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: LIGHT.hazardAmberText, lineHeight: 1.5 }}>
        Copy this now — it will not be shown again.
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 13,
          letterSpacing: 0.3,
          color: LIGHT.accent,
          backgroundColor: LIGHT.background,
          border: `1px solid ${LIGHT.borderSubtle}`,
          borderRadius: 10,
          padding: "12px 14px",
          wordBreak: "break-all",
        }}
      >
        {chars.slice(0, shown)}
        <span style={{ opacity: 0.3 }}>{chars.slice(shown)}</span>
      </div>
    </div>
  );
};

export const RolePillBadge: React.FC<{ role: string }> = ({ role }) => (
  <span
    style={{
      fontSize: 12,
      fontWeight: 700,
      color: LIGHT.purple,
      backgroundColor: LIGHT.purpleBg,
      borderRadius: 999,
      padding: "4px 12px",
      width: "fit-content",
    }}
  >
    {role}
  </span>
);

export const RoleCard: React.FC<{
  role: string;
  capability: string;
}> = ({ role, capability }) => (
  <div
    style={{
      borderRadius: 18,
      padding: "20px 22px",
      backgroundColor: LIGHT.surface,
      border: `1px solid ${LIGHT.borderSubtle}`,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      width: 260,
    }}
  >
    <RolePillBadge role={role} />
    <div style={{ fontSize: 14, fontWeight: 500, color: LIGHT.textSecondary, lineHeight: 1.4 }}>
      {capability}
    </div>
  </div>
);
