export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_DURATION_IN_FRAMES = 2700; // 90.0 seconds at 30fps

export const SCENES = {
  HOOK: {
    start: 0,
    duration: 285, // 0.0s - 9.5s (extended by 0.5s for narrative pacing)
    name: "01-Hook",
  },
  TURN_BRAND: {
    start: 285,
    duration: 150, // 9.5s - 14.5s (5.0s minimal Apple commercial reveal)
    name: "02-TurnBrand",
  },
  DANGER_SPIKE: {
    start: 435,
    duration: 375, // 14.5s - 27.0s (1,686 ppm Danger Breach live demonstration)
    name: "03-DangerSpike",
  },
  REALTIME_TELEMETRY: {
    start: 810,
    duration: 300, // 27.0s - 37.0s
    name: "04-RealtimeTelemetry",
  },
  ALERT_ENGINE: {
    start: 1110,
    duration: 300, // 37.0s - 47.0s
    name: "05-AlertEngine",
  },
  FLEET_SCALE: {
    start: 1410,
    duration: 300, // 47.0s - 57.0s
    name: "06-FleetScale",
  },
  COMPLIANCE_AUDIT: {
    start: 1710,
    duration: 300, // 57.0s - 67.0s
    name: "07-ComplianceAudit",
  },
  ARCHITECTURE_BENTO: {
    start: 2010,
    duration: 360, // 67.0s - 79.0s
    name: "08-ArchitectureBento",
  },
  OUTRO_PITCH: {
    start: 2370,
    duration: 210, // 79.0s - 86.0s
    name: "09-OutroPitch",
  },
  REAL_OUTRO: {
    start: 2580,
    duration: 120, // 86.0s - 90.0s
    name: "10-RealOutro",
  },
} as const;

export const THEME = {
  bg: "#000000",
  textPrimary: "#ffffff",
  textMuted: "#86868b",
  accentBlue: "#2f6fed",
  accentCyan: "#38bdf8",
  hazardRed: "#ef4444",
  hazardAmber: "#f59e0b",
  emeraldLive: "#10b981",
  purpleAccent: "#a855f7",
};
