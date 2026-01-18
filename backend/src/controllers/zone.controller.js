const { findOrCreateZone } = require("../utils/geoGrid");

exports.resolveZone = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude & longitude required" });
    }

    const zone = await findOrCreateZone(latitude, longitude);

    res.status(200).json({
      success: true,
      data: zone,
    });
  } catch (err) {
    next(err);
  }
};
