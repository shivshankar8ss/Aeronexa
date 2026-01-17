const { predictPollutionSpike } = require("../services/prediction.service");

exports.getPollutionPrediction = async (req, res, next) => {
  try {
    const { zoneId } = req.params;

    const prediction = await predictPollutionSpike(zoneId);

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};
