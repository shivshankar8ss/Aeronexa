const mongoose = require("mongoose");

const microZoneSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    center: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    radius: {
      type: Number, // meters
      default: 500,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

microZoneSchema.index({ center: "2dsphere" });

module.exports = mongoose.model("MicroZone", microZoneSchema);
