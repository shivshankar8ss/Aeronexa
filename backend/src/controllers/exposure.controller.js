const {
  logExposure,
  getDailyExposure,
} = require("../services/exposure.service");

exports.trackExposure = async (req, res, next) => {
  try {
    const { userId, zoneId, minutes } = req.body;

    const exposure = await logExposure(userId, zoneId, minutes);

    res.status(201).json({
      success: true,
      data: exposure,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDailySummary = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const summary = await getDailyExposure(userId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
