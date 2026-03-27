import React from 'react';
import { getRiskMeta } from '../../utils/aqi.utils';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HealthScoreCard({ health }) {
  const score = health?.healthScore ?? 100;
  const risk  = health?.riskLevel  ?? 'Low';
  const meta  = getRiskMeta(risk);
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * score) / 100;

  const scoreColor =
    score >= 80 ? '#16a34a' :
    score >= 60 ? '#ca8a04' :
    score >= 40 ? '#ea580c' : '#dc2626';

  return (
    <div className="card flex flex-col">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Health Score</p>

      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.5s ease, stroke 0.5s' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-gray-900 leading-none">{score}</span>
            <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Risk Level</p>
            <span
              className="badge border text-xs font-bold"
              style={{ color: meta.textColor, backgroundColor: meta.bgColor, borderColor: meta.borderColor }}
            >
              {risk}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Exposure</p>
            <p className="text-sm font-semibold text-gray-700">{health?.totalExposureHours ?? 0}h tracked</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Weekly Avg AQI</p>
            <p className="text-sm font-semibold text-gray-700">{health?.weeklyAvgAqi ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Status message */}
      {health?.statusMessage && (
        <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-50 leading-relaxed">
          {health.statusMessage}
        </p>
      )}

      {/* Impact breakdown */}
      {health?.impactBreakdown && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { label: 'No Impact', val: health.impactBreakdown.noImpact, color: 'bg-green-100 text-green-700' },
            { label: 'Mild',      val: health.impactBreakdown.mild,     color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Moderate',  val: health.impactBreakdown.moderate, color: 'bg-orange-100 text-orange-700' },
            { label: 'Severe',    val: health.impactBreakdown.severe,   color: 'bg-red-100 text-red-700' },
          ].map((item) => (
            <div key={item.label} className={`flex justify-between items-center px-2 py-1.5 rounded-lg text-xs font-medium ${item.color}`}>
              <span>{item.label}</span>
              <span className="font-bold">{parseFloat(item.val || 0).toFixed(1)}h</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
