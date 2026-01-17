const { predictPollutionSpike } = require("../services/prediction.service");
const { createAlertIfNeeded } = require("../services/alert.service");

exports.getPollutionPrediction = async (req, res, next) => {
  try {
    const { zoneId } = req.params;

    const prediction = await predictPollutionSpike(zoneId);

    const alert = await createAlertIfNeeded(zoneId, prediction);

    res.status(200).json({
      success: true,
      data: {
        prediction,
        alert,
      },
    });
  } catch (error) {
    next(error);
  }
};
