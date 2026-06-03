import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Wind, Thermometer, Droplets, CloudRain, Sun, Loader2, AlertCircle, AlertTriangle,
  Cloud, CloudLightning, CloudDrizzle, Clock, Maximize2, Minimize2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getWeatherError } from '@/lib/errors';
import { WEATHER_THRESHOLDS, WEATHER_CODES } from '@/utils/constants';
import { getWindDirection } from '@/utils/helpers';

function getAQIDetails(aqi) {
  if (aqi === null || aqi === undefined) return { label: 'N/A', color: 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20' };
  if (aqi <= 50) return { label: 'Baik', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' };
  if (aqi <= 100) return { label: 'Sedang', color: 'text-amber-600 bg-amber-500/10 border-amber-300' };
  if (aqi <= 150) return { label: 'Tidak Sehat (Sensitive)', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
  return { label: 'Tidak Sehat', color: 'text-red-500 bg-red-500/10 border-red-300' };
}

function getWeatherIcon(code, sizeClass = 'w-4 h-4') {
  if (code === 0 || code === 1) return <Sun className={`${sizeClass} text-amber-500`} />;
  if (code === 2 || code === 3) return <Cloud className={`${sizeClass} text-neutral-500`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={`${sizeClass} text-sky-400`} />;
  if (code >= 61 && code <= 65) return <CloudRain className={`${sizeClass} text-sky-500`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${sizeClass} text-blue-600`} />;
  if (code >= 95) return <CloudLightning className={`${sizeClass} text-violet-500`} />;
  return <Cloud className={`${sizeClass} text-neutral-500`} />;
}

function getDayName(dateStr) {
  const date = new Date(dateStr);
  return ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()];
}

function getWeatherTheme(code) {
  if (code === 0 || code === 1) return { border: 'border-amber-300', accentText: 'text-amber-600', bgGlow: 'from-amber-500/[0.03] to-transparent' };
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return { border: 'border-sky-500/30', accentText: 'text-sky-400', bgGlow: 'from-sky-500/[0.03] to-transparent' };
  if (code >= 95) return { border: 'border-violet-500/30', accentText: 'text-violet-400', bgGlow: 'from-violet-500/[0.03] to-transparent' };
  return { border: 'border-gray-200', accentText: 'text-blue-700', bgGlow: 'from-blue-700/[0.03] to-transparent' };
}

const generateBezierPath = (points) => {
  if (points.length === 0) return '';
  return points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const cpX1 = points[i - 1].x + 18;
    const cpY1 = points[i - 1].y;
    const cpX2 = p.x - 18;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');
};

function OpenMeteoCard({ weather, loading, error, latitude, longitude, locationName }) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const utcOffsetSeconds = weather?.utcOffsetSeconds;

  useEffect(() => {
    if (utcOffsetSeconds === undefined) return;
    const updateTime = () => {
      const systemUtc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
      const targetLocalTime = new Date(systemUtc + utcOffsetSeconds * 1000);
      setCurrentTime(targetLocalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [utcOffsetSeconds]);

  if (loading) {
    return (
      <div className="px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-md w-64 transition-colors duration-300">
        <span className="text-sm text-neutral-400 dark:text-neutral-500">Memuat data cuaca...</span>
      </div>
    );
  }

  if (error) {
    const err = getWeatherError(error);
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl w-64 transition-colors duration-300">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-red-700 dark:text-red-400">{err.title}</span>
          {err.detail && <span className="text-xs text-red-500/70 dark:text-red-400/75">{err.detail}</span>}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm w-64 transition-colors duration-300">
        <Cloud className="w-4 h-4 text-neutral-400 shrink-0" />
        <span className="text-xs text-neutral-400 dark:text-neutral-500">Pilih lokasi untuk melihat data cuaca</span>
      </div>
    );
  }

  const condition = WEATHER_CODES[weather.weather_code] || `Kode ${weather.weather_code}`;
  const windDir = getWindDirection(weather.wind_direction_10m);
  const aqiInfo = getAQIDetails(weather.us_aqi);
  const theme = getWeatherTheme(weather.weather_code);

  const alerts = [];
  if (weather.wind_speed_10m > WEATHER_THRESHOLDS.highWind) alerts.push(`Angin Kencang (${Math.round(weather.wind_speed_10m)} km/h)`);
  if (weather.precipitation > WEATHER_THRESHOLDS.heavyRain) alerts.push(`Hujan Lebat (${weather.precipitation} mm)`);

  let tempMaxPoints = [];
  let tempMinPoints = [];
  let avgLineY = 0;

  if (weather.daily && weather.daily.length > 0) {
    const maxVals = weather.daily.map(d => d.temp_max);
    const minVals = weather.daily.map(d => d.temp_min);
    const highest = Math.max(...maxVals);
    const lowest = Math.min(...minVals);
    const range = (highest - lowest) || 1;
    tempMaxPoints = maxVals.map((val, idx) => ({
      x: (idx * 240) / 6, y: 10 + ((highest - val) / range) * 30, val,
    }));
    tempMinPoints = minVals.map((val, idx) => ({
      x: (idx * 240) / 6, y: 10 + ((highest - val) / range) * 30, val,
    }));
    const allTemps = [...maxVals, ...minVals];
    const avgTemp = allTemps.reduce((a, b) => a + b, 0) / allTemps.length;
    avgLineY = 10 + ((highest - avgTemp) / range) * 30;
  }

  if (isMinimized) {
    return (
      <motion.div
        layout
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`flex items-center gap-2.5 p-2.5 bg-white border ${theme.border} rounded-2xl shadow-md pointer-events-auto bg-gradient-to-b ${theme.bgGlow} cursor-pointer hover:bg-gray-50 dark:bg-neutral-900/90 dark:border-neutral-800 dark:hover:bg-neutral-800 transition-colors`}
        onClick={() => setIsMinimized(false)}
        title="Klik untuk detail"
      >
        {getWeatherIcon(weather.weather_code, 'w-6 h-6')}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{Math.round(weather.temperature_2m)}&deg;C</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[80px]">{condition}</span>
        </div>
        <Maximize2 className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0 ml-auto" />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`flex flex-col gap-3 p-4 bg-white border ${theme.border} dark:bg-neutral-900 dark:border-neutral-800 rounded-3xl shadow-xl w-full max-w-[280px] pointer-events-auto bg-gradient-to-b ${theme.bgGlow} transition-colors duration-300`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            {currentTime && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 px-1.5 py-0.5 rounded-lg">
                <Clock className="w-2.5 h-2.5 text-neutral-400 dark:text-neutral-500" />
                <span>{currentTime}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">{weather.timezoneAbbr || 'WIB'}</span>
              </div>
            )}
          </div>
          {locationName && (
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate" title={locationName}>
              {locationName}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 shrink-0 transition-colors"
          title="Minimalkan"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.weather_code, 'w-5 h-5')}
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 m-0">{condition}</h3>
      </div>

      {alerts.length > 0 && (
        <div className="flex flex-col gap-1.5 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
          {alerts.map((text, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <Thermometer className="w-3.5 h-3.5 text-red-500/80" />
            Suhu
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{Math.round(weather.temperature_2m)}&deg;C</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <Droplets className="w-3.5 h-3.5 text-blue-400/80" />
            Kelembaban
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{weather.relative_humidity_2m}%</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <Wind className="w-3.5 h-3.5 text-emerald-400/80" />
            Kec. Angin
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{Math.round(weather.wind_speed_10m)} km/h</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
            <div className="relative w-3.5 h-3.5 flex items-center justify-center bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-sm shrink-0">
              <div className="w-0.5 h-2.5 bg-blue-600 transition-transform duration-500" style={{ transform: `rotate(${weather.wind_direction_10m}deg)`, transformOrigin: 'center' }} />
            </div>
            Arah Angin
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{windDir}</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <CloudRain className="w-3.5 h-3.5 text-sky-400/80" />
            Hujan
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{weather.precipitation} mm</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <Sun className="w-3.5 h-3.5 text-yellow-400/80" />
            Radiasi
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{weather.shortwave_radiation} W/m&sup2;</span>
        </div>
      </div>

      <div className={`flex flex-col gap-1 p-2.5 border ${aqiInfo.color} rounded-xl`}>
        <div className="flex items-center justify-between text-xs font-medium opacity-90">
          <span>Kualitas Udara (US AQI)</span>
          {weather.us_aqi !== null && <span className="font-mono text-xs font-semibold">{weather.us_aqi}</span>}
        </div>
        <span className="text-xs font-semibold tracking-tight leading-none">{aqiInfo.label}</span>
      </div>

      {weather.daily && weather.daily.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1 p-2 bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-center text-xs text-neutral-400 dark:text-neutral-500 px-0.5">
              <span>Grafik Suhu Mingguan</span>
              <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-medium">&deg;C</span>
            </div>
            <div className="w-full relative mt-1 select-none" style={{ aspectRatio: '24/5' }}>
              <svg className="w-full h-full" viewBox="0 0 240 50" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="maxGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="minGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1={avgLineY} x2="240" y2={avgLineY} stroke="#ffffff" strokeOpacity="0.04" strokeDasharray="2,2" strokeWidth="1" />
                <path d={`${generateBezierPath(tempMinPoints)} L 240 50 L 0 50 Z`} fill="url(#minGlow)" />
                <path d={`${generateBezierPath(tempMaxPoints)} L 240 50 L 0 50 Z`} fill="url(#maxGlow)" />
                <path d={generateBezierPath(tempMaxPoints)} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
                <path d={generateBezierPath(tempMinPoints)} fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.65" />
                {tempMaxPoints.map((p, idx) => (
                  <g key={`max-dot-${idx}`}>
                    <circle cx={p.x} cy={p.y} r="2.5" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
                    {idx % 2 === 0 && <text x={p.x} y={p.y - 4} fontSize="6" fill="#f59e0b" fontWeight="bold" textAnchor="middle">{Math.round(p.val)}&deg;</text>}
                  </g>
                ))}
                {tempMinPoints.map((p, idx) => (
                  <g key={`min-dot-${idx}`}>
                    <circle cx={p.x} cy={p.y} r="2" fill="#38bdf8" stroke="#000" strokeWidth="0.8" />
                    {idx % 2 === 0 && <text x={p.x} y={p.y + 8} fontSize="6" fill="#38bdf8" fontWeight="bold" textAnchor="middle">{Math.round(p.val)}&deg;</text>}
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-1 pr-0.5 max-h-36 overflow-y-auto custom-scrollbar rounded-xl">
            {weather.daily.slice(1).map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-neutral-800/50 text-xs hover:bg-gray-100 dark:hover:bg-neutral-800/85 transition-colors rounded-xl">
                <span className="font-medium text-neutral-400 dark:text-neutral-500 w-8">{getDayName(day.time)}</span>
                <div className="flex items-center gap-1.5 flex-1 justify-center">
                  {getWeatherIcon(day.weather_code, 'w-3.5 h-3.5')}
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[80px]">{WEATHER_CODES[day.weather_code] || 'Cuaca'}</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-medium tabular-nums">
                  <span className="text-neutral-400 dark:text-neutral-500">{Math.round(day.temp_min)}&deg;</span>
                  <span className="text-neutral-400 dark:text-neutral-500">/</span>
                  <span className="text-amber-600/90 dark:text-amber-500">{Math.round(day.temp_max)}&deg;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

OpenMeteoCard.propTypes = {
  weather: PropTypes.shape({
    temperature_2m: PropTypes.number,
    relative_humidity_2m: PropTypes.number,
    precipitation: PropTypes.number,
    wind_speed_10m: PropTypes.number,
    wind_direction_10m: PropTypes.number,
    shortwave_radiation: PropTypes.number,
    weather_code: PropTypes.number,
    us_aqi: PropTypes.number,
    utcOffsetSeconds: PropTypes.number,
    timezoneAbbr: PropTypes.string,
    daily: PropTypes.arrayOf(PropTypes.shape({
      time: PropTypes.string.isRequired,
      weather_code: PropTypes.number.isRequired,
      temp_max: PropTypes.number.isRequired,
      temp_min: PropTypes.number.isRequired,
      precip_sum: PropTypes.number.isRequired,
    })),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  locationName: PropTypes.string,
};

OpenMeteoCard.defaultProps = {
  locationName: '',
  weather: null,
};

export default OpenMeteoCard;
