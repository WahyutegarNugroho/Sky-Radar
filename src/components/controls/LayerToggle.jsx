import React from 'react';
import { CloudRain, Satellite } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

function LayerToggle({ compact }) {
  const { layerType, setLayerType } = useMap();

  if (compact) {
    return (
      <>
        <button
          onClick={() => setLayerType('radar')}
          className={`flex items-center justify-center w-11 h-11 text-xs font-medium rounded-xl transition-all duration-150 active:scale-90 ${
            layerType === 'radar'
              ? 'bg-accent-brand text-white'
              : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
          }`}
          title="Radar"
        >
          <CloudRain className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={() => setLayerType('satellite')}
          className={`flex items-center justify-center w-11 h-11 text-xs font-medium rounded-xl transition-all duration-150 active:scale-90 ${
            layerType === 'satellite'
              ? 'bg-accent-brand text-white'
              : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
          }`}
          title="Satelit"
        >
          <Satellite className="w-4.5 h-4.5" />
        </button>
      </>
    );
  }

  return (
    <div className="inline-flex gap-1 p-1 bg-white/90 dark:bg-neutral-900/90 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm">
      <button
        onClick={() => setLayerType('radar')}
        className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
          layerType === 'radar'
            ? 'bg-accent-brand text-white'
            : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
        }`}
      >
        <CloudRain className="w-3 h-3" />
        Radar
      </button>
      <button
        onClick={() => setLayerType('satellite')}
        className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
          layerType === 'satellite'
            ? 'bg-accent-brand text-white'
            : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
        }`}
      >
        <Satellite className="w-3 h-3" />
        Satelit
      </button>
    </div>
  );
}

export default LayerToggle;