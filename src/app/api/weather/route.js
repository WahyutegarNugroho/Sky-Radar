import { NextResponse } from 'next/server';
import { getServerCache, setServerCache } from '@/lib/api-cache';

const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_AQI_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  if (!latParam || !lonParam) {
    return NextResponse.json({ error: 'Missing lat/lon parameters' }, { status: 400 });
  }

  // Round coordinates to 2 decimal places (~1.1 km precision) to maximize server-side cache hits
  // and prevent IP rate-limiting on hosting providers.
  const lat = Number(Number(latParam).toFixed(2));
  const lon = Number(Number(lonParam).toFixed(2));

  const cacheKey = `weather:${lat}:${lon}`;
  const cached = getServerCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const weatherParams = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,shortwave_radiation,weather_code',
      hourly: 'temperature_2m,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
      past_days: '1',
      timezone: 'auto',
    });

    const aqiParams = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'us_aqi',
      timezone: 'auto',
    });

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(`${OPEN_METEO_API}?${weatherParams}`),
      fetch(`${OPEN_METEO_AQI_API}?${aqiParams}`).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      return NextResponse.json({ error: `Weather API error: ${weatherRes.status}` }, { status: weatherRes.status });
    }

    const weatherData = await weatherRes.json();
    let aqiData = null;
    if (aqiRes && aqiRes.ok) {
      aqiData = await aqiRes.json();
    }

    const dailyForecast = weatherData.daily ? weatherData.daily.time.map((timeStr, idx) => ({
      time: timeStr,
      weather_code: weatherData.daily.weather_code[idx],
      temp_max: weatherData.daily.temperature_2m_max[idx],
      temp_min: weatherData.daily.temperature_2m_min[idx],
      precip_sum: weatherData.daily.precipitation_sum[idx],
    })) : [];

    const hourlyForecast = weatherData.hourly ? weatherData.hourly.time.map((timeStr, idx) => ({
      time: timeStr,
      temperature_2m: weatherData.hourly.temperature_2m[idx],
      precipitation: weatherData.hourly.precipitation[idx],
      weather_code: weatherData.hourly.weather_code[idx],
      wind_speed_10m: weatherData.hourly.wind_speed_10m[idx],
    })) : [];

    const result = {
      ...weatherData.current,
      us_aqi: aqiData?.current?.us_aqi ?? null,
      daily: dailyForecast,
      hourly: hourlyForecast,
      utcOffsetSeconds: weatherData.utc_offset_seconds,
      timezoneAbbr: weatherData.timezone_abbreviation,
    };

    setServerCache(cacheKey, result, 300); // Cache for 5 minutes
    return NextResponse.json(result);
  } catch (error) {
    console.error('Weather proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
