const mongoose = require('mongoose');

const aqiLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    aqi: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    category: {
      type: String,
      enum: ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'],
      required: true,
    },
    duration: {
      type: Number, // minutes
      default: 60,
      min: 1,
    },
    pollutants: {
      pm25: { type: Number, default: 0 },
      pm10: { type: Number, default: 0 },
      o3:   { type: Number, default: 0 },
      no2:  { type: Number, default: 0 },
      co:   { type: Number, default: 0 },
      so2:  { type: Number, default: 0 },
    },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    source: {
      type: String,
      enum: ['aqicn', 'openweather', 'simulated'],
      default: 'aqicn',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast user + date queries
aqiLogSchema.index({ userId: 1, createdAt: -1 });
aqiLogSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('AqiLog', aqiLogSchema);
