import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Legend({ layerType, compact }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const rainLevels = [
    { color: 'bg-blue-500', label: 'Gerimis' },
    { color: 'bg-green-500', label: 'Ringan' },
    { color: 'bg-yellow-500', label: 'Sedang' },
    { color: 'bg-red-500', label: 'Lebat' },
    { color: 'bg-fuchsia-600', label: 'Ekstrim / Es' },
  ];

  const cloudLevels = [
    { color: 'bg-neutral-500', label: 'Awan Tipis' },
    { color: 'bg-cyan-500', label: 'Awan Sedang' },
    { color: 'bg-green-500', label: 'Awan Dingin' },
    { color: 'bg-yellow-400', label: 'Awan Sangat Dingin' },
    { color: 'bg-red-500', label: 'Puncak Badai' },
  ];

  const title = layerType === 'satellite' ? 'Suhu & Jenis Awan' : 'Intensitas Hujan';
  const levels = layerType === 'satellite' ? cloudLevels : rainLevels;

  if (compact) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-11 h-11 text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-150 shrink-0 active:scale-90"
          title={title}
        >
          <Info className="w-5 h-5" />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full left-0 mb-2 z-[1500] p-2.5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-xl min-w-[140px]"
            >
              <span className="text-xs text-neutral-400 dark:text-neutral-300 font-medium block mb-1.5">{title}</span>
              <div className="flex flex-col gap-1">
                {levels.map((level) => (
                  <div key={level.label} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                    <span className={`w-3 h-3 rounded-sm ${level.color}`} />
                    <span>{level.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm min-w-[160px] transition-colors duration-300">
      <span className="text-xs text-neutral-400 dark:text-neutral-300 font-medium">{title}</span>
      <div className="flex flex-col gap-1.5">
        {levels.map((level) => (
          <div key={level.label} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <span className={`w-3 h-3 rounded-sm ${level.color}`} />
            <span>{level.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Legend.propTypes = {
  layerType: PropTypes.string.isRequired,
  compact: PropTypes.bool,
};

Legend.defaultProps = {
  compact: false,
};

export default Legend;
