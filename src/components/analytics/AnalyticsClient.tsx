"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Download, FileSpreadsheet, Server, Search, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Device, EnvironmentDataPoint } from "@/lib/types";
import { BentoCard } from "@/components/ui/BentoCard";
import { fadeUpItem } from "@/lib/motion";

const customDatePickerStyles = `
  .react-datepicker-wrapper { width: 100%; }
  .react-datepicker { font-family: inherit; background-color: #ffffff; border-color: #e4e4e7; color: #18181b; }
  .react-datepicker__header { background-color: #fafafa; border-bottom-color: #e4e4e7; }
  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header { color: #18181b; }
  .react-datepicker__day-name { color: #71717a; }
  .react-datepicker__day { color: #27272a; }
  .react-datepicker__day:hover { background-color: #f4f4f5; }
  .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range { background-color: #2f6fed; color: white; }
  .react-datepicker__day--keyboard-selected { background-color: #2f6fed; color: white; }
  .react-datepicker__time-container { border-left-color: #e4e4e7; }
  .react-datepicker__time-container .react-datepicker__time { background-color: #ffffff; color: #27272a; }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover { background-color: #f4f4f5; }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected { background-color: #2f6fed; }
`;

export function AnalyticsClient({ devices }: { devices: Device[] }) {
  const [selectedBoxId, setSelectedBoxId] = useState(devices[0]?.boxId ?? "");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
    const end = new Date();
    const start = new Date();
    start.setHours(start.getHours() - 24);
    return [start, end];
  });
  const [startDate, endDate] = dateRange;

  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<EnvironmentDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPreview = async () => {
    if (!selectedBoxId || !startDate || !endDate) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        boxId: selectedBoxId,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
      const res = await fetch(`/api/environment-data/history?${params}`);
      if (!res.ok) throw new Error("Failed to fetch data history.");
      const data: EnvironmentDataPoint[] = await res.json();
      setPreviewData(data);
      if (data.length === 0) setError("No data found for the selected range.");
    } catch {
      setError("Failed to fetch data history.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (previewData.length === 0) return;

    const headers = ["Device ID", "Timestamp", "Gas Value (ppm)", "Temperature (°C)", "Humidity (%)", "Alert"];
    const csvContent = [
      headers.join(","),
      ...previewData.map((row) =>
        [
          row.boxId,
          row.createdAt,
          row.gasValue,
          row.temperature,
          row.humidity,
          row.alert === 0 ? "Safe" : row.alert === 1 ? "Alert" : "Dangerous",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedBoxId}_history_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <style>{customDatePickerStyles}</style>
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Data History</h1>
        <p className="text-zinc-500 text-sm">Export and analyze historical device data</p>
      </div>

      <BentoCard variant="stat" className="!p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-zinc-600 mb-2">Select Device</label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <select
                value={selectedBoxId}
                onChange={(e) => setSelectedBoxId(e.target.value)}
                className="w-full bg-white border border-zinc-300 text-zinc-900 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none appearance-none"
              >
                {devices.map((d) => (
                  <option key={d.boxId} value={d.boxId}>
                    {d.alias || d.boxId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-600 mb-2">Date Range</label>
            <div className="relative z-20">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 z-10" size={18} />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update as [Date | null, Date | null])}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText="Select date range"
                className="w-full bg-white border border-zinc-300 text-zinc-900 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={handleFetchPreview}
              disabled={loading || !selectedBoxId || !startDate || !endDate}
              className="w-full bg-accent hover:bg-accent/90 active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-400 text-accent-foreground font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={18} />
                  <span>Load Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </BentoCard>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {previewData.length > 0 && (
        <motion.div initial="hidden" animate="show" variants={fadeUpItem}>
          <BentoCard variant="tile" className="overflow-hidden !p-0 flex flex-col">
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-zinc-800">
                <FileSpreadsheet className="text-accent" size={20} />
                <span className="font-semibold">Data Preview</span>
              </div>
              <button
                onClick={downloadCSV}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Gas Value (ppm)</th>
                    <th className="px-6 py-4">Temp (°C)</th>
                    <th className="px-6 py-4">Humidity (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {previewData.slice(0, 50).map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-700">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 tabular-nums">{row.gasValue}</td>
                      <td className="px-6 py-4 tabular-nums">{row.temperature}</td>
                      <td className="px-6 py-4 tabular-nums">{row.humidity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 50 && (
                <div className="p-4 bg-zinc-50 text-center text-xs text-zinc-400 border-t border-zinc-100">
                  Showing first 50 rows. Download CSV to view full dataset.
                </div>
              )}
            </div>
          </BentoCard>
        </motion.div>
      )}
    </div>
  );
}
