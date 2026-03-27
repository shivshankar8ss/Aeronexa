import React from 'react';
import { ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { getAqiMeta } from '../../utils/aqi.utils';

export default function AqiHeroCard({ data, loading, onRefresh, location }) {
  const meta = data ? getAqiMeta(data.aqi) : null;

  return (
    <div className="card relative overflow-hidden">
      {/* Color accent bar */}
      {meta && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: meta.textColor }}
        />
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Real-Time AQI</p>
          {location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-mono">
                {location.lat?.toFixed(3)}°N, {location.lon?.toFixed(3)}°E
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200 disabled:opacity-50"
          title="Refresh"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !data ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Fetching AQI…</p>
        </div>
      ) : data && meta ? (
        <>
          {/* Big AQI number */}
          <div className="flex items-end gap-3 my-2">
            <span
              className="text-7xl font-extrabold leading-none tracking-tighter transition-all duration-700"
              style={{ color: meta.textColor }}
            >
              {data.aqi}
            </span>
            <span className="text-sm text-gray-400 mb-2 font-mono">AQI</span>
          </div>

          {/* Category badge */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-3"
            style={{ color: meta.textColor, backgroundColor: meta.bgColor, borderColor: meta.borderColor }}
          >
            {meta.emoji} {meta.label}
          </span>

          {/* Health effect */}
          <p className="text-sm text-gray-500 leading-relaxed">{meta.effect}</p>

          {/* Pollutant chips */}
          {data.pollutants && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(data.pollutants).filter(([, v]) => v > 0).map(([key, val]) => (
                <span key={key} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono text-gray-500">
                  {key.toUpperCase()}: {typeof val === 'number' && val < 10 ? val.toFixed(1) : Math.round(val)}
                </span>
              ))}
            </div>
          )}

          {data.city && <p className="text-xs text-gray-400 mt-3">📍 {data.city}</p>}
          <p className="text-xs text-gray-300 mt-1 font-mono">
            {data.fromCache ? '⚡ Cached' : '🔴 Live'} · {new Date().toLocaleTimeString()}
          </p>
        </>
      ) : (
        <p className="text-gray-400 text-sm py-6 text-center">No data available</p>
      )}
    </div>
  );
}
