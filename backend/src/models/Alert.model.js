const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroZone",
      required: true,
      index: true,
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    triggeredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ zone: 1, triggeredAt: -1 });
module.exports = mongoose.model("Alert", alertSchema);
