import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Gauge, Sun, Cloud, CloudDrizzle, CloudRain, CloudLightning, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

function MultiLocationWeather({ weatherData, loading, onLocationClick }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!weatherData || weatherData.length === 0) return null;

  return (
    <div className="w-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-accent-brand" />
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Dashboard Lokasi</span>
        </div>
        <span className="text-[10px] text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md font-medium">
          {weatherData.length}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-3 pb-3 max-h-60 overflow-y-auto custom-scrollbar">
              {weatherData.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onLocationClick?.(item.lat, item.lng, item.name)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left group"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent-brand/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-accent-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate leading-tight">
                      {item.name || `Lokasi ${idx + 1}`}
                    </div>
                    {item.loading ? (
                      <div className="text-[10px] text-neutral-400">Memuat...</div>
                    ) : item.error ? (
                      <div className="text-[10px] text-red-400">{item.error}</div>
                    ) : item.weather ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                        {getIcon(item.weather.weather_code, 'w-3 h-3')}
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {Math.round(item.weather.temperature_2m)}&deg;C
                        </span>
                        <span className="text-neutral-400">/</span>
                        <span>{Math.round(item.weather.wind_speed_10m)} km/h</span>
                      </div>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

MultiLocationWeather.propTypes = {
  weatherData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
      weather: PropTypes.object,
      loading: PropTypes.bool,
      error: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  onLocationClick: PropTypes.func,
};

export default MultiLocationWeather;