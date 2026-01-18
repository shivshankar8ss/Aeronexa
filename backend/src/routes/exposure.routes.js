const express = require("express");
const router = express.Router();

const {
  trackExposure,
  getDailySummary,
} = require("../controllers/exposure.controller");

router.post("/", trackExposure);
router.get("/daily/:userId", getDailySummary);

module.exports = router;
