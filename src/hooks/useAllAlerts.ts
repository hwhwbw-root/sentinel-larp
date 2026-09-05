"use client";

import { useEffect, useState, useCallback } from "react";
import type { AlertItem } from "@/lib/types";

const LIMIT = 20;

export function useAllAlerts({ boxId, enabled }: { boxId?: string; enabled: boolean }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchAlerts = useCallback(
    async (currentOffset: number, isInitial: boolean) => {
      if (isInitial) {
        setLoading(true);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      try {
        const params = new URLSearchParams({
          limit: String(LIMIT),
          offset: String(currentOffset),
        });
        if (boxId) params.set("boxId", boxId);

        const res = await fetch(`/api/alerts?${params}`);
        if (!res.ok) throw new Error("Failed to fetch alerts");
        const json: { alerts: AlertItem[]; hasMore: boolean } = await res.json();

        setHasMore(json.hasMore);
        setAlerts((prev) => (isInitial ? json.alerts : [...prev, ...json.alerts]));
        setOffset(currentOffset + LIMIT);
      } catch {
        setError("Failed to fetch alerts");
      } finally {
        if (isInitial) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [boxId],
  );

  useEffect(() => {
    if (!enabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount-or-param-change, not a render loop
    fetchAlerts(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxId, enabled]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) fetchAlerts(offset, false);
  };

  return { alerts, loading, loadingMore, error, hasMore, loadMore };
}
