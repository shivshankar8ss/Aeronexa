const Alert = require("../models/Alert.model");
const redisClient = require("../config/redis");

exports.getAlertsByZone = async (req, res, next) => {
  try {
    const { zoneId } = req.params;
    const cacheKey = `alerts:${zoneId}`;

    // 1️⃣ Check Redis cache first
    const cachedAlerts = await redisClient.get(cacheKey);
    if (cachedAlerts) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedAlerts),
        cached: true,
      });
    }

    const alerts = await Alert.find({ zone: zoneId })
      .sort({ triggeredAt: -1 })
      .limit(10);

    await redisClient.setEx(
      cacheKey,
      300, 
      JSON.stringify(alerts)
    );

    res.status(200).json({
      success: true,
      data: alerts,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
};
