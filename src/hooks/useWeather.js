import { useState, useEffect, useRef } from 'react';
import { getClientCache, setClientCache } from '@/lib/client-cache';
import { fetchWeatherData } from '@/utils/api';

const DEBOUNCE_MS = 500;
const CACHE_TTL = 600000;

export function useWeather(latitude, longitude) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    abortRef.current?.abort();

    const cacheKey = `weather:${latitude.toFixed(2)},${longitude.toFixed(2)}`;
    const cached = getClientCache(cacheKey);
    if (cached) {
      setWeather(cached);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    timerRef.current = setTimeout(async () => {
      try {
        const data = await fetchWeatherData(latitude, longitude, controller.signal);
        setWeather(data);
        setLoading(false);
        setClientCache(cacheKey, data, CACHE_TTL);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timerRef.current);
      controller.abort();
    };
  }, [latitude, longitude]);

  return { weather, loading, error };
}
