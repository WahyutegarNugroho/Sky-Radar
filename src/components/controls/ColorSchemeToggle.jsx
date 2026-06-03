import React, { useState, useEffect, useRef } from 'react';
import { Settings, Check, Sun, Moon } from 'lucide-react';
import { COLOR_SCHEMES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useMap } from '@/contexts/MapContext';

function ColorSchemeToggle() {
  const { mapStyle, setMapStyle, colorSchemeId, setColorSchemeId, layerType, setLayerType } = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const activeScheme = COLOR_SCHEMES.find((s) => s.id === Number(colorSchemeId)) || COLOR_SCHEMES[0];
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e) { if (e.key === 'Escape') setIsOpen(false); }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="outline"
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-neutral-800 border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800 h-10 px-4 pointer-events-auto rounded-xl shadow-sm transition-colors duration-300"
      >
        <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-medium">{layerType === 'radar' ? activeScheme.name : 'Satelit'}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 z-[1000] w-64 p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-xl flex flex-col gap-4 max-h-[320px] overflow-y-auto custom-scrollbar transition-colors duration-300"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Peta Dasar</span>
              <div className="grid grid-cols-3 gap-1.5">
                <Button
                  onClick={() => setMapStyle('dark')}
                  size="sm"
                  variant={mapStyle === 'dark' ? 'default' : 'outline'}
                  className={`flex items-center justify-center gap-1 h-8 text-xs font-medium rounded-lg ${
                    mapStyle === 'dark'
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  Dark
                </Button>
                <Button
                  onClick={() => setMapStyle('light')}
                  size="sm"
                  variant={mapStyle === 'light' ? 'default' : 'outline'}
                  className={`flex items-center justify-center gap-1 h-8 text-xs font-medium rounded-lg ${
                    mapStyle === 'light'
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  Light
                </Button>
                <Button
                  onClick={() => setMapStyle('satellite')}
                  size="sm"
                  variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                  className={`flex items-center justify-center gap-1 h-8 text-xs font-medium rounded-lg ${
                    mapStyle === 'satellite'
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  Satelit
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Mode Radar / Satelit</span>
              <div className="grid grid-cols-2 gap-1.5">
                <Button
                  onClick={() => setLayerType('radar')}
                  size="sm"
                  variant={layerType === 'radar' ? 'default' : 'outline'}
                  className={`flex items-center justify-center h-8 text-xs font-medium rounded-lg ${
                    layerType === 'radar'
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  RainViewer
                </Button>
                <Button
                  onClick={() => setLayerType('satellite')}
                  size="sm"
                  variant={layerType === 'satellite' ? 'default' : 'outline'}
                  className={`flex items-center justify-center h-8 text-xs font-medium rounded-lg ${
                    layerType === 'satellite'
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  Himawari
                </Button>
              </div>
            </div>

            {layerType === 'radar' && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Skema Warna Radar</span>
                <div className="flex flex-col gap-1">
                  {COLOR_SCHEMES.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => { setColorSchemeId(scheme.id); }}
                      className={`flex items-center gap-2 px-2.5 py-2 text-xs transition-colors rounded-lg w-full ${
                        Number(colorSchemeId) === scheme.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-500/30 dark:border-blue-900/30'
                          : 'hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-transparent'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-sm" style={{ background: scheme.gradient || scheme.color }} />
                      <span className="font-medium">{scheme.name}</span>
                      {Number(colorSchemeId) === scheme.id && <Check className="w-3 h-3 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ColorSchemeToggle;
