import React, { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CATS = [
  { label: 'Good',                          color: '#16a34a' },
  { label: 'Moderate',                      color: '#ca8a04' },
  { label: 'Unhealthy for Sensitive Groups', color: '#ea580c' },
  { label: 'Unhealthy',                     color: '#dc2626' },
  { label: 'Very Unhealthy',                color: '#9333ea' },
  { label: 'Hazardous',                     color: '#be123c' },
];

export default function ExposureBarChart({ logs }) {
  const counts = useMemo(() => {
    const map = {};
    CATS.forEach((c) => { map[c.label] = 0; });
    (logs || []).forEach((l) => {
      if (map[l.category] !== undefined) map[l.category]++;
    });
    return map;
  }, [logs]);

  const data = {
    labels: CATS.map((c) => c.label.length > 12 ? c.label.substring(0, 12) + '…' : c.label),
    datasets: [{
      label: 'Hours',
      data: CATS.map((c) => counts[c.label] || 0),
      backgroundColor: CATS.map((c) => c.color + '99'),
      borderColor: CATS.map((c) => c.color),
      borderWidth: 1.5,
      borderRadius: 6,
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
        callbacks: { label: (ctx) => ` ${ctx.raw} log(s)` },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', font: { size: 9 } },
        grid:  { display: false },
        border: { color: '#f3f4f6' },
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 1 },
        grid:  { color: '#f9fafb' },
        border: { color: '#f3f4f6' },
        min: 0,
      },
    },
  };

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Exposure by Category
      </p>
      <div style={{ height: 220 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
