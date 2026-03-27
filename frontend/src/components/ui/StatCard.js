import React from 'react';

export default function StatCard({ label, value, sub, icon, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red:    'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    gray:   'bg-gray-100 text-gray-500',
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        {icon && (
          <span className={`text-lg w-8 h-8 flex items-center justify-center rounded-lg ${colors[color]}`}>
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1 leading-none">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
