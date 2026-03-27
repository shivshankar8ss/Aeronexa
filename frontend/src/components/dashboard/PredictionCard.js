import React from 'react';
import { getAqiMeta } from '../../utils/aqi.utils';

export default function PredictionCard({ predictions }) {
  if (!predictions?.length) {
    return (
      <div className="card">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">AQI Forecast</p>
        <p className="text-sm text-gray-400 text-center py-6">Not enough data for predictions yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AQI Forecast</p>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg font-mono">
          Moving Avg
        </span>
      </div>

      <div className="space-y-2">
        {predictions.map((p, i) => {
          const meta = getAqiMeta(p.aqi);
          const barWidth = Math.min(100, (p.aqi / 300) * 100);
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-12 flex-shrink-0">{p.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, backgroundColor: meta.textColor }}
                />
              </div>
              <span className="text-xs font-bold w-8 text-right" style={{ color: meta.textColor }}>
                {p.aqi}
              </span>
              <span className="text-xs" title={meta.label}>{meta.emoji}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <p className="text-xs text-gray-400">
          🔮 Based on your last 8 readings with linear trend dampening.
        </p>
      </div>
    </div>
  );
}
