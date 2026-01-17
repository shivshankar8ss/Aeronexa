const express = require("express");
const router = express.Router();

const { getAlertsByZone } = require("../controllers/alert.controller");

router.get("/:zoneId", getAlertsByZone);

module.exports = router;
