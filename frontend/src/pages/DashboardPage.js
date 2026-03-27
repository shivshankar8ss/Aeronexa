import React from 'react';
import { useAqi } from '../context/AqiContext';
import { useAuth } from '../context/AuthContext';
import { getAqiMeta } from '../utils/aqi.utils';

import AqiHeroCard     from '../components/dashboard/AqiHeroCard';
import HealthScoreCard from '../components/dashboard/HealthScoreCard';
import PredictionCard  from '../components/dashboard/PredictionCard';
import AdvicePanel     from '../components/dashboard/AdvicePanel';
import ChartsPanel     from '../components/dashboard/ChartsPanel';
import ExposureHeatmap from '../components/dashboard/ExposureHeatmap';
import RecentLogsTable from '../components/dashboard/RecentLogsTable';
import AlertBanner     from '../components/ui/AlertBanner';
import StatCard        from '../components/ui/StatCard';

export default function DashboardPage() {
  const { user }                                                  = useAuth();
  const { currentAqi, health, predictions, history, stats,
          heatmap, location, loadingAqi, refresh }                = useAqi();

  const aqi  = currentAqi?.aqi;
  const meta = aqi != null ? getAqiMeta(aqi) : null;

  //alert variant
  const alertVariant = aqi > 200 ? 'danger' : aqi > 100 ? 'warning' : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's your air quality overview</p>
        </div>
        <button onClick={refresh} className="btn-secondary hidden sm:flex items-center gap-2">
          <span>↻</span> Refresh
        </button>
      </div>

      {/* Alert banner */}
      {alertVariant && meta && (
        <AlertBanner
          variant={alertVariant}
          title={`${meta.emoji} ${meta.label} — AQI ${aqi}`}
          description={meta.effect + '. Take necessary precautions.'}
        />
      )}

      {/* TOP ROW: AQI | Health | Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AqiHeroCard
          data={currentAqi}
          loading={loadingAqi}
          onRefresh={refresh}
          location={location}
        />
        <HealthScoreCard health={health} />
        <PredictionCard predictions={predictions} />
      </div>

      {/* STATS ROW */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard label="Avg AQI (7d)"    value={stats.avg}       icon="📊" color="blue"   />
          <StatCard label="Max AQI"         value={stats.max}       icon="📈" color="red"    />
          <StatCard label="Min AQI"         value={stats.min}       icon="📉" color="green"  />
          <StatCard label="Good Air Days"   value={stats.goodDays}  icon="✅" color="green"  />
          <StatCard label="Total Logs"      value={stats.totalLogs} icon="📋" color="purple" />
        </div>
      )}

      {/* CHARTS + ADVICE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ChartsPanel logs={history} />
        </div>
        <AdvicePanel advice={currentAqi?.advice || health?.advice} />
      </div>

      {/* HEATMAP + LOG TABLE */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ExposureHeatmap heatmap={heatmap} />
        <RecentLogsTable logs={history} />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
