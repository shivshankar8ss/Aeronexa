const { recalculateHealth } = require('../services/health.service');
const { getAdvice } = require('../services/advice.service');
const HealthData = require('../models/healthData.model');

// @desc    GET /api/health
// @access  Protected
const getHealth = async (req, res, next) => {
  try {
    const result = await recalculateHealth(req.user._id);
    const advice = getAdvice(result.lastAqi, result.totalExposureHours, result.weeklyAvgAqi);
    res.json({ success: true, data: { ...result, advice } });
  } catch (error) {
    next(error);
  }
};

// @desc    GET /api/health/summary
// @access  Protected
const getHealthSummary = async (req, res, next) => {
  try {
    const health = await HealthData.findOne({ userId: req.user._id });
    if (!health) {
      return res.json({ success: true, data: { healthScore: 100, riskLevel: 'Low', message: 'No exposure data yet.' } });
    }
    res.json({ success: true, data: health });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHealth, getHealthSummary };
