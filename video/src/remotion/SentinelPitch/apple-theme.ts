import { loadFont as loadLocalFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { loadFont as loadGoogleFont } from "@remotion/google-fonts/Inter";

// Ensure Satoshi variable font is loaded and parsed so no font-swap flicker occurs
export const satoshiLoaded = loadLocalFont({
  family: "Satoshi",
  url: staticFile("fonts/Satoshi-Variable.woff2"),
  weight: "300 900",
  style: "normal",
});

// Load Inter with full weight spectrum as high-quality fallback
export const { fontFamily: interFamily } = loadGoogleFont("normal", {
  subsets: ["latin"],
  weights: ["300", "400", "500", "600", "700", "800", "900"],
});

// App font stack: Satoshi (genuine app font) with Inter / System fallback
export const APP_FONT_FAMILY = `'Satoshi', ${interFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
export const APPLE_FONT_FAMILY = APP_FONT_FAMILY;

// Signature spring animation physics
export const APPLE_SPRINGS = {
  // Snappy for buttons, badges, small UI alerts
  snappy: { damping: 22, stiffness: 220, mass: 0.8 },
  // Smooth for large cards, windows, macro panels
  smooth: { damping: 26, stiffness: 180, mass: 1.0 },
  // Heavy & dramatic for hero titles, camera moves
  dramatic: { damping: 30, stiffness: 150, mass: 1.2 },
  // Subtle bounce for notifications and pills
  pop: { damping: 18, stiffness: 260, mass: 0.7 },
};

// 100% Genuine Sentinel App Color System (matching src/app/globals.css & src/components/)
export const APP_COLORS = {
  // Canvas & Page Background: zinc-50 / #fafafa
  background: "#fafafa",
  // Foreground: zinc-900 / #18181b
  foreground: "#18181b",
  // Pure Card Surface
  surface: "#ffffff",
  surfaceMuted: "#f4f4f5", // zinc-100

  // Subtle Borders matching BentoCard & AppShell: border-zinc-200/60
  border: "#e4e4e7", // zinc-200
  borderSubtle: "rgba(228, 228, 231, 0.6)", // zinc-200/60

  // Typography
  textPrimary: "#18181b", // zinc-900
  textSecondary: "#71717a", // zinc-500
  textMuted: "#a1a1aa", // zinc-400

  // Sentinel Brand Accent (electric blue, desaturated: #2f6fed)
  accent: "#2f6fed",
  accentForeground: "#ffffff",
  accentLight: "#eff6ff", // blue-50
  accentBorder: "rgba(47, 111, 237, 0.20)",
  accentSubtle: "rgba(47, 111, 237, 0.08)",

  // Level 2 Danger / Critical
  hazardRed: "#ef4444", // red-500
  hazardRedBg: "#fef2f2", // red-50
  hazardRedBorder: "#fecaca", // red-200
  hazardRedText: "#b91c1c", // red-700

  // Level 1 Warning / Alert
  hazardAmber: "#f59e0b", // amber-500
  hazardAmberBg: "#fffbeb", // amber-50
  hazardAmberBorder: "#fde68a", // amber-200
  hazardAmberText: "#b45309", // amber-700

  // Live / Nominal Safe
  emeraldLive: "#10b981", // emerald-500
  emeraldLiveBg: "#ecfdf5", // emerald-50
  emeraldLiveBorder: "#a7f3d0", // emerald-200
  emeraldLiveText: "#047857", // emerald-700
};

// Aliased for seamless compatibility across existing scenes
export const APPLE_COLORS = {
  studioBg: APP_COLORS.background,
  studioDarkBg: "#09090b",
  obsidian: "#18181b",
  textPrimary: APP_COLORS.textPrimary,
  textSecondary: APP_COLORS.textSecondary,
  textDarkPrimary: "#ffffff",
  textDarkSecondary: APP_COLORS.textMuted,
  accentBlue: APP_COLORS.accent,
  accentCyan: APP_COLORS.accent,
  hazardRed: APP_COLORS.hazardRed,
  hazardAmber: APP_COLORS.hazardAmber,
  emeraldLive: APP_COLORS.emeraldLive,
  glassBorder: APP_COLORS.borderSubtle,
  glassLightBorder: APP_COLORS.border,
};
