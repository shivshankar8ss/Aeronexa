const AqiLog = require('../models/aqiLog.model');
const { getCurrentAqi, getAqiCategory } = require('../services/aqi.service');
const { getAdvice } = require('../services/advice.service');
const { recalculateHealth } = require('../services/health.service');

// @desc    GET /api/aqi/current?lat=&lon=
// @access  Protected
const getCurrentAqiHandler = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const data = await getCurrentAqi(parseFloat(lat), parseFloat(lon));
    const advice = getAdvice(data.aqi);
    res.json({ success: true, data: { ...data, advice } });
  } catch (error) {
    next(error);
  }
};

// @desc    POST /api/aqi/log
// @access  Protected
const logAqi = async (req, res, next) => {
  try {
    const { latitude, longitude, aqi, duration, pollutants, city, country, source } = req.body;
    const category = getAqiCategory(aqi);

    const log = await AqiLog.create({
      userId: req.user._id,
      latitude,
      longitude,
      aqi,
      category,
      duration: duration || 60,
      pollutants: pollutants || {},
      city: city || '',
      country: country || '',
      source: source || 'aqicn',
    });

    // Recalculate health score in background
    recalculateHealth(req.user._id).catch(console.error);

    res.status(201).json({ success: true, message: 'AQI exposure logged.', log });
  } catch (error) {
    next(error);
  }
};

// @desc    GET /api/aqi/history
// @access  Protected
const getHistory = async (req, res, next) => {
  try {
    const { limit = 48, days = 7 } = req.query;
    const cutoff = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    const logs = await AqiLog.find({ userId: req.user._id, createdAt: { $gte: cutoff } })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    // Weekly breakdown for heatmap (last 28 days)
    const heatmapCutoff = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
    const allLogs = await AqiLog.find({ userId: req.user._id, createdAt: { $gte: heatmapCutoff } })
      .select('aqi createdAt');

    // Group by date for heatmap
    const heatmap = {};
    allLogs.forEach((l) => {
      const key = l.createdAt.toISOString().split('T')[0];
      if (!heatmap[key]) heatmap[key] = { total: 0, count: 0 };
      heatmap[key].total += l.aqi;
      heatmap[key].count += 1;
    });
    const heatmapData = Object.entries(heatmap).map(([date, v]) => ({
      date,
      avgAqi: Math.round(v.total / v.count),
    }));

    // Stats
    const aqiVals = logs.map((l) => l.aqi);
    const avg = aqiVals.length ? Math.round(aqiVals.reduce((a, b) => a + b, 0) / aqiVals.length) : 0;
    const max = aqiVals.length ? Math.max(...aqiVals) : 0;
    const min = aqiVals.length ? Math.min(...aqiVals) : 0;
    const goodDays = [...new Set(
      logs.filter((l) => l.aqi <= 50).map((l) => l.createdAt.toISOString().split('T')[0])
    )].length;

    res.json({
      success: true,
      count: logs.length,
      stats: { avg, max, min, goodDays, totalLogs: logs.length },
      heatmap: heatmapData,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrentAqiHandler, logAqi, getHistory };
