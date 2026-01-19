const PollutionData = require("../models/PollutionData.model");
const { findOrCreateMicroZone } = require("../utils/geoGrid");
const PollutionReading = require("../models/PollutionReading");

exports.addPollutionData = async (req, res, next) => {
  try {
    const { latitude, longitude, aqi, pm25, pm10, city } = req.body;

    if (!latitude || !longitude || !aqi || !pm25 || !pm10) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const zone = await findOrCreateMicroZone(longitude, latitude, city);

    const pollution = await PollutionData.create({
      zone: zone._id,
      aqi,
      pm25,
      pm10,
      source: "api",
    });

    res.status(201).json({
      success: true,
      data: pollution,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPollutionHistory = async (req, res, next) => {
  try {
    const { zoneId } = req.params;

    const since = new Date();
    since.setHours(since.getHours() - 24);

    const readings = await PollutionReading.find({
      zone: zoneId,
      timestamp: { $gte: since },
    })
      .sort({ timestamp: 1 })
      .select("aqi timestamp");

    res.status(200).json({
      success: true,
      data: readings,
    });
  } catch (err) {
    next(err);
  }
};