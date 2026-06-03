import React from 'react';
import PropTypes from 'prop-types';

function Legend({ layerType }) {
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

  return (
    <div className="flex flex-col gap-2 p-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-md min-w-[160px] transition-colors duration-300">
      <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">{title}</span>
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
};

export default Legend;
