const mongoose = require("mongoose");

const pollutionDataSchema = new mongoose.Schema(
  {
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroZone",
      required: true,
      index: true,
    },

    aqi: {
      type: Number,
      required: true,
      min: 0,
    },

    pm25: {
      type: Number,
      required: true,
      min: 0,
    },

    pm10: {
      type: Number,
      required: true,
      min: 0,
    },

    source: {
      type: String,
      enum: ["sensor", "api", "manual"],
      default: "api",
    },

    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

pollutionDataSchema.index({ zone: 1, recordedAt: -1 });

module.exports = mongoose.model("PollutionData", pollutionDataSchema);
