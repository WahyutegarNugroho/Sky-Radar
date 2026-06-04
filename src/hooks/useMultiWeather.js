import { useState, useEffect, useRef } from 'react';
import { getClientCache, setClientCache } from '@/lib/client-cache';
import { fetchWeatherData } from '@/utils/api';

const CACHE_TTL = 300000;

function locationsKey(locs) {
  if (!locs || locs.length === 0) return '';
  return locs.map((l) => `${l.lat.toFixed(4)},${l.lng.toFixed(4)}`).join('|');
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
      const results = await Promise.allSettled(
        currentLocs.map(async (loc) => {
          const cacheKey = `weather:${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}`;
          const cached = getClientCache(cacheKey);
          if (cached) return { name: loc.name, lat: loc.lat, lng: loc.lng, weather: cached, loading: false, error: null };

          const data = await fetchWeatherData(loc.lat, loc.lng);
          setClientCache(cacheKey, data, CACHE_TTL);
          return { name: loc.name, lat: loc.lat, lng: loc.lng, weather: data, loading: false, error: null };
        })
      );
      if (!active) return;
      setWeatherData(
        results.map((r, idx) =>
          r.status === 'fulfilled'
            ? r.value
            : {
                name: currentLocs[idx].name,
                lat: currentLocs[idx].lat,
                lng: currentLocs[idx].lng,
                weather: null,
                loading: false,
                error: r.reason?.message || 'Gagal memuat cuaca',
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