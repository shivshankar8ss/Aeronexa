import React, { useState } from 'react';
import AqiHistoryChart from '../charts/AqiHistoryChart';
import ExposureBarChart from '../charts/ExposureBarChart';
import HealthTrendChart from '../charts/HealthTrendChart';

const TABS = [
  { id: 'history',  label: 'AQI History'    },
  { id: 'exposure', label: 'Exposure'        },
  { id: 'health',   label: 'Health Trend'   },
];

export default function ChartsPanel({ logs }) {
  const [active, setActive] = useState('history');

  return (
    <div className="card">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${active === tab.id
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'history'  && <AqiHistoryChart logs={logs} />}
      {active === 'exposure' && <ExposureBarChart logs={logs} />}
      {active === 'health'   && <HealthTrendChart logs={logs} />}
    </div>
  );
}
