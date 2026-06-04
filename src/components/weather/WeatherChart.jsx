import React from 'react';
import PropTypes from 'prop-types';

function WeatherChart({ daily }) {
  if (!daily?.length) return null;

  const highs = daily.map(d => d.temp_max);
  const lows = daily.map(d => d.temp_min);

  const allTemps = [...highs, ...lows];
  const tempMin = Math.min(...allTemps);
  const tempMax = Math.max(...allTemps);
  const range = tempMax - tempMin || 1;

  const w = 240;
  const h = 80;
  const pad = { top: 4, bottom: 20, left: 0, right: 0 };
  const chartW = w - pad.left - pad.right;
  const stepX = chartW / (daily.length - 1);

  const toX = (i) => pad.left + i * stepX;
  const toY = (v) => pad.top + h - pad.bottom - ((v - tempMin) / range) * (h - pad.top - pad.bottom);

  const catmullRom = (points, tension = 0.3) => {
    const p = points.split(' ').map(pt => pt.split(',').map(Number));
    if (p.length < 2) return points;
    const result = [`M${p[0][0]},${p[0][1]}`];
    for (let i = 0; i < p.length - 1; i++) {
      const curr = p[i];
      const next = p[i + 1];
      const cp1x = curr[0] + (next[0] - p[Math.max(i - 1, 0)][0]) * tension / 2;
      const cp1y = curr[1] + (next[1] - p[Math.max(i - 1, 0)][1]) * tension / 2;
      const cp2x = next[0] - (p[Math.min(i + 2, p.length - 1)][0] - curr[0]) * tension / 2;
      const cp2y = next[1] - (p[Math.min(i + 2, p.length - 1)][1] - curr[1]) * tension / 2;
      result.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${next[0]},${next[1]}`);
    }
    return result.join(' ');
  };

  const highPoints = highs.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const lowPoints = lows.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const highPath = catmullRom(highPoints);
  const lowPath = catmullRom(lowPoints);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Prakiraan Suhu 7 Hari</span>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[80px] overflow-visible">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {highs.map((v, i) => (
          <text key={`hl-${i}`} x={toX(i)} y={toY(v) - 5} textAnchor="middle" className="fill-neutral-400 text-[7px] font-mono">
            {Math.round(v)}&deg;
          </text>
        ))}
        {lows.map((v, i) => (
          <text key={`ll-${i}`} x={toX(i)} y={toY(v) + 11} textAnchor="middle" className="fill-neutral-500 text-[7px] font-mono">
            {Math.round(v)}&deg;
          </text>
        ))}

        <path d={`${highPath} L${toX(daily.length - 1)},${toY(tempMin)} L${toX(0)},${toY(tempMin)} Z`} fill="url(#chartArea)" />

        <path d={highPath} fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={lowPath} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

WeatherChart.propTypes = {
  daily: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string,
    temp_max: PropTypes.number,
    temp_min: PropTypes.number,
  })),
};

export default WeatherChart;