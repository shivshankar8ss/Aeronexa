import React, { useState } from 'react';
import { useAqi } from '../context/AqiContext';
import AqiHistoryChart  from '../components/charts/AqiHistoryChart';
import ExposureBarChart from '../components/charts/ExposureBarChart';
import HealthTrendChart from '../components/charts/HealthTrendChart';
import { getAqiMeta, formatDateFull } from '../utils/aqi.utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PERIODS = [
  { label: '24h', days: 1  },
  { label: '7d',  days: 7  },
  { label: '14d', days: 14 },
  { label: '28d', days: 28 },
];

export default function HistoryPage() {
  const { history, stats, fetchHistory } = useAqi();
  const [period, setPeriod] = useState(7);
  const [loading, setLoading] = useState(false);

  const handlePeriod = async (days) => {
    setPeriod(days);
    setLoading(true);
    await fetchHistory(days);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Exposure History</h1>
          <p className="text-sm text-gray-500 mt-0.5">Detailed AQI logs and analytics</p>
        </div>
        {/* Period selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => handlePeriod(p.days)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
                ${period === p.days ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading history…" />
      ) : (
        <>
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Average AQI', value: stats.avg,       color: '#3b82f6' },
                { label: 'Maximum AQI', value: stats.max,       color: '#dc2626' },
                { label: 'Minimum AQI', value: stats.min,       color: '#16a34a' },
                { label: 'Good Days',   value: stats.goodDays,  color: '#16a34a' },
              ].map((s) => (
                <div key={s.label} className="card text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-extrabold mt-1" style={{ color: s.color }}>{s.value ?? '—'}</p>
                </div>
              ))}
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="card"><AqiHistoryChart  logs={history} /></div>
            <div className="card"><ExposureBarChart logs={history} /></div>
            <div className="card xl:col-span-2"><HealthTrendChart logs={history} /></div>
          </div>

          {/* Full Log Table */}
          <div className="card">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Full Exposure Log ({history.length} entries)
            </p>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    {['Time', 'AQI', 'Category', 'Duration', 'Location'].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? history.map((log, i) => {
                    const meta = getAqiMeta(log.aqi);
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-xs text-gray-500">{formatDateFull(log.createdAt)}</td>
                        <td className="py-2.5 px-3 font-bold" style={{ color: meta.textColor }}>{log.aqi}</td>
                        <td className="py-2.5 px-3">
                          <span className="badge border text-xs" style={{ color: meta.textColor, backgroundColor: meta.bgColor, borderColor: meta.borderColor }}>
                            {meta.emoji} {log.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-400 font-mono">{log.duration || 60}m</td>
                        <td className="py-2.5 px-3 text-xs text-gray-400 font-mono">
                          {log.latitude?.toFixed(2)}°, {log.longitude?.toFixed(2)}°
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-300">No logs found for this period</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
