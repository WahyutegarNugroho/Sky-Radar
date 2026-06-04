import React from 'react';
import PropTypes from 'prop-types';

function HourlyTrendChart({ hourly }) {
  if (!hourly || hourly.length < 6) return null;

  const temps = hourly.map((h) => h.temperature_2m);
  const precip = hourly.map((h) => h.precipitation || 0);
  const tempMin = Math.min(...temps);
  const tempMax = Math.max(...temps);
  const tempRange = tempMax - tempMin || 1;
  const precipMax = Math.max(...precip) || 1;

  const w = 280;
  const h = 100;
  const pad = { top: 6, bottom: 18, left: 4, right: 4 };
  const chartW = w - pad.left - pad.right;
  const stepX = chartW / (hourly.length - 1);

  const toX = (i) => pad.left + i * stepX;
  const toTempY = (v) => pad.top + h - pad.bottom - ((v - tempMin) / tempRange) * (h - pad.top - pad.bottom - 24);
  const toPrecipY = (v) => pad.top + h - pad.bottom - (v / precipMax) * (h - pad.top - pad.bottom);

  const tempPoints = temps.map((v, i) => `${toX(i)},${toTempY(v)}`).join(' ');

  const timeLabels = [];
  const step = Math.max(1, Math.floor(hourly.length / 6));
  for (let i = 0; i < hourly.length; i += step) {
    const date = new Date(hourly[i].time);
    timeLabels.push({ idx: i, label: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Tren 24 Jam</span>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[100px] overflow-visible">
        {/* Precip bars */}
        {precip.map((v, i) =>
          v > 0 ? (
            <rect
              key={`p-${i}`}
              x={toX(i) - 2}
              y={toPrecipY(v)}
              width={4}
              height={h - pad.bottom - toPrecipY(v)}
              fill="#94a3b8"
              opacity={0.35}
              rx={1}
            />
          ) : null
        )}

        {/* Temp line */}
        <path
          d={`M${tempPoints}`}
          fill="none"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Temp dots */}
        {temps.map((v, i) => (
          <circle key={`td-${i}`} cx={toX(i)} cy={toTempY(v)} r="2" fill="#f97316" />
        ))}

        {/* Temp labels every few hours */}
        {temps.map((v, i) => {
          if (i % step !== 0 && i !== hourly.length - 1) return null;
          return (
            <text
              key={`tl-${i}`}
              x={toX(i)}
              y={toTempY(v) - 5}
              textAnchor="middle"
              className="fill-neutral-400 text-[6px] font-mono"
            >
              {Math.round(v)}&deg;
            </text>
          );
        })}

        {/* Time labels */}
        {timeLabels.map(({ idx, label }) => (
          <text
            key={`time-${idx}`}
            x={toX(idx)}
            y={h - 2}
            textAnchor="middle"
            className="fill-neutral-400 text-[6px] font-medium"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

HourlyTrendChart.propTypes = {
  hourly: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string,
      temperature_2m: PropTypes.number,
      precipitation: PropTypes.number,
      weather_code: PropTypes.number,
      wind_speed_10m: PropTypes.number,
    })
  ),
};

export default HourlyTrendChart;