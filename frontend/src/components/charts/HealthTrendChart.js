import React, { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatDate } from '../../utils/aqi.utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

// Simulate health score at each point in time
const calcScoreAt = (logs, upToIndex) => {
  let score = 100;
  const subset = logs.slice(0, upToIndex + 1);
  for (const log of subset) {
    const hrs = (log.duration || 60) / 60;
    if (log.aqi >= 200)      score -= hrs * 4;
    else if (log.aqi >= 100) score -= hrs * 2;
    else if (log.aqi >= 50)  score -= hrs * 0.5;
  }
  return Math.max(0, Math.round(Math.min(100, score)));
};

export default function HealthTrendChart({ logs }) {
  const sorted = useMemo(() => [...(logs || [])].reverse().slice(-24), [logs]);

  const labels = sorted.map((l) => formatDate(l.createdAt));
  const values = sorted.map((_, i) => calcScoreAt(sorted, i));

  const data = {
    labels,
    datasets: [{
      label: 'Health Score',
      data: values,
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22,163,74,0.06)',
      pointBackgroundColor: '#16a34a',
      pointRadius: 3,
      pointHoverRadius: 5,
      fill: true,
      tension: 0.4,
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#374151',
        bodyColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 10,
        callbacks: { label: (ctx) => ` Score: ${ctx.raw}/100` },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', font: { size: 10, family: 'JetBrains Mono' }, maxTicksLimit: 8 },
        grid:  { color: '#f9fafb' },
        border: { color: '#f3f4f6' },
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 10 } },
        grid:  { color: '#f9fafb' },
        border: { color: '#f3f4f6' },
        min: 0, max: 100,
      },
    },
  };

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Health Score Trend
      </p>
      <div style={{ height: 220 }}>
        {sorted.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-300">
            No data yet
          </div>
        )}
      </div>
    </div>
  );
}
