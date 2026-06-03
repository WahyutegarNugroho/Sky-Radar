import React from 'react';
import PropTypes from 'prop-types';
import { Sun, Cloud, CloudDrizzle, CloudRain, CloudLightning } from 'lucide-react';
import { WEATHER_CODES } from '@/utils/constants';

function getIcon(code, size = 'w-4 h-4') {
  if (code === 0 || code === 1) return <Sun className={`${size} text-amber-500`} />;
  if (code === 2 || code === 3) return <Cloud className={`${size} text-neutral-500`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={`${size} text-sky-400`} />;
  if (code >= 61 && code <= 65) return <CloudRain className={`${size} text-sky-500`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${size} text-blue-600`} />;
  if (code >= 95) return <CloudLightning className={`${size} text-violet-500`} />;
  return <Cloud className={`${size} text-neutral-500`} />;
}

function formatDay(dateStr, idx) {
  if (idx === 0) return 'Hari Ini';
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[d.getDay()];
}

function WeatherDaily({ daily }) {
  if (!daily?.length) return null;

  return (
    <div className="flex flex-col gap-0.5">
      {daily.map((day, i) => (
        <div key={day.time} className="flex items-center justify-between py-1.5 px-1 even:bg-gray-50/50 dark:even:bg-neutral-800/30 rounded-lg">
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 min-w-[52px]">
            {formatDay(day.time, i)}
          </span>
          <div className="flex items-center gap-1">
            {getIcon(day.weather_code)}
          </div>
          <div className="flex items-center gap-1.5 text-xs tabular-nums">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{Math.round(day.temp_max)}&deg;</span>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-500 dark:text-neutral-400">{Math.round(day.temp_min)}&deg;</span>
          </div>
        </div>
      ))}
    </div>
  );
}

WeatherDaily.propTypes = {
  daily: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string,
    weather_code: PropTypes.number,
    temp_max: PropTypes.number,
    temp_min: PropTypes.number,
  })),
};

export default WeatherDaily;