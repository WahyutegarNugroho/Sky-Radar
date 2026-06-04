import React from 'react';
import { Moon, Sun, Satellite } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

function MapStyleSelector({ compact }) {
  const { mapStyle, setMapStyle } = useMap();

  const styles = [
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'satellite', icon: Satellite, label: 'Satelit' },
  ];

  if (compact) {
    return (
      <div className="inline-flex gap-0.5 p-0.5 bg-white/90 dark:bg-neutral-900/90 border border-gray-100 dark:border-neutral-800 rounded-lg shadow-sm shrink-0">
        {styles.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMapStyle(key)}
            className={`flex items-center justify-center w-7 h-7 text-xs font-medium rounded-md transition-colors ${
              mapStyle === key
                ? 'bg-accent-brand text-white'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
            title={key === 'dark' ? 'Dark' : key === 'light' ? 'Light' : 'Satelit'}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="inline-flex gap-1 p-1 bg-white/90 dark:bg-neutral-900/90 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm">
      {styles.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setMapStyle(key)}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            mapStyle === key
              ? 'bg-accent-brand text-white'
              : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Icon className="w-3 h-3" />
          {label}
        </button>
      ))}
    </div>
  );
}

export default MapStyleSelector;