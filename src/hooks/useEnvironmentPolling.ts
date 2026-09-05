"use client";

import { useEffect, useState } from "react";
import type { EnvironmentDataPoint, TimeRange } from "@/lib/types";

const POLL_INTERVAL_MS = 4000;
const OFFLINE_TIMEOUT_MS = 2.5 * 60 * 1000;

const TIME_RANGE_MINUTES: Record<TimeRange, number> = {
  "10m": 10,
  "30m": 30,
  "1h": 60,
};

interface UseEnvironmentPollingOptions {
  boxId: string;
  timeRange: TimeRange;
  enabled?: boolean;
}

/**
 * Polls /api/environment-data on an interval. Replaces the original's
 * Supabase Realtime `postgres_changes` subscription - there is no
 * equivalent push mechanism on Neon, so this app polls instead (documented
 * as a known tradeoff; a WebSocket/SSE layer is a future upgrade).
 */
export function useEnvironmentPolling({
  boxId,
  timeRange,
  enabled = true,
}: UseEnvironmentPollingOptions) {
  const [data, setData] = useState<EnvironmentDataPoint[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<"live" | "disconnected">("disconnected");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !boxId) return;

    let cancelled = false;

    async function poll() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/environment-data?boxId=${encodeURIComponent(boxId)}&minutes=${TIME_RANGE_MINUTES[timeRange]}`,
        );
        if (!res.ok) throw new Error("Failed to fetch environment data");
        const json: EnvironmentDataPoint[] = await res.json();
        if (cancelled) return;

        setData(json);
        setError(null);

        const latest = json.length > 0 ? json[json.length - 1] : null;
        setDeviceStatus(
          latest && Date.now() - new Date(latest.createdAt).getTime() < OFFLINE_TIMEOUT_MS
            ? "live"
            : "disconnected",
        );
      } catch {
        if (!cancelled) setError("Failed to fetch environment data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [boxId, timeRange, enabled]);

  const latestData = data.length > 0 ? data[data.length - 1] : null;

  return { data, latestData, deviceStatus, loading, error };
}
