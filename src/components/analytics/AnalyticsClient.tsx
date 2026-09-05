"use client";

import { useState } from "react";
import { Calendar, Download, FileSpreadsheet, Server, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Device, EnvironmentDataPoint } from "@/lib/types";

const customDatePickerStyles = `
  .react-datepicker-wrapper { width: 100%; }
  .react-datepicker { font-family: inherit; background-color: #1e293b; border-color: #334155; color: #e2e8f0; }
  .react-datepicker__header { background-color: #0f172a; border-bottom-color: #334155; }
  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header { color: #f8fafc; }
  .react-datepicker__day-name { color: #94a3b8; }
  .react-datepicker__day { color: #e2e8f0; }
  .react-datepicker__day:hover { background-color: #334155; }
  .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range { background-color: #10b981; color: white; }
  .react-datepicker__day--keyboard-selected { background-color: #059669; color: white; }
  .react-datepicker__time-container { border-left-color: #334155; }
  .react-datepicker__time-container .react-datepicker__time { background-color: #1e293b; color: #e2e8f0; }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover { background-color: #334155; }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected { background-color: #10b981; }
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
        <h1 className="text-2xl font-bold text-white tracking-tight">Data History</h1>
        <p className="text-slate-400 text-sm">Export and analyze historical device data</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Select Device</label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <select
                value={selectedBoxId}
                onChange={(e) => setSelectedBoxId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none appearance-none"
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
            <label className="block text-sm font-medium text-slate-400 mb-2">Date Range</label>
            <div className="relative z-20">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={18} />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update as [Date | null, Date | null])}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText="Select date range"
                className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={handleFetchPreview}
              disabled={loading || !selectedBoxId || !startDate || !endDate}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
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
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">{error}</div>
      )}

      {previewData.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-200">
              <FileSpreadsheet className="text-emerald-500" size={20} />
              <span className="font-semibold">Data Preview</span>
            </div>
            <button
              onClick={downloadCSV}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Gas Value (ppm)</th>
                  <th className="px-6 py-4">Temp (°C)</th>
                  <th className="px-6 py-4">Humidity (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {previewData.slice(0, 50).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{row.gasValue}</td>
                    <td className="px-6 py-4">{row.temperature}</td>
                    <td className="px-6 py-4">{row.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 50 && (
              <div className="p-4 bg-slate-950/50 text-center text-xs text-slate-500 border-t border-slate-800">
                Showing first 50 rows. Download CSV to view full dataset.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
