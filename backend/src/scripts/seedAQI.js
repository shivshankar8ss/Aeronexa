require("dotenv").config();
const mongoose = require("mongoose");
const PollutionReading = require("../models/PollutionReading");

const seedAQI = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected for seeding");
    const zoneId = "696bd13c4ec304d850d2aa0d";

    const now = new Date();

    const samples = Array.from({ length: 12 }).map((_, i) => ({
      zone: zoneId,
      aqi: 120 + Math.floor(Math.random() * 100),
      timestamp: new Date(now - i * 2 * 60 * 60 * 1000), // every 2 hours
    }));

    await PollutionReading.insertMany(samples);
    console.log("AQI data seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err);
    process.exit(1);
  }
};

seedAQI();

