import React from "react";
import {
  LayoutDashboard,
  History,
  HardDrive,
  Users,
  Wind,
  Thermometer,
  Droplets,
  Activity,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Download,
  KeyRound,
  Check,
} from "lucide-react";
import { staticFile, useCurrentFrame, Img } from "remotion";
import { APPLE_FONT_FAMILY } from "../apple-theme";

export interface GenuineAppWindowProps {
  page?: "dashboard" | "danger" | "devices" | "analytics";
  gasValue?: number;
  tempValue?: string;
  humidityValue?: string;
  chartProgress?: number; // 0 to 100
  activeRange?: "10m" | "30m" | "1h";
  className?: string;
  style?: React.CSSProperties;
}

function getSmoothSpline(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export const GenuineAppWindow: React.FC<GenuineAppWindowProps> = ({
  page = "dashboard",
  gasValue = 524,
  tempValue = "24.4",
  humidityValue = "48.1",
  chartProgress = 85,
  activeRange = "10m",
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDanger = page === "danger" || gasValue >= 1500;
  const pulse = Math.sin(frame * 0.25) * 0.5 + 0.5;
  const pingPhase = (frame % 30) / 30;

  // Helper to map ppm to Y coordinate in the 0-200 viewBox (400ppm -> 150, 1500ppm -> 50, 1700ppm -> 26)
  const ppmToY = (ppm: number) => {
    const clamped = Math.max(350, Math.min(1850, ppm));
    return 150 - ((clamped - 400) / 1100) * 100;
  };

  // Base nominal noise for initial points
  const p0_ppm = 418;
  const p1_ppm = 422 + Math.sin(frame * 0.08) * 2;
  const p2_ppm = 416 + Math.cos(frame * 0.08) * 2;
  const p3_ppm = 425;
  const delta = Math.max(0, gasValue - 425);
  const p4_ppm = 425 + delta * 0.08;
  const p5_ppm = 425 + delta * 0.22;
  const p6_ppm = 425 + delta * 0.48;
  const p7_ppm = 425 + delta * 0.78;
  const p8_ppm = gasValue;

  const points = [
    { x: 30, y: ppmToY(p0_ppm), ppm: Math.round(p0_ppm), t: "14:28:00" },
    { x: 120, y: ppmToY(p1_ppm), ppm: Math.round(p1_ppm), t: "14:28:04" },
    { x: 210, y: ppmToY(p2_ppm), ppm: Math.round(p2_ppm), t: "14:28:08" },
    { x: 300, y: ppmToY(p3_ppm), ppm: Math.round(p3_ppm), t: "14:28:12" },
    { x: 390, y: ppmToY(p4_ppm), ppm: Math.round(p4_ppm), t: "14:28:16" },
    { x: 480, y: ppmToY(p5_ppm), ppm: Math.round(p5_ppm), t: "14:28:20" },
    { x: 570, y: ppmToY(p6_ppm), ppm: Math.round(p6_ppm), t: "14:28:24" },
    { x: 660, y: ppmToY(p7_ppm), ppm: Math.round(p7_ppm), t: "14:28:28" },
    { x: 750, y: ppmToY(p8_ppm), ppm: Math.round(p8_ppm), t: "14:28:32" },
  ];

  const activeIndex = chartProgress !== undefined
    ? Math.min(points.length - 1, Math.max(0, Math.floor((chartProgress / 100) * points.length)))
    : points.length - 1;
  const activePt = isDanger ? points[points.length - 1] : points[activeIndex];

  const pathD = getSmoothSpline(points);
  const areaD = `${pathD} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`;

  // Dynamic stroke & gradient color shifting from Blue -> Amber -> Red
  const strokeColor = isDanger
    ? "#ef4444"
    : gasValue > 1000
    ? "#f59e0b"
    : "#2f6fed";

  return (
    <div
      className={`w-[1180px] h-[660px] bg-white rounded-2xl border-2 border-zinc-200/80 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden select-none ${className}`}
      style={{
        fontFamily: APPLE_FONT_FAMILY,
        ...style,
      }}
    >
      {/* Window Title Bar */}
      <div className="h-10 bg-zinc-100 border-b border-zinc-200/80 px-4 flex items-center justify-between shrink-0">
        {/* macOS Traffic Lights */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>

        {/* Console Title Bar Pill */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-md bg-white border border-zinc-200 text-xs font-mono text-zinc-600 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-zinc-800">Sentinel Safety Console</span>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-500">{page === "devices" ? "devices" : page === "analytics" ? "analytics" : page === "danger" ? "emergency" : "dashboard"}</span>
        </div>

        <div className="w-14" />
      </div>

      {/* Main Body (AppShell layout) */}
      <div className="flex-1 flex overflow-hidden">
        {/* AppShell Sidebar */}
        <aside className="w-56 bg-white border-r border-zinc-200/80 flex flex-col justify-between shrink-0 p-4">
          <div>
            {/* Sentinel App Branding */}
            <div className="flex items-center gap-2.5 px-2 mb-6">
              <Img
                src={staticFile("branding/sentinel-logo.svg")}
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-extrabold text-base tracking-wider text-zinc-900">
                SENTINEL
              </span>
            </div>

            {/* Navigation Items matching AppShell.tsx */}
            <nav className="space-y-1 text-sm">
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium ${
                  page === "dashboard" || page === "danger"
                    ? "bg-[#2f6fed]/10 text-[#2f6fed] font-bold"
                    : "text-zinc-600"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Overview</span>
              </div>

              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium ${
                  page === "analytics"
                    ? "bg-[#2f6fed]/10 text-[#2f6fed] font-bold"
                    : "text-zinc-600"
                }`}
              >
                <History size={18} />
                <span>Data History</span>
              </div>

              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium ${
                  page === "devices"
                    ? "bg-[#2f6fed]/10 text-[#2f6fed] font-bold"
                    : "text-zinc-600"
                }`}
              >
                <HardDrive size={18} />
                <span>Devices</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-zinc-600">
                <Users size={18} />
                <span>User Access</span>
              </div>
            </nav>
          </div>

          {/* User Badge */}
          <div className="pt-4 border-t border-zinc-100 flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-[#2f6fed]/10 border border-[#2f6fed]/20 flex items-center justify-center font-bold text-xs text-[#2f6fed]">
              SA
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Security Admin</div>
              <div className="text-[10px] text-zinc-400">Superadmin</div>
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 bg-[#fafafa] p-6 flex flex-col justify-between overflow-hidden">
          {/* ===================== PAGE: DASHBOARD / DANGER ===================== */}
          {(page === "dashboard" || page === "danger") && (
            <>
              {/* Header Bar matching DashboardClient.tsx */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                      Real-time Monitoring
                    </h2>
                    <p className="text-xs text-zinc-500">Overview of environmental metrics</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Device Selector */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-800 shadow-sm">
                      <span>mocksense-0 (Bay 1 — Mixing)</span>
                      <span className="text-zinc-300">|</span>
                      <div className="flex gap-1">
                        {(["10m", "30m", "1h"] as const).map((r) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              activeRange === r
                                ? "bg-[#2f6fed]/10 text-[#2f6fed]"
                                : "text-zinc-400"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Live Status Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`absolute inline-flex h-full w-full rounded-full ${isDanger ? "bg-red-400" : "bg-emerald-400"}`}
                          style={{
                            transform: `scale(${1 + pingPhase * 0.8})`,
                            opacity: (1 - pingPhase) * 0.75,
                          }}
                        />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isDanger ? "bg-red-500" : "bg-emerald-500"}`} />
                      </span>
                      <span className={`font-bold ${isDanger ? "text-red-600" : "text-emerald-700"}`}>
                        {isDanger ? "Level 2 Critical" : "Live"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Critical Alert Banner if in Danger mode */}
                {isDanger && (
                  <div
                    className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-800 shadow-sm"
                    style={{
                      opacity: 0.85 + pulse * 0.15,
                    }}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <AlertTriangle size={16} className="text-red-600" />
                      <span>DANGEROUS: CO₂ level at {gasValue.toLocaleString()} ppm exceeds danger threshold (1,500 ppm)</span>
                    </div>
                    <span className="font-mono text-[11px] text-red-600 font-semibold">
                      Onboard Buzzer Active & Critical Alert Dispatched
                    </span>
                  </div>
                )}

                {/* 3 Metric BentoCards matching MetricCard component in DashboardClient.tsx */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* CO2 MetricCard */}
                  <div
                    className={`bg-white border rounded-2xl p-4 shadow-sm ${
                      isDanger
                        ? "border-red-300 bg-red-50/70 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                        : gasValue > 1000
                        ? "border-amber-300 bg-amber-50/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : "border-zinc-200/80"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-zinc-500 text-xs font-medium">CO₂ Level</span>
                      <div className={`p-1.5 rounded-lg ${isDanger ? "bg-red-100 text-red-600" : gasValue > 1000 ? "bg-amber-100 text-amber-600" : "bg-zinc-100 text-zinc-600"}`}>
                        <Wind size={16} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 tabular-nums">
                      {gasValue.toLocaleString()} <span className="text-sm font-normal text-zinc-500">ppm</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[11px]">
                      {gasValue > 450 ? (
                        <span className={`${isDanger ? "text-rose-600 font-bold" : "text-amber-600 font-semibold"} flex items-center gap-0.5`}>
                          <ArrowUp size={12} /> +{Math.round(((gasValue - 418) / 418) * 100)}% {isDanger ? "Critical Spike" : "Rapid Escalation"}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                          <ArrowDown size={12} /> -2.4% vs last reading
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Temperature MetricCard */}
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-zinc-500 text-xs font-medium">Temperature</span>
                      <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600">
                        <Thermometer size={16} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 tabular-nums">
                      {tempValue}°C
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                      Optimal ±0.2°C stability
                    </div>
                  </div>

                  {/* Humidity MetricCard */}
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-zinc-500 text-xs font-medium">Relative Humidity</span>
                      <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600">
                        <Droplets size={16} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 tabular-nums">
                      {humidityValue}%
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                      Compliant (40–60% RH)
                    </div>
                  </div>
                </div>
              </div>

              {/* Genuine ChartCard with Recharts Area */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-zinc-900">
                    <Activity size={16} className={isDanger ? "text-red-500 animate-pulse" : "text-[#2f6fed]"} />
                    <span>CO₂ Trend (Real-Time Ingestion)</span>
                  </div>
                  <div className={`text-[11px] font-mono font-semibold ${isDanger ? "text-red-600" : "text-zinc-400"}`}>
                    THRESHOLD: 1,500 PPM
                  </div>
                </div>

                {/* SVG Curve recreating Recharts */}
                <div className="relative w-full h-[180px] bg-zinc-50/50 rounded-xl p-2 overflow-hidden">
                  <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="liveGasGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={isDanger ? 0.35 : 0.25} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    {/* Threshold Line */}
                    <line x1="0" y1="50" x2="800" y2="50" stroke={isDanger ? "#ef4444" : "#fca5a5"} strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="12" y="44" fill={isDanger ? "#ef4444" : "#f87171"} fontSize="10" fontWeight="bold" fontFamily="monospace">
                      CRITICAL 1,500 PPM
                    </text>

                    {/* Area & Stroke */}
                    <path d={areaD} fill="url(#liveGasGrad)" />
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Vertical tracking dashed line */}
                    <line
                      x1={activePt.x}
                      y1={activePt.y}
                      x2={activePt.x}
                      y2="190"
                      stroke={strokeColor}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      opacity={0.6}
                    />

                    {/* Active Scrubber Point with pulsing radar ping */}
                    <g transform={`translate(${activePt.x}, ${activePt.y})`}>
                      <circle
                        r={6 + pulse * 6}
                        fill={strokeColor}
                        opacity={(1 - pulse) * 0.75}
                      />
                      <circle
                        r="6"
                        fill={strokeColor}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      {/* Floating tooltip badge */}
                      <g transform="translate(0, -14)">
                        <rect
                          x="-34"
                          y="-18"
                          width="68"
                          height="18"
                          rx="4"
                          fill="#18181b"
                          opacity="0.92"
                        />
                        <text
                          x="0"
                          y="-6"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {Math.round(gasValue)} ppm
                        </text>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </>
          )}

          {/* ===================== PAGE: DEVICES ===================== */}
          {page === "devices" && (
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                      Device Fleet Management
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Configure connected hardware nodes, threshold triggers, and ingestion tokens
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#2f6fed] text-white text-xs font-bold shadow-sm">
                    + Add Device
                  </div>
                </div>

                {/* Device Table matching DeviceManagementClient.tsx */}
                <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm mb-4">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                      <tr>
                        <th className="p-3">Box ID / Alias</th>
                        <th className="p-3">Sensor Type</th>
                        <th className="p-3">Alert Threshold</th>
                        <th className="p-3">Danger Threshold</th>
                        <th className="p-3">Ingestion Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800">
                      <tr className="hover:bg-zinc-50/50">
                        <td className="p-3 font-semibold">mocksense-0 <span className="text-zinc-400 font-normal">(Bay 1 Mixing)</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-[#2f6fed] font-bold">CO₂</span></td>
                        <td className="p-3 font-mono">1,000 ppm</td>
                        <td className="p-3 font-mono text-red-600 font-bold">1,500 ppm</td>
                        <td className="p-3"><span className="text-emerald-600 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" style={{ opacity: 0.4 + pulse * 0.6 }} /> Online // Active</span></td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50">
                        <td className="p-3 font-semibold">mocksense-1 <span className="text-zinc-400 font-normal">(Bay 2 Storage)</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-[#2f6fed] font-bold">CO₂</span></td>
                        <td className="p-3 font-mono">1,000 ppm</td>
                        <td className="p-3 font-mono text-red-600 font-bold">1,500 ppm</td>
                        <td className="p-3"><span className="text-emerald-600 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" style={{ opacity: 0.4 + pulse * 0.6 }} /> Online // Active</span></td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50">
                        <td className="p-3 font-semibold">mocksense-2 <span className="text-zinc-400 font-normal">(Bay 3 Reactor)</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Hydrogen</span></td>
                        <td className="p-3 font-mono">500 ppm</td>
                        <td className="p-3 font-mono text-red-600 font-bold">1,000 ppm</td>
                        <td className="p-3"><span className="text-emerald-600 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" style={{ opacity: 0.4 + pulse * 0.6 }} /> Online // Active</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Secret API Key Card */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#2f6fed]">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Ingestion Secret Token</div>
                    <div className="text-xs font-mono text-zinc-500">sk_device_9f8a********</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <Check size={14} />
                  <span>Key Active</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================== PAGE: ANALYTICS ===================== */}
          {page === "analytics" && (
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                      Data History & Compliance Export
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Query historical time-series data and export facility audit logs
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <Download size={14} />
                    <span>Export CSV</span>
                  </div>
                </div>

                {/* Query Range BentoCard */}
                <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm mb-4 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[11px] text-zinc-400 font-medium uppercase">Target Facility Device</span>
                    <div className="text-sm font-bold text-zinc-800 mt-0.5">mocksense-0 (Bay 1)</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400 font-medium uppercase">Date Window</span>
                    <div className="text-sm font-bold text-zinc-800 mt-0.5">Last 30 Days (48,290 records)</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400 font-medium uppercase">Export Format</span>
                    <div className="text-xs font-mono text-emerald-700 font-bold mt-0.5">RFC 4180 CSV Ready</div>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                      <tr>
                        <th className="p-3">Timestamp (UTC)</th>
                        <th className="p-3">Gas (ppm)</th>
                        <th className="p-3">Temp (°C)</th>
                        <th className="p-3">Humidity (%)</th>
                        <th className="p-3">Regulatory Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800">
                      <tr>
                        <td className="p-3 font-mono text-zinc-500">2026-10-31 14:28:32</td>
                        <td className="p-3 font-mono font-bold text-red-600">1,686</td>
                        <td className="p-3 font-mono">24.4</td>
                        <td className="p-3 font-mono">48.1</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">DANGEROUS // RESOLVED</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-zinc-500">2026-10-31 14:28:20</td>
                        <td className="p-3 font-mono">435</td>
                        <td className="p-3 font-mono">24.2</td>
                        <td className="p-3 font-mono">48.0</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">SAFE</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-zinc-500">2026-10-31 14:28:00</td>
                        <td className="p-3 font-mono">418</td>
                        <td className="p-3 font-mono">24.1</td>
                        <td className="p-3 font-mono">47.8</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">SAFE</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance Pass Footer */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>✓ Historical Facility Time-Series — Ready for Safety & Compliance Review</span>
                <span className="font-mono text-[11px]">ONE-CLICK CSV EXPORT</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
