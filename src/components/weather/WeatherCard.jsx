import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherMinimized from './WeatherMinimized';
import WeatherExpanded from './WeatherExpanded';
import WeatherChart from './WeatherChart';
import WeatherDaily from './WeatherDaily';
import HourlyTrendChart from './HourlyTrendChart';
import { getWeatherError } from '@/lib/errors';
import { WEATHER_THRESHOLDS } from '@/utils/constants';

function getTheme(code) {
  if (code === 0 || code === 1) return { border: 'border-amber-300', bg: 'from-amber-500/[0.03]' };
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return { border: 'border-sky-500/30', bg: 'from-sky-500/[0.03]' };
  if (code >= 95) return { border: 'border-violet-500/30', bg: 'from-violet-500/[0.03]' };
  return { border: 'border-gray-250 dark:border-neutral-800/50', bg: 'from-blue-700/[0.03]' };
}

function WeatherCard({ weather, loading, error, latitude, longitude, locationName, customThresholds, onClose }) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const thresholds = customThresholds || WEATHER_THRESHOLDS;
  useEffect(() => { const check = () => setIsMobile(window.innerWidth < 640); check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check); }, []);

  useEffect(() => {
    const offsetSeconds = weather?.utcOffsetSeconds;
    if (offsetSeconds === undefined) return;
    const updateTime = () => {
      const systemUtc = Date.now() + new Date().getTimezoneOffset() * 60000;
      const targetTime = new Date(systemUtc + offsetSeconds * 1000);
      setCurrentTime(targetTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, [weather?.utcOffsetSeconds]);

  const handleMinimize = useCallback(() => setIsMinimized(true), []);
  const handleExpand = useCallback(() => setIsMinimized(false), []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2.5 p-3 bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm w-full sm:max-w-[280px]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-2.5 w-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl shadow-sm"
      >
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        <span className="text-xs text-red-600 dark:text-red-400">{getWeatherError(error).title || error}</span>
      </motion.div>
    );
  }

  if (!weather) return null;

  const alerts = [];
  if (weather.wind_speed_10m > thresholds.highWind) {
    alerts.push(`Angin Kencang (${Math.round(weather.wind_speed_10m)} km/h)`);
  }
  if (weather.precipitation > thresholds.heavyRain) {
    alerts.push(`Hujan Lebat (${weather.precipitation} mm)`);
  }

  const theme = getTheme(weather.weather_code);

  return (
    <>
      {isMinimized ? (
        <WeatherMinimized weather={weather} onExpand={handleExpand} />
      ) : isMobile ? (
        <div className="flex flex-col gap-3.5 w-full">
          <WeatherExpanded
            weather={weather}
            locationName={locationName}
            currentTime={currentTime}
            timezoneAbbr={weather.timezoneAbbr || 'WIB'}
            alerts={alerts}
            onMinimize={handleMinimize}
            onClose={onClose}
          />
          {weather.hourly && <HourlyTrendChart hourly={weather.hourly} />}
          <hr className="border-gray-100 dark:border-neutral-800/80" />
          <WeatherChart daily={weather.daily} />
          <hr className="border-gray-100 dark:border-neutral-800/80" />
          <WeatherDaily daily={weather.daily} />
        </div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex flex-col gap-3.5 p-4 bg-white border ${theme.border} dark:bg-neutral-900 dark:border-neutral-800 rounded-2xl shadow-xl w-full sm:max-w-[280px] bg-gradient-to-b ${theme.bg} to-transparent transition-colors duration-300 pointer-events-auto`}
        >
          <WeatherExpanded
            weather={weather}
            locationName={locationName}
            currentTime={currentTime}
            timezoneAbbr={weather.timezoneAbbr || 'WIB'}
            alerts={alerts}
            onMinimize={handleMinimize}
          />
          {weather.hourly && <HourlyTrendChart hourly={weather.hourly} />}
          <hr className="border-gray-100 dark:border-neutral-800/80" />
          <WeatherChart daily={weather.daily} />
          <hr className="border-gray-100 dark:border-neutral-800/80" />
          <WeatherDaily daily={weather.daily} />
        </motion.div>
      )}
    </>
  );
}

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    weather_code: PropTypes.number,
    temperature_2m: PropTypes.number,
    relative_humidity_2m: PropTypes.number,
    precipitation: PropTypes.number,
    wind_speed_10m: PropTypes.number,
    wind_direction_10m: PropTypes.number,
    shortwave_radiation: PropTypes.number,
    us_aqi: PropTypes.number,
    utcOffsetSeconds: PropTypes.number,
    timezoneAbbr: PropTypes.string,
    daily: PropTypes.arrayOf(PropTypes.shape({
      time: PropTypes.string,
      weather_code: PropTypes.number,
      temp_max: PropTypes.number,
      temp_min: PropTypes.number,
      precip_sum: PropTypes.number,
    })),
    hourly: PropTypes.arrayOf(PropTypes.shape({
      time: PropTypes.string,
      temperature_2m: PropTypes.number,
      precipitation: PropTypes.number,
      weather_code: PropTypes.number,
      wind_speed_10m: PropTypes.number,
    })),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  locationName: PropTypes.string,
  customThresholds: PropTypes.shape({
    highWind: PropTypes.number,
    heavyRain: PropTypes.number,
    poorAQI: PropTypes.number,
  }),
  onClose: PropTypes.func,
};

WeatherCard.defaultProps = {
  weather: null,
  loading: false,
  error: '',
  latitude: 0,
  longitude: 0,
  locationName: '',
  customThresholds: null,
  onClose: null,
};

export default WeatherCard;