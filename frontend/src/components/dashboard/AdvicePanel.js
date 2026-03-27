import React from 'react';

export default function AdvicePanel({ advice }) {
  if (!advice?.length) return null;

  return (
    <div className="card">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Personalized Advice
      </p>
      <div className="space-y-2">
        {advice.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-150"
          >
            <span className="text-lg leading-none flex-shrink-0 mt-0.5">{item.icon}</span>
            <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
