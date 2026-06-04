import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useMap } from '@/contexts/MapContext';
import { motion, AnimatePresence } from 'framer-motion';

function OpacitySlider({ compact }) {
  const { opacity, setOpacity } = useMap();
  const percentage = Math.round(opacity * 100);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  if (compact) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-8 text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors shrink-0"
          title={`Transparansi: ${percentage}%`}
        >
          {percentage === 0 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-accent-brand" />}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1500] p-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-xl min-w-[180px]"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-1">
                <span className="font-medium text-neutral-600 dark:text-neutral-300">Transparansi</span>
                <span className="font-mono text-accent-brand font-medium">{percentage}%</span>
              </div>
              <Slider
                value={[opacity]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(val) => setOpacity(val[0])}
                className="cursor-pointer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm min-w-[200px] transition-colors duration-300">
      <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
        <div className="flex items-center gap-1.5">
          {percentage === 0 ? (
            <EyeOff className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-accent-brand" />
          )}
          <span className="font-medium text-neutral-600 dark:text-neutral-300">Transparansi Radar</span>
        </div>
        <span className="font-mono text-xs text-accent-brand font-medium">{percentage}%</span>
      </div>
      <div className="py-1">
        <Slider
          value={[opacity]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(val) => setOpacity(val[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}

export default OpacitySlider;
