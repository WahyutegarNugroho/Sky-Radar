import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useMap } from '@/contexts/MapContext';

function OpacitySlider() {
  const { opacity, setOpacity } = useMap();
  const percentage = Math.round(opacity * 100);

  return (
    <div className="flex flex-col gap-2 p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-md min-w-[200px] transition-colors duration-300">
      <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
        <div className="flex items-center gap-1.5">
          {percentage === 0 ? (
            <EyeOff className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          )}
          <span className="font-medium text-neutral-600 dark:text-neutral-300">Transparansi Radar</span>
        </div>
        <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-medium">{percentage}%</span>
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
