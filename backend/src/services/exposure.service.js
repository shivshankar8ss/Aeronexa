const Exposure = require("../models/Exposure.model");
const PollutionData = require("../models/PollutionData.model");

const logExposure = async (userId, zoneId, minutes = 10) => {
  const latest = await PollutionData.findOne({ zone: zoneId }).sort({
    recordedAt: -1,
  });

  if (!latest) return null;

  return await Exposure.create({
    userId,
    zone: zoneId,
    aqi: latest.aqi,
    exposureMinutes: minutes,
  });
};

const getDailyExposure = async (userId) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const data = await Exposure.aggregate([
    { $match: { userId, recordedAt: { $gte: since } } },
    {
      $group: {
        _id: null,
        totalMinutes: { $sum: "$exposureMinutes" },
        avgAQI: { $avg: "$aqi" },
      },
    },
  ]);

  return data[0] || { totalMinutes: 0, avgAQI: 0 };
};

module.exports = { logExposure, getDailyExposure };
