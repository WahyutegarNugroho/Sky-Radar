import { useState, useEffect, useRef } from 'react';
import { getClientCache, setClientCache } from '@/lib/client-cache';

const CACHE_TTL = 300000;

function locationsKey(locs) {
  if (!locs || locs.length === 0) return '';
  return locs.map((l) => `${l.lat.toFixed(4)},${l.lng.toFixed(4)}`).join('|');
}

async function limitConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;
  const worker = async () => {
    while (index < items.length) {
      const currentIdx = index++;
      try {
        const value = await fn(items[currentIdx], currentIdx);
        results[currentIdx] = { status: 'fulfilled', value };
      } catch (reason) {
        results[currentIdx] = { status: 'rejected', reason };
      }
    }
  };
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

export function useMultiWeather(locations) {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const locationsStr = locationsKey(locations);
  const locationsRef = useRef(locations);
  const intervalRef = useRef(null);

  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);

  useEffect(() => {
    const currentLocs = locationsRef.current;
    if (!currentLocs || currentLocs.length === 0) {
      setWeatherData([]);
      setLoading(false);
      return;
    }

    setWeatherData(
      currentLocs.map((loc) => ({
        name: loc.name,
        lat: loc.lat,
        lng: loc.lng,
        weather: null,
        loading: true,
        error: null,
      }))
    );

    let active = true;

    const fetchAll = async () => {
      setLoading(true);
      const results = await limitConcurrency(currentLocs, 5, async (loc) => {
        const normLon = ((loc.lng + 180) % 360 + 360) % 360 - 180;
        const cacheKey = `weather:${loc.lat.toFixed(2)},${normLon.toFixed(2)}`;
        const cached = getClientCache(cacheKey);
        if (cached) return { name: loc.name, lat: loc.lat, lng: loc.lng, weather: cached, loading: false, error: null };

        const res = await fetch(`/api/weather?lat=${loc.lat}&lon=${normLon}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setClientCache(cacheKey, data, CACHE_TTL);
        return { name: loc.name, lat: loc.lat, lng: loc.lng, weather: data, loading: false, error: null };
      });
      if (!active) return;
      setWeatherData(
        results.map((r, idx) =>
          r.status === 'fulfilled' && r.value
            ? r.value
            : {
                name: currentLocs[idx].name,
                lat: currentLocs[idx].lat,
                lng: currentLocs[idx].lng,
                weather: null,
                loading: false,
                error: (r.status === 'rejected' && r.reason instanceof Error ? r.reason.message : null) || 'Gagal memuat cuaca',
              }
        )
      );
      setLoading(false);
    };

    fetchAll();
    intervalRef.current = setInterval(fetchAll, CACHE_TTL);
    return () => { clearInterval(intervalRef.current); active = false; };
  }, [locationsStr]);

  return { weatherData, loading };
}