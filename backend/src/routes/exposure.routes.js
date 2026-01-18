const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");

const {
  trackExposure,
  getDailySummary,
} = require("../controllers/exposure.controller");

router.post("/", protect, trackExposure);
router.get("/daily", protect, getDailySummary);

module.exports = router;
