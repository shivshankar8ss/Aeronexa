const mongoose = require("mongoose");

const pollutionReadingSchema = new mongoose.Schema(
  {
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroZone",
      required: true,
    },
    aqi: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      default: "sensor",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PollutionReading",
  pollutionReadingSchema
);
