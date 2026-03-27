import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getAqiMeta, formatDate } from '../../utils/aqi.utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AqiHistoryChart({ logs }) {
  const sorted = [...(logs || [])].reverse().slice(-24);

  const labels  = sorted.map((l) => formatDate(l.createdAt));
  const values  = sorted.map((l) => l.aqi);
  const ptColors = values.map((v) => getAqiMeta(v).textColor);

  const data = {
    labels,
    datasets: [{
      label: 'AQI',
      data: values,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.06)',
      pointBackgroundColor: ptColors,
      pointBorderColor: ptColors,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4,
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#374151',
        bodyColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const meta = getAqiMeta(ctx.raw);
            return ` AQI ${ctx.raw} — ${meta.label}`;
          },
        },
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
        min: 0,
      },
    },
  };

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">AQI History (24h)</p>
      <div style={{ height: 220 }}>
        {sorted.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-300">
            No history yet — start tracking!
          </div>
        )}
      </div>
    </div>
  );
}
