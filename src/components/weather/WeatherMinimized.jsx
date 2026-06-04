import React from 'react';
import PropTypes from 'prop-types';
import { Sun, Cloud, CloudDrizzle, CloudRain, CloudLightning, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WEATHER_CODES } from '@/utils/constants';

function getIcon(code) {
  if (code === 0 || code === 1) return <Sun className="w-6 h-6 text-amber-500" />;
  if (code === 2 || code === 3) return <Cloud className="w-6 h-6 text-neutral-500" />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className="w-6 h-6 text-sky-400" />;
  if (code >= 61 && code <= 65) return <CloudRain className="w-6 h-6 text-sky-500" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-6 h-6 text-blue-600" />;
  if (code >= 95) return <CloudLightning className="w-6 h-6 text-violet-500" />;
  return <Cloud className="w-6 h-6 text-neutral-500" />;
}

function getTheme(code) {
  if (code === 0 || code === 1) return { border: 'border-amber-300', bg: 'from-amber-500/[0.03]' };
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return { border: 'border-sky-500/30', bg: 'from-sky-500/[0.03]' };
  if (code >= 95) return { border: 'border-violet-500/30', bg: 'from-violet-500/[0.03]' };
  return { border: 'border-gray-200', bg: 'from-blue-700/[0.03]' };
}

function WeatherMinimized({ weather, onExpand }) {
  const theme = getTheme(weather.weather_code);

  return (
    <motion.div
      layout
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`flex items-center gap-2.5 p-2.5 bg-white border ${theme.border} rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 dark:bg-neutral-900/90 dark:border-neutral-800 dark:hover:bg-neutral-800 bg-gradient-to-b ${theme.bg} to-transparent transition-colors`}
      onClick={onExpand}
    >
      {getIcon(weather.weather_code)}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{Math.round(weather.temperature_2m)}&deg;C</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-300 truncate max-w-[80px]">{WEATHER_CODES[weather.weather_code] || ''}</span>
      </div>
      <Maximize2 className="w-3 h-3 text-neutral-400 shrink-0 ml-auto" />
    </motion.div>
  );
}

WeatherMinimized.propTypes = {
  weather: PropTypes.shape({
    weather_code: PropTypes.number,
    temperature_2m: PropTypes.number,
  }).isRequired,
  onExpand: PropTypes.func.isRequired,
};

export default WeatherMinimized;