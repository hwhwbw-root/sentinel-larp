"use client";

import { useMemo, useState } from "react";
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
  Tag,
} from "lucide-react";
import type { Device, TimeRange } from "@/lib/types";
import { useEnvironmentPolling } from "@/hooks/useEnvironmentPolling";
import { useAllAlerts } from "@/hooks/useAllAlerts";
import { DEFAULT_THRESHOLDS } from "@/lib/alerts";

interface DashboardClientProps {
  devices: Device[];
  firmwareVersion: string | null;
}

const TIME_RANGES: TimeRange[] = ["10m", "30m", "1h"];

export function DashboardClient({ devices, firmwareVersion }: DashboardClientProps) {
  const [selectedBoxId, setSelectedBoxId] = useState(devices[0]?.boxId ?? "");
  const [timeRange, setTimeRange] = useState<TimeRange>("10m");
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const { data, latestData, deviceStatus, loading } = useEnvironmentPolling({
    boxId: selectedBoxId,
    timeRange,
    enabled: !!selectedBoxId,
  });

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
      <div className="flex items-center justify-center h-full text-slate-400">
        No devices found. Add one from Device Management.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Real-time Monitoring
          </h1>
          <p className="text-slate-400 text-sm">Overview of environmental metrics</p>
        </div>

        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-lg border border-slate-800 min-w-max">
            <select
              value={selectedBoxId}
              onChange={(e) => setSelectedBoxId(e.target.value)}
              className="bg-transparent text-sm font-medium text-white border-none focus:ring-0 cursor-pointer min-w-[140px] max-w-[200px]"
            >
              {devices.map((d) => (
                <option key={d.boxId} value={d.boxId} className="bg-slate-900">
                  {d.alias || d.boxId}
                </option>
              ))}
            </select>
            <div className="w-px h-6 bg-slate-700" />
            <div className="flex gap-1">
              {TIME_RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    timeRange === r
                      ? "bg-slate-700 text-emerald-400 shadow-sm"
                      : "text-slate-400 hover:text-white"
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
          <div
            className={`h-2 w-2 rounded-full ${deviceStatus === "live" ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-sm text-slate-400">
            {deviceStatus === "live" ? "Live" : "Disconnected"}
          </span>
        </div>
        {latestData && (
          <span className="text-xs text-slate-500">
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
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-md px-2.5 py-1">
          <Tag size={11} className="text-slate-500" />
          <span className="text-xs text-slate-400">Firmware</span>
          <span className="text-xs font-mono font-semibold text-emerald-400">
            {firmwareVersion ?? "—"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title={`${selectedDevice?.deviceType === "CO2" ? "CO2" : "Hydrogen"} Trend`}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<GasTooltip deviceType={selectedDevice?.deviceType} />} />
            <Area
              type="monotone"
              dataKey="gasValue"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorGas)"
              strokeWidth={2}
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
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              yAxisId="left"
              stroke="#475569"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#475569"
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
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorHumidity)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartCard>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 shadow-lg flex flex-col h-full min-h-[300px]">
          <h3 className="font-semibold text-slate-100 mb-4 flex items-center justify-between">
            <span>Recent Alerts</span>
            <button
              onClick={() => setIsAlertsModalOpen(true)}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                    ? "bg-red-500/5 border-red-500"
                    : "bg-amber-500/5 border-amber-500"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      alert.level === "Dangerous" ? "text-red-400" : "text-amber-400"
                    }`}
                  >
                    {alert.level}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-medium mb-1">{alert.message}</p>
                <span className="text-xs text-slate-500">{alert.boxId}</span>
              </div>
            ))}
            {currentAlerts.length === 0 && !loading && (
              <div className="text-center py-10 text-slate-600 text-sm">No recent alerts</div>
            )}
          </div>
        </div>
      </div>

      {isAlertsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsAlertsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">All Alerts</h3>
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {allAlertsLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <div className="h-8 w-8 border-t-2 border-white border-solid rounded-full animate-spin mb-4" />
                  <p>Loading all alerts...</p>
                </div>
              ) : allAlertsError ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Activity size={48} className="mb-4 opacity-20" />
                  <p>Error loading alerts: {allAlertsError}</p>
                </div>
              ) : allAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
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
                          ? "bg-red-500/10 border-red-500"
                          : "bg-amber-500/10 border-amber-500"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                              alert.level === "Dangerous"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {alert.level}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">
                          {alert.boxId}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium">{alert.message}</p>
                    </div>
                  ))}

                  {hasMore && (
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        {loadingMore ? "Loading..." : "Load More Alerts"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-xl flex justify-end">
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
    <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 shadow-lg relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
        <h3 className="font-semibold text-slate-100 flex items-center gap-2">
          <Activity size={16} className="text-emerald-500" />
          {title}
        </h3>
        {legend && (
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Temp
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Humidity
            </div>
          </div>
        )}
      </div>
      <div className="h-[250px] md:h-[300px] w-full -ml-2 md:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
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
    <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2" style={{ color: entry.color }}>
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
    <div
      className={`bg-slate-900 border ${
        status === "critical"
          ? "border-red-900/50 bg-red-950/10"
          : status === "warning"
            ? "border-amber-900/50 bg-amber-950/10"
            : "border-slate-800"
      } rounded-xl p-5 relative overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <div
          className={`p-2 rounded-lg ${
            status === "critical"
              ? "bg-red-500/20 text-red-500"
              : status === "warning"
                ? "bg-amber-500/20 text-amber-500"
                : "bg-slate-800 text-slate-400"
          }`}
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div className="flex items-center gap-2">
        {!trend.isNa ? (
          <>
            <div
              className={`flex items-center text-xs font-medium ${trend.positive ? "text-emerald-500" : "text-rose-500"}`}
            >
              {trend.positive ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
              <span>{trend.val}%</span>
            </div>
            <span className="text-xs text-slate-600">vs last reading</span>
          </>
        ) : (
          <span className="text-xs text-slate-600">No trend data available</span>
        )}
      </div>
      {status === "critical" && (
        <div className="absolute inset-0 border-2 border-red-500/20 rounded-xl animate-pulse pointer-events-none" />
      )}
      {status === "warning" && (
        <div className="absolute inset-0 border-2 border-amber-500/20 rounded-xl animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
