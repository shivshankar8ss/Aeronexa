const mongoose = require("mongoose");

const exposureSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroZone",
      required: true,
    },

    aqi: {
      type: Number,
      required: true,
    },

    exposureMinutes: {
      type: Number,
      required: true,
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

exposureSchema.index({ userId: 1, recordedAt: -1 });

module.exports = mongoose.model("Exposure", exposureSchema);
