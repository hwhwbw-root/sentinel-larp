import { Easing } from "remotion";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Apple-style expo-out — a fast decisive start that settles softly, per
// remotion-dev/skills' timing guidance (bezier/spring over plain linear).
export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Every cut between scenes is a real @remotion/transitions crossfade/slide,
// not a hand-rolled double-opacity hack — this is what keeps the film moving
// instead of hard-cutting between static holds.
export const TRANSITION_DURATION = 18;

const RAW_SCENES = [
  { id: "coldOpen", duration: 210 }, // "Some risks you can smell. Others, you can't."
  { id: "titleCard", duration: 130 }, // Sentinel logo + wordmark
  { id: "hardwareReveal", duration: 390 }, // ESP32, CO2-or-H2, temp+humidity+10s reporting
  { id: "dashboardReveal", duration: 330 }, // Real Overview: sidebar/header chrome + 3-column bento
  { id: "alerts", duration: 270 }, // Same dashboard, a reading spikes into the real "DANGEROUS" alert card
  { id: "history", duration: 240 }, // Real Data History: filter card + Data Preview table
  { id: "security", duration: 270 }, // Real Add Device -> "Device API key" one-time reveal
  { id: "access", duration: 210 }, // Viewer / Admin / Superadmin, server-enforced RBAC
  { id: "recapMontage", duration: 330 }, // Rapid-fire recap
  { id: "outro", duration: 180 }, // Logo + closing line
] as const;

export type SceneId = (typeof RAW_SCENES)[number]["id"];

// Mirrors how @remotion/transitions' <TransitionSeries> actually positions
// children (each transition shifts the next sequence's start left by its own
// duration) — used here only to place audio cues at the right absolute frame.
const buildTimeline = () => {
  let cursor = 0;
  const timeline = {} as Record<SceneId, { start: number; duration: number }>;

  RAW_SCENES.forEach((scene, i) => {
    const start = i === 0 ? 0 : cursor - TRANSITION_DURATION;
    timeline[scene.id] = { start, duration: scene.duration };
    cursor = start + scene.duration;
  });

  return { timeline, total: cursor };
};

const built = buildTimeline();
export const SCENES = built.timeline;
export const TOTAL_DURATION_IN_FRAMES = built.total;
export const SCENE_DURATIONS = RAW_SCENES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s.duration }),
  {} as Record<SceneId, number>,
);

// Dark stage the hardware and narrative text live on. Matches
// src/app/globals.css / apple-theme.ts's accent so the ad reads as the same
// product, not a re-skin.
export const COLORS = {
  background: "#09090b",
  surface: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.12)",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.62)",
  textTertiary: "rgba(255,255,255,0.38)",
  accent: "#2f6fed",
  accentSoft: "rgba(47,111,237,0.20)",
  hazardAmber: "#f59e0b",
  hazardRed: "#ef4444",
  emeraldLive: "#10b981",
};

// Pulled live from the running app (localhost:3000) on 2026-09-20 — token
// values, copy, layout and component chrome are matched to what actually
// renders, not to DESIGN.md prose alone.
export const LIGHT = {
  background: "#fafafa",
  sidebar: "#ffffff",
  surface: "#ffffff",
  border: "#e4e4e7",
  borderSubtle: "rgba(228,228,231,0.6)",
  textPrimary: "#18181b",
  textSecondary: "#71717a",
  textMuted: "#a1a1aa",
  accent: "#2f6fed",
  accentLight: "#eff6ff",
  accentBorder: "rgba(47,111,237,0.20)",
  hazardRed: "#ef4444",
  hazardRedBg: "#fef2f2",
  hazardRedBorder: "#fecaca",
  hazardRedText: "#b91c1c",
  hazardAmber: "#f59e0b",
  hazardAmberBg: "#fffbeb",
  hazardAmberBorder: "#fde68a",
  hazardAmberText: "#b45309",
  emeraldLive: "#10b981",
  emeraldLiveBg: "#ecfdf5",
  emeraldLiveBorder: "#a7f3d0",
  emeraldLiveText: "#047857",
  purple: "#7c3aed",
  purpleBg: "#f5f3ff",
};

export const FONT_FAMILY =
  "'Satoshi', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
