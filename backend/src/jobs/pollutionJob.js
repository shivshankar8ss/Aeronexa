const cron = require("node-cron");
const MicroZone = require("../models/MicroZone.model");
const { predictPollutionSpike } = require("../services/prediction.service");
const { createAlertIfNeeded } = require("../services/alert.service");


const startPollutionJob = () => {
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running pollution monitoring job...");

    const zones = await MicroZone.find({ active: true });

    for (const zone of zones) {
      const prediction = await predictPollutionSpike(zone._id);
      await createAlertIfNeeded(zone._id, prediction);
    }
  });
};

module.exports = startPollutionJob;
