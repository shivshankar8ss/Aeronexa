const { getPredictions } = require('../services/predict.service');
const { getAqiCategory, getAqiColor } = require('../services/aqi.service');

// @desc    GET /api/predict
// @access  Protected
const getPredictHandler = async (req, res, next) => {
  try {
    const { steps = 6 } = req.query;
    const predictions = await getPredictions(req.user._id, parseInt(steps));

    const enriched = predictions.map((p) => ({
      ...p,
      category: getAqiCategory(p.aqi),
      color: getAqiColor(p.aqi),
    }));

    res.json({
      success: true,
      algorithm: 'moving_average_with_trend',
      windowSize: 8,
      predictions: enriched,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPredictHandler };
