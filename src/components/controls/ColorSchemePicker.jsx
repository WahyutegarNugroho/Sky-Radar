import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check } from 'lucide-react';
import { COLOR_SCHEMES } from '@/utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useMap } from '@/contexts/MapContext';

function ColorSchemePicker({ inline }) {
  const { layerType, colorSchemeId, setColorSchemeId } = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const activeScheme = COLOR_SCHEMES.find((s) => s.id === Number(colorSchemeId)) || COLOR_SCHEMES[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (layerType !== 'radar') return null;

  if (inline) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium bg-gray-50 dark:bg-neutral-850 dark:text-neutral-200 border border-gray-100 dark:border-neutral-800 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-accent-brand" />
            <span>Skema Warna: <span className="font-semibold text-neutral-800 dark:text-neutral-100">{activeScheme.name}</span></span>
          </div>
          <span className="text-[10px] text-neutral-400">{isOpen ? 'Tutup' : 'Ubah'}</span>
        </button>
        {isOpen && (
          <div className="grid grid-cols-2 gap-1.5 p-2 bg-gray-55/50 dark:bg-neutral-850/40 border border-gray-100 dark:border-neutral-800 rounded-xl">
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => { setColorSchemeId(scheme.id); setIsOpen(false); }}
                className={`flex items-center gap-2 p-1.5 text-xs transition-colors rounded-lg ${
                  Number(colorSchemeId) === scheme.id
                    ? 'bg-accent-brand/10 text-accent-brand font-semibold'
                    : 'hover:bg-gray-50 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-350'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-sm border border-neutral-200 dark:border-neutral-700" style={{ background: scheme.gradient || scheme.color || '#888' }} />
                <span className="truncate">{scheme.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Skema Warna Radar"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-white/90 dark:bg-neutral-900/90 dark:text-neutral-200 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <Palette className="w-3 h-3 text-accent-brand" />
        {activeScheme.name}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 z-[1000] w-52 p-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-xl flex flex-col gap-0.5 max-h-[240px] overflow-y-auto custom-scrollbar"
          >
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => { setColorSchemeId(scheme.id); setIsOpen(false); }}
                className={`flex items-center gap-2 px-2.5 py-1.5 text-xs transition-colors rounded-lg ${
                  Number(colorSchemeId) === scheme.id
                    ? 'bg-accent-brand/10 text-accent-brand'
                    : 'hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-sm border border-neutral-200 dark:border-neutral-700" style={{ background: scheme.gradient || scheme.color || '#888' }} />
                <span className="font-medium">{scheme.name}</span>
                {Number(colorSchemeId) === scheme.id && <Check className="w-3 h-3 ml-auto shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ColorSchemePicker;