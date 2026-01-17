const express = require("express");
const router = express.Router();

const {
  getPollutionPrediction,
} = require("../controllers/prediction.controller");

router.get("/:zoneId", getPollutionPrediction);

module.exports = router;
