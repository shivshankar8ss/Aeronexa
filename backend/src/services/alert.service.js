const Alert = require("../models/Alert.model");

const ALERT_COOLDOWN_MINUTES = 60; // 1 hour

const createAlertIfNeeded = async (zoneId, prediction) => {
  if (prediction.risk !== "high") return null;

  const since = new Date(Date.now() - ALERT_COOLDOWN_MINUTES * 60 * 1000);

  const recentAlert = await Alert.findOne({
    zone: zoneId,
    triggeredAt: { $gte: since },
  });

  if (recentAlert) {
    return null; // avoid spam
  }

  const alert = await Alert.create({
    zone: zoneId,
    riskLevel: prediction.risk,
    message: `High pollution expected in this area within ${prediction.predictedWindow}`,
  });

  return alert;
};

module.exports = { createAlertIfNeeded };
