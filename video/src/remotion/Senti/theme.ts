export const SENTI_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", -system-ui, sans-serif';

export const SENTI_MONO_FAMILY =
  '"SF Mono", "JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';

export const SENTI_COLORS = {
  accentBlue: "#2f6fed",
  accentBlueDark: "#1a53c9",
  accentBlueLight: "#dbe8fe",
  glowCyan: "#38bdf8",
  dangerRed: "#ef4444",
  dangerRedLight: "#fee2e2",
  warningAmber: "#f59e0b",
  successGreen: "#10b981",
  zinc50: "#fafafa",
  zinc100: "#f4f4f5",
  zinc200: "#e4e4e7",
  zinc300: "#d4d4d8",
  zinc400: "#a1a1aa",
  zinc600: "#52525b",
  zinc800: "#27272a",
  zinc900: "#18181b",
  zinc950: "#09090b",
  navyDark: "#030e24",
  navyMid: "#082154",
};

export const SENTI_GRADIENTS = {
  // The iconic Numtera 13s radiant blue sky bloom
  luminousSky:
    "radial-gradient(circle at 50% 60%, #e0f2fe 0%, #60a5fa 45%, #2563eb 90%)",
  luminousSkySoft:
    "radial-gradient(circle at 50% 50%, rgba(224, 242, 254, 0.95) 0%, rgba(147, 197, 253, 0.6) 50%, rgba(37, 99, 235, 0.9) 100%)",
  // High-end dark navy depth
  deepNavy:
    "radial-gradient(circle at 50% 40%, #0b224d 0%, #030d22 75%, #020712 100%)",
  // Minimalist crisp light canvas
  cleanCanvas:
    "radial-gradient(circle at 50% 45%, #ffffff 0%, #f8fafc 60%, #eef2f6 100%)",
};

export const SENTI_SPRINGS = {
  snappy: { damping: 18, mass: 0.6, stiffness: 220 },
  smooth: { damping: 24, mass: 0.9, stiffness: 140 },
  cinematic: { damping: 28, mass: 1.1, stiffness: 100 },
  bouncy: { damping: 12, mass: 0.5, stiffness: 240 },
};
