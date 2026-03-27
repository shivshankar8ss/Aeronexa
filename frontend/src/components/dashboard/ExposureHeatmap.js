import React, { useMemo } from 'react';
import { getAqiMeta } from '../../utils/aqi.utils';

const DAYS = 28;

export default function ExposureHeatmap({ heatmap }) {
  const cells = useMemo(() => {
    const map = {};
    (heatmap || []).forEach((h) => { map[h.date] = h.avgAqi; });
    const result = [];
    const now = new Date();
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({ date: key, aqi: map[key] || 0 });
    }
    return result;
  }, [heatmap]);

  const getCellStyle = (aqi) => {
    if (!aqi) return { backgroundColor: '#f3f4f6' };
    const meta = getAqiMeta(aqi);
    const intensity = Math.min(1, aqi / 250);
    return {
      backgroundColor: meta.textColor,
      opacity: 0.2 + intensity * 0.8,
    };
  };

  return (
    <div className="card">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        28-Day Exposure Heatmap
      </p>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-1">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-300 font-mono">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) => (
          <div
            key={i}
            className="aspect-square rounded-md cursor-default transition-transform duration-150 hover:scale-125 hover:z-10 relative"
            style={getCellStyle(cell.aqi)}
            title={`${cell.date}: AQI ${cell.aqi || 'No data'}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-gray-400">Less</span>
        <div className="flex gap-1">
          {[0, 50, 100, 150, 250].map((v) => (
            <div
              key={v}
              className="w-3 h-3 rounded-sm"
              style={v === 0 ? { backgroundColor: '#f3f4f6' } : getCellStyle(v)}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">More</span>
      </div>
    </div>
  );
}
