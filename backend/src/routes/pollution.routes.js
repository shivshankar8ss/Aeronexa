const express = require("express");
const router = express.Router();

const {
  getPollutionHistory,
} = require("../controllers/pollution.controller");

const { protect } = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimit.middleware"); // ✅ ADD THIS

router.get(
  "/history/:zoneId",
  protect,
  rateLimiter({
    windowSec: 900,
    maxRequests: 100,
    prefix: "pollution",
  }),
  getPollutionHistory
);

module.exports = router;
