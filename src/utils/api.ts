import { RAINVIEWER_API } from './constants'; interface RadarFrame { time: number; path: string;
} interface RadarDataResponse { host: string; radar: RadarFrame[]; satellite: RadarFrame[]; generated: number;
} export const fetchRadarData = async (): Promise<RadarDataResponse>=>{ try { const response = await fetch(RAINVIEWER_API); if (!response.ok) { throw new Error(`RainViewer API request failed with status: ${response.status}`); } const data = await response.json(); const host: string = data.host || 'https://tilecache.rainviewer.com'; const past: RadarFrame[] = data.radar?.past || []; const nowcast: RadarFrame[] = data.radar?.nowcast || []; const combinedRadar = [...past, ...nowcast]; combinedRadar.sort((a, b) =>a.time - b.time); const satelliteList: RadarFrame[] = data.satellite?.infrared || []; const combinedSatellite = [...satelliteList]; combinedSatellite.sort((a, b) =>a.time - b.time); return { host, radar: combinedRadar, satellite: combinedSatellite, generated: data.generated }; } catch (error) { console.error('Error fetching radar data:', error); throw error; }
};

export interface WeatherData {
  weather_code: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  shortwave_radiation: number;
  us_aqi: number | null;
  utcOffsetSeconds: number;
  timezoneAbbr: string;
  daily: Array<{
    time: string;
    weather_code: number;
    temp_max: number;
    temp_min: number;
    precip_sum: number;
  }>;
  hourly: Array<{
    time: string;
    temperature_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  }>;
}

export const fetchWeatherData = async (lat: number, lon: number, signal?: AbortSignal): Promise<WeatherData> => {
  const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';
  const OPEN_METEO_AQI_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';

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
    fetch(`${OPEN_METEO_API}?${weatherParams}`, { signal }),
    fetch(`${OPEN_METEO_AQI_API}?${aqiParams}`, { signal }).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather API error: ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();
  let aqiData = null;
  if (aqiRes && aqiRes.ok) {
    aqiData = await aqiRes.json();
  }

  const dailyForecast = weatherData.daily ? weatherData.daily.time.map((timeStr: string, idx: number) => ({
    time: timeStr,
    weather_code: weatherData.daily.weather_code[idx],
    temp_max: weatherData.daily.temperature_2m_max[idx],
    temp_min: weatherData.daily.temperature_2m_min[idx],
    precip_sum: weatherData.daily.precipitation_sum[idx],
  })) : [];

  const hourlyForecast = weatherData.hourly ? weatherData.hourly.time.map((timeStr: string, idx: number) => ({
    time: timeStr,
    temperature_2m: weatherData.hourly.temperature_2m[idx],
    precipitation: weatherData.hourly.precipitation[idx],
    weather_code: weatherData.hourly.weather_code[idx],
    wind_speed_10m: weatherData.hourly.wind_speed_10m[idx],
  })) : [];

  return {
    ...weatherData.current,
    us_aqi: aqiData?.current?.us_aqi ?? null,
    daily: dailyForecast,
    hourly: hourlyForecast,
    utcOffsetSeconds: weatherData.utc_offset_seconds,
    timezoneAbbr: weatherData.timezone_abbreviation,
  };
};
