import React from 'react';
import PropTypes from 'prop-types';
import { Play, Pause, SkipForward, SkipBack, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDateTime, isFuture } from '@/utils/helpers';

function TimelinePlayer({ radarList, currentIndex, isPlaying, onPlayToggle, onIndexChange, onNext, onPrev }) {
  if (!radarList || radarList.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-neutral-500 text-sm rounded-2xl transition-colors duration-300">
        Memuat linimasa cuaca...
      </div>
    );
  }

  const activeFrame = radarList[currentIndex];
  const isForecast = isFuture(activeFrame?.time);

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-gray-100 dark:border-neutral-800 w-full max-w-4xl mx-auto rounded-2xl shadow-xl transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 rounded-xl">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium font-mono tracking-wide text-neutral-800 dark:text-neutral-200">{formatDateTime(activeFrame?.time)}</span>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
            isForecast
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-900/30'
              : 'bg-blue-500/10 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-500/20 dark:border-blue-900/30'
          }`}>
            {isForecast ? 'Prakiraan' : 'Data Historis'}
          </span>
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">Frame {currentIndex + 1} / {radarList.length}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Historis</span>
        <div className="flex-1 px-1">
          <Slider
            value={[currentIndex]}
            min={0}
            max={radarList.length - 1}
            step={1}
            onValueChange={(val) => onIndexChange(val[0])}
            className="cursor-pointer"
          />
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Prakiraan</span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={onPrev}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-350 border border-gray-200 dark:border-neutral-750 shadow-sm flex items-center justify-center transition-all"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          onClick={onPlayToggle}
          size="icon"
          className={`h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 duration-200 ${
            isPlaying
              ? 'bg-gray-100 text-neutral-900 hover:bg-gray-200 border border-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:border-neutral-700'
              : 'bg-blue-700 text-white hover:bg-blue-800'
          }`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-neutral-900 dark:fill-neutral-200" />
          ) : (
            <Play className="h-5 w-5 fill-white ml-0.5" />
          )}
        </Button>
        <Button
          onClick={onNext}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-350 border border-gray-200 dark:border-neutral-750 shadow-sm flex items-center justify-center transition-all"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

TimelinePlayer.propTypes = {
  radarList: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentIndex: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onPlayToggle: PropTypes.func.isRequired,
  onIndexChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default TimelinePlayer;
