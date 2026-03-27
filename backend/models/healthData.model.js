const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    healthScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'Low',
    },
    totalExposureMinutes: {
      type: Number,
      default: 0,
    },
    weeklyAvgAqi: {
      type: Number,
      default: 0,
    },
    lastAqi: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    // Cumulative impact breakdown
    impactBreakdown: {
      noImpact:   { type: Number, default: 0 }, // minutes AQI < 50
      mild:       { type: Number, default: 0 }, // 50-100
      moderate:   { type: Number, default: 0 }, // 100-200
      severe:     { type: Number, default: 0 }, // 200+
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HealthData', healthDataSchema);
