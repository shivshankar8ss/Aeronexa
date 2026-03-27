const AqiLog = require('../models/aqiLog.model');
const HealthData = require('../models/healthData.model');

/**
 * Health Score System:
 * - AQI < 50        → no impact (0 deduction)
 * - AQI 50–100      → mild impact (0.5 pts / hour)
 * - AQI 100–200     → moderate impact (2 pts / hour)
 * - AQI 200+        → severe impact (4 pts / hour)
 */
const calcDeduction = (aqi, durationMinutes) => {
  const hours = durationMinutes / 60;
  if (aqi < 50)  return 0;
  if (aqi < 100) return hours * 0.5;
  if (aqi < 200) return hours * 2;
  return hours * 4;
};

const getRiskLevel = (score) => {
  if (score >= 80) return 'Low';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'High';
  return 'Critical';
};

const getStatusMessage = (score) => {
  if (score >= 80) return 'Your health status looks great. Keep monitoring!';
  if (score >= 60) return 'Moderate exposure detected. Consider precautions.';
  if (score >= 40) return 'High exposure risk. Limit outdoor activities.';
  return 'Critical exposure levels. Seek medical advice if symptomatic.';
};

// Recalculate health score from last 48 hours of logs
const recalculateHealth = async (userId) => {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const logs = await AqiLog.find({ userId, createdAt: { $gte: cutoff } }).sort({ createdAt: 1 });

  let score = 100;
  const breakdown = { noImpact: 0, mild: 0, moderate: 0, severe: 0 };

  for (const log of logs) {
    const deduction = calcDeduction(log.aqi, log.duration || 60);
    score -= deduction;
    const hrs = (log.duration || 60) / 60;
    if (log.aqi < 50)       breakdown.noImpact += hrs;
    else if (log.aqi < 100) breakdown.mild     += hrs;
    else if (log.aqi < 200) breakdown.moderate += hrs;
    else                     breakdown.severe   += hrs;
  }

  score = Math.max(0, Math.round(Math.min(100, score)));
  const riskLevel = getRiskLevel(score);

  // Weekly average
  const weekCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekLogs = await AqiLog.find({ userId, createdAt: { $gte: weekCutoff } });
  const weeklyAvgAqi = weekLogs.length
    ? Math.round(weekLogs.reduce((sum, l) => sum + l.aqi, 0) / weekLogs.length)
    : 0;

  const totalMinutes = logs.reduce((sum, l) => sum + (l.duration || 60), 0);
  const lastLog = logs[logs.length - 1];

  const health = await HealthData.findOneAndUpdate(
    { userId },
    {
      healthScore: score,
      riskLevel,
      totalExposureMinutes: totalMinutes,
      weeklyAvgAqi,
      lastAqi: lastLog?.aqi || 0,
      lastUpdated: new Date(),
      impactBreakdown: breakdown,
    },
    { upsert: true, new: true }
  );

  return {
    healthScore: score,
    riskLevel,
    statusMessage: getStatusMessage(score),
    weeklyAvgAqi,
    totalExposureHours: parseFloat((totalMinutes / 60).toFixed(1)),
    impactBreakdown: breakdown,
    lastAqi: lastLog?.aqi || 0,
    logsAnalyzed: logs.length,
  };
};

module.exports = { recalculateHealth, getRiskLevel, getStatusMessage, calcDeduction };
