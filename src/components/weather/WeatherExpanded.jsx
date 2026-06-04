import React from 'react';
import PropTypes from 'prop-types';
import { Wind, Thermometer, Droplets, CloudRain, Sun, AlertTriangle, Clock, Minimize2, Cloud, CloudDrizzle, CloudLightning } from 'lucide-react';
import { motion } from 'framer-motion';
import { WEATHER_CODES, WEATHER_THRESHOLDS } from '@/utils/constants';
import { getWindDirection } from '@/utils/helpers';

function getAQIDetails(aqi) {
  if (aqi === null || aqi === undefined) return { label: 'N/A', color: 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20' };
  if (aqi <= 50) return { label: 'Baik', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' };
  if (aqi <= 100) return { label: 'Sedang', color: 'text-amber-600 bg-amber-500/10 border-amber-300' };
  if (aqi <= 150) return { label: 'Tidak Sehat (Sensitive)', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
  return { label: 'Tidak Sehat', color: 'text-red-500 bg-red-500/10 border-red-300' };
}

function getIcon(code, size = 'w-4 h-4') {
  if (code === 0 || code === 1) return <Sun className={`${size} text-amber-500`} />;
  if (code === 2 || code === 3) return <Cloud className={`${size} text-neutral-500`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={`${size} text-sky-400`} />;
  if (code >= 61 && code <= 65) return <CloudRain className={`${size} text-sky-500`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${size} text-blue-600`} />;
  if (code >= 95) return <CloudLightning className={`${size} text-violet-500`} />;
  return <Cloud className={`${size} text-neutral-500`} />;
}

function getTheme(code) {
  if (code === 0 || code === 1) return { border: 'border-amber-300', bg: 'from-amber-500/[0.03]' };
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return { border: 'border-sky-500/30', bg: 'from-sky-500/[0.03]' };
  if (code >= 95) return { border: 'border-violet-500/30', bg: 'from-violet-500/[0.03]' };
  return { border: 'border-gray-200', bg: 'from-blue-700/[0.03]' };
}

function WeatherExpanded({ weather, locationName, currentTime, timezoneAbbr, alerts, onMinimize }) {
  const condition = WEATHER_CODES[weather.weather_code] || `Kode ${weather.weather_code}`;
  const windDir = getWindDirection(weather.wind_direction_10m);
  const aqiInfo = getAQIDetails(weather.us_aqi);
  const theme = getTheme(weather.weather_code);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            {currentTime && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-300 font-mono tabular-nums bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 px-1.5 py-0.5 rounded-lg">
                <Clock className="w-2.5 h-2.5 text-neutral-400" />
                <span>{currentTime}</span>
                <span className="text-xs text-neutral-400 font-medium">{timezoneAbbr || 'WIB'}</span>
              </div>
            )}
          </div>
          {locationName && (
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{locationName}</div>
          )}
        </div>
        <button
          onClick={onMinimize}
          className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 shrink-0 transition-colors"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {getIcon(weather.weather_code)}
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
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-300">
            <Thermometer className="w-3.5 h-3.5 text-red-500/80" /> Suhu
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{Math.round(weather.temperature_2m)}&deg;C</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-300">
            <Droplets className="w-3.5 h-3.5 text-blue-400/80" /> Kelembaban
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{weather.relative_humidity_2m}%</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-300">
            <Wind className="w-3.5 h-3.5 text-emerald-400/80" /> Kec. Angin
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{Math.round(weather.wind_speed_10m)} km/h</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-300">
            <div className="relative w-3.5 h-3.5 flex items-center justify-center bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-sm shrink-0">
              <div className="w-0.5 h-2.5 bg-blue-600 transition-transform" style={{ transform: `rotate(${weather.wind_direction_10m}deg)`, transformOrigin: 'center' }} />
            </div>
            Arah Angin
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{windDir}</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-300">
            <CloudRain className="w-3.5 h-3.5 text-sky-400/80" /> Hujan
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{weather.precipitation} mm</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-neutral-800/60 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-300">
            <Sun className="w-3.5 h-3.5 text-yellow-400/80" /> Radiasi
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{weather.shortwave_radiation} W/m&sup2;</span>
        </div>
      </div>

      <div className={`flex flex-col gap-1 p-2.5 border ${aqiInfo.color} rounded-xl`}>
        <div className="flex items-center justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300">
          <span>Kualitas Udara (US AQI)</span>
          {weather.us_aqi !== null && <span className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-200">{weather.us_aqi}</span>}
        </div>
        <span className="text-xs font-semibold tracking-tight leading-none">{aqiInfo.label}</span>
      </div>
    </div>
  );
}

WeatherExpanded.propTypes = {
  weather: PropTypes.shape({
    weather_code: PropTypes.number,
    temperature_2m: PropTypes.number,
    relative_humidity_2m: PropTypes.number,
    precipitation: PropTypes.number,
    wind_speed_10m: PropTypes.number,
    wind_direction_10m: PropTypes.number,
    shortwave_radiation: PropTypes.number,
    us_aqi: PropTypes.number,
  }).isRequired,
  locationName: PropTypes.string,
  currentTime: PropTypes.string,
  timezoneAbbr: PropTypes.string,
  alerts: PropTypes.arrayOf(PropTypes.string),
  onMinimize: PropTypes.func.isRequired,
};

WeatherExpanded.defaultProps = {
  locationName: '',
  currentTime: '',
  timezoneAbbr: 'WIB',
  alerts: [],
};

export default WeatherExpanded;