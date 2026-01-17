const express = require("express");
const router = express.Router();

const {
  addPollutionData,
} = require("../controllers/pollution.controller");

router.post("/", addPollutionData);

module.exports = router;
