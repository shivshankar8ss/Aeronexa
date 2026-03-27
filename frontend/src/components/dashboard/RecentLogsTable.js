import React from 'react';
import { getAqiMeta, formatDateFull } from '../../utils/aqi.utils';

export default function RecentLogsTable({ logs }) {
  const recent = (logs || []).slice(0, 10);

  return (
    <div className="card">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Exposure Log</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">AQI</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody>
            {recent.length > 0 ? recent.map((log, i) => {
              const meta = getAqiMeta(log.aqi);
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-xs text-gray-500">
                    {formatDateFull(log.createdAt)}
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="font-bold text-sm" style={{ color: meta.textColor }}>{log.aqi}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className="badge border text-xs"
                      style={{ color: meta.textColor, backgroundColor: meta.bgColor, borderColor: meta.borderColor }}
                    >
                      {meta.emoji} {log.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-xs text-gray-400">{log.duration || 60}m</td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-300">No logs yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
