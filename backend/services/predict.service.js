const AqiLog = require('../models/aqiLog.model');

/**
 * Simple Moving Average prediction model.
 * Extendable for ML integration later.
 *
 * @param {number[]} data - Array of AQI values (oldest → newest)
 * @param {number} N      - Window size
 * @param {number} steps  - How many future steps to predict
 */
const movingAveragePredict = (data, N = 8, steps = 6) => {
  if (!data || data.length < 2) {
    return Array(steps).fill(50);
  }

  const window = data.slice(-N);
  const avg = window.reduce((a, b) => a + b, 0) / window.length;

  // Compute linear trend from last N points
  const n = window.length;
  const xMean = (n - 1) / 2;
  const yMean = avg;
  let num = 0, den = 0;
  window.forEach((y, i) => {
    num += (i - xMean) * (y - yMean);
    den += (i - xMean) ** 2;
  });
  const trend = den !== 0 ? num / den : 0;

  const predictions = [];
  for (let i = 1; i <= steps; i++) {
    // MA + dampened trend (trend fades over time)
    const dampen = Math.exp(-0.2 * i); // exponential decay
    const predicted = Math.round(Math.max(0, Math.min(500, avg + trend * i * dampen)));
    predictions.push(predicted);
  }

  return predictions;
};

const getPredictions = async (userId, steps = 6) => {
  // Get last 24 hours of logs for prediction
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const logs = await AqiLog.find({ userId, createdAt: { $gte: cutoff } })
    .sort({ createdAt: 1 })
    .select('aqi createdAt');

  const aqiValues = logs.map((l) => l.aqi);
  const predictions = movingAveragePredict(aqiValues, 8, steps);

  const now = new Date();
  return predictions.map((aqi, i) => ({
    hour: i + 1,
    predictedAt: new Date(now.getTime() + (i + 1) * 60 * 60 * 1000),
    aqi,
    label: `+${i + 1}h`,
  }));
};

module.exports = { getPredictions, movingAveragePredict };
