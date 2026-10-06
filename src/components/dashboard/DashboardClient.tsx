"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Wind,
  Thermometer,
  Droplets,
  Activity,
  ArrowUp,
  ArrowDown,
  FlaskConical,
  X,
  PlusCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import type { Device, TimeRange } from "@/lib/types";
import { useEnvironmentPolling } from "@/hooks/useEnvironmentPolling";
import { useAllAlerts } from "@/hooks/useAllAlerts";
import { DEFAULT_THRESHOLDS } from "@/lib/alerts";
import { BentoCard } from "@/components/ui/BentoCard";
import { DemoPanel } from "@/components/dashboard/DemoPanel";
import { staggerContainer, fadeUpItem, breathingPulse, spring } from "@/lib/motion";
import { getLastSoundAt, playSound } from "@/lib/sounds";

interface DashboardClientProps {
  devices: Device[];
  demoEnabled?: boolean;
}

const TIME_RANGES: TimeRange[] = ["10m", "30m", "1h"];
const MANUAL_SOUND_GRACE_MS = 6000;

export function DashboardClient({ devices, demoEnabled = false }: DashboardClientProps) {
  const router = useRouter();
  const [selectedBoxId, setSelectedBoxId] = useState(devices[0]?.boxId ?? "");
  const [timeRange, setTimeRange] = useState<TimeRange>("10m");
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const lastLevel = useRef<{ boxId: string; level: number } | null>(null);
  const reduceMotion = useReducedMotion();

  const { data, latestData, deviceStatus, loading, refresh } = useEnvironmentPolling({
    boxId: selectedBoxId,
    timeRange,
    enabled: !!selectedBoxId,
  });

  useEffect(() => {
    if (!latestData) return;
    const previous = lastLevel.current;
    lastLevel.current = { boxId: selectedBoxId, level: latestData.alert };

    if (!soundEnabled || !previous || previous.boxId !== selectedBoxId) return;
    if (Date.now() - getLastSoundAt() < MANUAL_SOUND_GRACE_MS) return;

    if (latestData.alert > previous.level) {
      playSound(latestData.alert === 2 ? "danger" : "warning");
    } else if (latestData.alert === 0 && previous.level > 0) {
      playSound("clear");
    }
  }, [latestData, selectedBoxId, soundEnabled]);

  const hardwareBoxes = useMemo(
    () =>
      devices
        .filter((d) => !d.boxId.startsWith("demo-"))
        .map((d) => ({ boxId: d.boxId, label: d.alias || d.boxId })),
    [devices],
  );

  const handleDemoInjected = (boxId: string) => {
    if (!devices.some((d) => d.boxId === boxId)) router.refresh();
    if (boxId !== selectedBoxId) {
      setSelectedBoxId(boxId);
    } else {
      refresh();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound("normal");
  };

  const {
    alerts: allAlerts,
    loading: allAlertsLoading,
    loadingMore,
    error: allAlertsError,
    hasMore,
    loadMore,
  } = useAllAlerts({ boxId: selectedBoxId, enabled: isAlertsModalOpen && !!selectedBoxId });

  const selectedDevice = devices.find((d) => d.boxId === selectedBoxId);

  const currentAlerts = useMemo(
    () =>
      data
        .filter((point) => point.alert === 1 || point.alert === 2)
        .map((point) => ({
          id: point.id,
          boxId: point.boxId,
          level: point.alert === 2 ? ("Dangerous" as const) : ("Alert" as const),
          message:
            point.alert === 2
              ? `DANGEROUS: ${selectedDevice?.deviceType ?? "device"} level at ${point.gasValue} ppm exceeds danger threshold`
              : `ALERT: ${selectedDevice?.deviceType ?? "device"} level at ${point.gasValue} ppm exceeds alert threshold`,
          timestamp: point.createdAt,
        }))
        .reverse()
        .slice(0, 3),
    [data, selectedDevice],
  );

  const chartData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        time: new Date(point.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      })),
    [data],
  );

  const currentData = latestData
    ? {
        gasValue: latestData.gasValue,
        temperature: latestData.temperature ?? 0,
        humidity: latestData.humidity ?? 0,
      }
    : { gasValue: 0, temperature: 0, humidity: 0 };

  const prevPoint = chartData.length >= 2 ? chartData[chartData.length - 2] : null;

  const trend = (curr: number, prev: number | null) => {
    if (!prev) return { val: "0", dir: "up" as const, positive: true, isNa: true };
    const diff = ((curr - prev) / prev) * 100;
    return {
      val: Math.abs(diff).toFixed(1),
      dir: diff >= 0 ? ("up" as const) : ("down" as const),
      positive: diff < 0,
      isNa: false,
    };
  };

  const defaults = selectedDevice ? DEFAULT_THRESHOLDS[selectedDevice.deviceType] : DEFAULT_THRESHOLDS.CO2;
  const dangerousThreshold = selectedDevice?.dangerousThreshold ?? defaults.dangerous;
  const alertThreshold = selectedDevice?.alertThreshold ?? defaults.alert;

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="58" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="6 6" />
          <path
            d="M60 34 L86 46 V64 C86 82 75 92 60 98 C45 92 34 82 34 64 V46 Z"
            fill="none"
            stroke="#2f6fed"
            strokeWidth="3"
          />
          <path d="M60 56 V72" stroke="#2f6fed" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="80" r="1.5" fill="#2f6fed" />
        </svg>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">No devices yet</h2>
          <p className="text-sm text-zinc-500 mt-1 max-w-xs">
            Add a sensor box to start seeing live readings on this dashboard.
          </p>
        </div>
        <Link
          href="/devices"
          className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg text-sm font-medium transition-colors"
        >
          <PlusCircle size={16} />
          Add your first device
        </Link>
        {demoEnabled && <DemoPanel onInjected={handleDemoInjected} hardwareBoxes={hardwareBoxes} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
            Real-time Monitoring
          </h1>
          <p className="text-zinc-500 text-sm">Overview of environmental metrics</p>
        </div>

        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-zinc-200 min-w-max">
            <select
              value={selectedBoxId}
              onChange={(e) => setSelectedBoxId(e.target.value)}
              className="bg-transparent text-sm font-medium text-zinc-900 border-none focus:ring-0 cursor-pointer min-w-[140px] max-w-[200px]"
            >
              {devices.map((d) => (
                <option key={d.boxId} value={d.boxId}>
                  {d.alias || d.boxId}
                </option>
              ))}
            </select>
            <div className="w-px h-6 bg-zinc-200" />
            <div className="flex gap-1">
              {TIME_RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    timeRange === r
                      ? "bg-accent/10 text-accent"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {deviceStatus === "live" && !reduceMotion && (
              <motion.span
                variants={breathingPulse}
                animate="animate"
                className="absolute inset-0 rounded-full bg-emerald-500"
              />
            )}
            <span
              className={`relative h-2 w-2 rounded-full ${deviceStatus === "live" ? "bg-emerald-500" : "bg-red-500"}`}
            />
          </span>
          <span className="text-sm text-zinc-500">
            {deviceStatus === "live" ? "Live" : "Disconnected"}
          </span>
        </div>
        <button
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          title={soundEnabled ? "Alert sounds on" : "Alert sounds off"}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            soundEnabled
              ? "bg-accent/10 text-accent"
              : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          Alert sounds
        </button>
        {latestData && (
          <span className="text-xs text-zinc-400">
            Last updated:{" "}
            {new Date(latestData.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <StatSkeletonRow />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <MetricCard
            title={selectedDevice?.deviceType === "CO2" ? "CO2 Level" : "Hydrogen Level"}
            value={`${currentData.gasValue} ppm`}
            icon={
              selectedDevice?.deviceType === "CO2" ? (
                <Wind size={18} />
              ) : (
                <FlaskConical size={18} />
              )
            }
            trend={trend(currentData.gasValue, prevPoint?.gasValue ?? null)}
            status={
              currentData.gasValue > dangerousThreshold
                ? "critical"
                : currentData.gasValue > alertThreshold
                  ? "warning"
                  : "normal"
            }
          />
          <MetricCard
            title="Temperature"
            value={`${currentData.temperature}°C`}
            icon={<Thermometer size={18} />}
            trend={trend(currentData.temperature, prevPoint?.temperature ?? null)}
            status="normal"
          />
          <MetricCard
            title="Humidity"
            value={`${currentData.humidity}%`}
            icon={<Droplets size={18} />}
            trend={trend(currentData.humidity, prevPoint?.humidity ?? null)}
            status="normal"
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title={`${selectedDevice?.deviceType === "CO2" ? "CO2" : "Hydrogen"} Trend`}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2f6fed" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2f6fed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#a1a1aa"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis stroke="#a1a1aa" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<GasTooltip deviceType={selectedDevice?.deviceType} />} />
            <Area
              type="monotone"
              dataKey="gasValue"
              stroke="#2f6fed"
              fillOpacity={1}
              fill="url(#colorGas)"
              strokeWidth={2}
              isAnimationActive={!reduceMotion}
              animationDuration={900}
            />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Temp & Humidity" legend>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#a1a1aa"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              yAxisId="left"
              stroke="#a1a1aa"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#a1a1aa"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<GasTooltip deviceType={selectedDevice?.deviceType} />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorTemp)"
              strokeWidth={2}
              isAnimationActive={!reduceMotion}
              animationDuration={900}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke="#0891b2"
              fillOpacity={1}
              fill="url(#colorHumidity)"
              strokeWidth={2}
              isAnimationActive={!reduceMotion}
              animationDuration={900}
            />
          </AreaChart>
        </ChartCard>

        <BentoCard variant="tile" className="flex flex-col h-full min-h-[300px] !p-5">
          <h3 className="font-semibold text-zinc-900 mb-4 flex items-center justify-between">
            <span>Recent Alerts</span>
            <button
              onClick={() => setIsAlertsModalOpen(true)}
              className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              View All
            </button>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[400px] lg:max-h-none">
            {currentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-2 ${
                  alert.level === "Dangerous"
                    ? "bg-red-50 border-red-500"
                    : "bg-amber-50 border-amber-500"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      alert.level === "Dangerous" ? "text-red-600" : "text-amber-600"
                    }`}
                  >
                    {alert.level}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-zinc-700 font-medium mb-1">{alert.message}</p>
                <span className="text-xs text-zinc-400">{alert.boxId}</span>
              </div>
            ))}
            {currentAlerts.length === 0 && !loading && (
              <div className="text-center py-10 text-zinc-400 text-sm">No recent alerts</div>
            )}
          </div>
        </BentoCard>
      </div>

      <AnimatePresence>
        {isAlertsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setIsAlertsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={spring}
              className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-zinc-900">All Alerts</h3>
                <button
                  onClick={() => setIsAlertsModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {allAlertsLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                    <div className="h-8 w-8 border-t-2 border-accent border-solid rounded-full animate-spin mb-4" />
                    <p>Loading all alerts...</p>
                  </div>
                ) : allAlertsError ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                    <Activity size={48} className="mb-4 opacity-20" />
                    <p>Error loading alerts: {allAlertsError}</p>
                  </div>
                ) : allAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                    <Activity size={48} className="mb-4 opacity-20" />
                    <p>No alerts recorded</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-3">
                    {allAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.level === "Dangerous"
                            ? "bg-red-50 border-red-500"
                            : "bg-amber-50 border-amber-500"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                alert.level === "Dangerous"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {alert.level}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
                            {alert.boxId}
                          </span>
                        </div>
                        <p className="text-zinc-800 font-medium">{alert.message}</p>
                      </div>
                    ))}

                    {hasMore && (
                      <div className="pt-2 flex justify-center">
                        <button
                          onClick={loadMore}
                          disabled={loadingMore}
                          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 text-zinc-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          {loadingMore ? "Loading..." : "Load More Alerts"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-zinc-200 bg-zinc-50 rounded-b-2xl flex justify-end">
                <button
                  onClick={() => setIsAlertsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {demoEnabled && <DemoPanel onInjected={handleDemoInjected} hardwareBoxes={hardwareBoxes} />}
    </div>
  );
}

function ChartCard({
  title,
  legend,
  children,
}: {
  title: string;
  legend?: boolean;
  children: React.ReactElement;
}) {
  return (
    <BentoCard variant="tile" className="lg:col-span-1 relative overflow-hidden !p-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
        <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
          <Activity size={16} className="text-accent" />
          {title}
        </h3>
        {legend && (
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Temp
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-cyan-600" /> Humidity
            </div>
          </div>
        )}
      </div>
      <div className="h-[250px] md:h-[300px] w-full -ml-2 md:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </BentoCard>
  );
}

function GasTooltip({
  active,
  payload,
  label,
  deviceType,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  deviceType?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 p-3 rounded-lg shadow-lg text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 tabular-nums" style={{ color: entry.color }}>
          <span className="font-semibold capitalize">
            {entry.name === "gasValue" ? deviceType ?? "gas" : entry.name}:
          </span>
          <span>
            {entry.value}
            {entry.name === "gasValue" ? " ppm" : entry.name === "temperature" ? "°C" : entry.name === "humidity" ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  status,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: { val: string; dir: "up" | "down"; positive: boolean; isNa: boolean };
  status: "critical" | "warning" | "normal";
}) {
  return (
    <BentoCard
      variant="stat"
      interactive
      variants={fadeUpItem}
      className={`relative overflow-hidden ${
        status === "critical"
          ? "border-red-300 bg-red-50/60 alert-glow-critical"
          : status === "warning"
            ? "border-amber-300 bg-amber-50/60 alert-glow-warning"
            : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-zinc-500 text-sm font-medium">{title}</span>
        <div
          className={`p-2 rounded-lg ${
            status === "critical"
              ? "bg-red-100 text-red-600"
              : status === "warning"
                ? "bg-amber-100 text-amber-600"
                : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {icon}
        </div>
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0.4, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="text-2xl font-bold text-zinc-900 mb-2 tabular-nums"
      >
        {value}
      </motion.div>
      <div className="flex items-center gap-2">
        {!trend.isNa ? (
          <>
            <div
              className={`flex items-center text-xs font-medium tabular-nums ${trend.positive ? "text-emerald-600" : "text-rose-600"}`}
            >
              {trend.positive ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
              <span>{trend.val}%</span>
            </div>
            <span className="text-xs text-zinc-400">vs last reading</span>
          </>
        ) : (
          <span className="text-xs text-zinc-400">No trend data available</span>
        )}
      </div>
    </BentoCard>
  );
}

function StatSkeletonRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-5 bg-white border border-zinc-200/60 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="h-3 w-20 bg-zinc-200 rounded" />
            <div className="h-8 w-8 bg-zinc-200 rounded-lg" />
          </div>
          <div className="h-7 w-24 bg-zinc-200 rounded mb-3" />
          <div className="h-3 w-28 bg-zinc-100 rounded" />
        </div>
      ))}
    </div>
  );
}
