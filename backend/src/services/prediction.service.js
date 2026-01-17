const PollutionData = require("../models/PollutionData.model");


// Predict pollution spike for next 1–3 hours

const predictPollutionSpike = async (zoneId) => {
  // Fetch last 6 readings (~last 3 hours if data every 30 min)
  const recentData = await PollutionData.find({ zone: zoneId })
    .sort({ recordedAt: -1 })
    .limit(6);

  if (recentData.length < 3) {
    return {
      risk: "unknown",
      reason: "Not enough data",
    };
  }

  // Extract AQI values
  const aqiValues = recentData.map((d) => d.aqi);

  // Simple trend calculation
  const first = aqiValues[aqiValues.length - 1];
  const last = aqiValues[0];
  const trend = last - first;

  let risk = "low";

  if (last >= 300 || trend > 40) {
    risk = "high";
  } else if (last >= 200 || trend > 20) {
    risk = "medium";
  }

  return {
    risk,
    currentAQI: last,
    trend,
    predictedWindow: "1–3 hours",
  };
};

module.exports = { predictPollutionSpike };
