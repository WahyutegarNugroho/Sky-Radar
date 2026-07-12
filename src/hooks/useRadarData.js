import { useState, useEffect, useCallback } from 'react';
import { fetchRadarData } from '@/utils/api';

/**
 * Custom hook to manage fetching and periodic auto-refreshing of RainViewer radar data.
 * Refreshes data every 10 minutes by default.
 *
 * @param {number} refreshInterval - Auto refresh interval in ms (default 10 minutes)
 * @returns {{ radarData: { host: string, radar: Array, generated: number } | null, loading: boolean, error: Error | null, refresh: Function }}
 */
export function useRadarData(refreshInterval = 600000) {
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRadarData();
      setRadarData(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data radar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // ponytail: fixed refreshInterval, no error backoff. Add exponential backoff (double interval on fail) + document.visibilitychange refetch when needed.
    const intervalId = setInterval(() => {
      loadData();
    }, refreshInterval);
    return () => clearInterval(intervalId);
  }, [loadData, refreshInterval]);

  return { radarData, loading, error, refresh: loadData };
}
