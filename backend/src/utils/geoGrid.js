const MicroZone = require("../models/MicroZone.model");
const findOrCreateMicroZone = async (lng, lat, city = "Unknown") => {
  let zone = await MicroZone.findOne({
    center: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 500,
      },
    },
  });

  if (!zone) {
    zone = await MicroZone.create({
      zoneId: `ZONE-${Date.now()}`,
      city,
      center: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
  }

  return zone;
};

module.exports = { findOrCreateMicroZone };
