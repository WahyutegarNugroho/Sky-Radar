import React from 'react';
import { CloudRain, Satellite } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

function LayerToggle() {
  const { layerType, setLayerType } = useMap();

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