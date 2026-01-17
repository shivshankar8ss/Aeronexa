const Alert = require("../models/Alert.model");

exports.getAlertsByZone = async (req, res, next) => {
  try {
    const { zoneId } = req.params;

    const alerts = await Alert.find({ zone: zoneId })
      .sort({ triggeredAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};
